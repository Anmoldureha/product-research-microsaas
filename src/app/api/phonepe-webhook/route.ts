import { NextRequest, NextResponse } from "next/server";
import { verifyPhonePeChecksum } from "@/lib/phonepe";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers = request.headers;
    const checksum = headers.get("X-VERIFY");

    if (!checksum) {
      return NextResponse.json(
        { error: "Missing checksum" },
        { status: 400 }
      );
    }

    // Verify PhonePe checksum
    const isValid = verifyPhonePeChecksum(body, checksum);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid checksum" },
        { status: 400 }
      );
    }

    const data = JSON.parse(Buffer.from(body, "base64").toString());
    const { merchantTransactionId, transactionId, amount, state } = data.response;

    // Find the order
    const order = await db.order.findFirst({
      where: { phonepeTxnId: merchantTransactionId },
      include: { user: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update order status
    if (state === "COMPLETED") {
      await db.$transaction([
        // Update order status
        db.order.update({
          where: { id: order.id },
          data: { status: "SUCCESS" },
        }),
        // Add credits to user
        db.user.update({
          where: { id: order.userId },
          data: { credits: { increment: order.searches } },
        }),
      ]);

      console.log(`✅ Payment successful for order ${order.id}, added ${order.searches} credits to user ${order.userId}`);
    } else {
      await db.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      });

      console.log(`❌ Payment failed for order ${order.id}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PhonePe webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}