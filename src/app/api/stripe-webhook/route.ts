import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    const event = await constructWebhookEvent(body, signature);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { orderId, userId, credits } = session.metadata!;

      // Find the order
      const order = await db.order.findFirst({
        where: { 
          id: orderId,
          stripeTxnId: session.id 
        },
      });

      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      // Update order and add credits
      await db.$transaction([
        db.order.update({
          where: { id: order.id },
          data: { status: "SUCCESS" },
        }),
        db.user.update({
          where: { id: userId },
          data: { credits: { increment: parseInt(credits) } },
        }),
      ]);

      console.log(`✅ Stripe payment successful for order ${orderId}, added ${credits} credits to user ${userId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook error" },
      { status: 400 }
    );
  }
}