import CryptoJS from "crypto-js";
import { env } from "@/env.mjs";

interface CreateOrderParams {
  orderId: string;
  amount: number; // in paise
  userId: string;
}

interface PhonePeResponse {
  merchantTransactionId: string;
  redirectUrl: string;
}

export async function createPhonePeOrder({
  orderId,
  amount,
  userId,
}: CreateOrderParams): Promise<PhonePeResponse> {
  const merchantTransactionId = `TXN_${orderId}_${Date.now()}`;
  
  const payload = {
    merchantId: env.PHONEPE_MERCHANT_ID,
    merchantTransactionId,
    merchantUserId: userId,
    amount,
    redirectUrl: `${env.NEXT_PUBLIC_APP_URL}/payment/success?orderId=${orderId}`,
    redirectMode: "POST",
    callbackUrl: `${env.NEXT_PUBLIC_APP_URL}/api/phonepe-webhook`,
    mobileNumber: "9999999999", // Will be updated with actual user mobile
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
  const checksum = 
    CryptoJS.SHA256(base64Payload + "/pg/v1/pay" + env.PHONEPE_SALT_KEY).toString() +
    "###" +
    env.PHONEPE_SALT_INDEX;

  const response = await fetch(`${env.PHONEPE_BASE_URL}/pg/v1/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
    },
    body: JSON.stringify({
      request: base64Payload,
    }),
  });

  if (!response.ok) {
    throw new Error(`PhonePe API error: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(`PhonePe error: ${data.message}`);
  }

  return {
    merchantTransactionId,
    redirectUrl: data.data.instrumentResponse.redirectInfo.url,
  };
}

export function verifyPhonePeChecksum(
  response: string,
  checksum: string
): boolean {
  const expectedChecksum = 
    CryptoJS.SHA256(response + env.PHONEPE_SALT_KEY).toString() +
    "###" +
    env.PHONEPE_SALT_INDEX;

  return expectedChecksum === checksum;
}

export async function getPhonePeTransactionStatus(
  merchantTransactionId: string
): Promise<any> {
  const checksum = 
    CryptoJS.SHA256(
      `/pg/v1/status/${env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}` + 
      env.PHONEPE_SALT_KEY
    ).toString() +
    "###" +
    env.PHONEPE_SALT_INDEX;

  const response = await fetch(
    `${env.PHONEPE_BASE_URL}/pg/v1/status/${env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": env.PHONEPE_MERCHANT_ID,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`PhonePe status API error: ${response.statusText}`);
  }

  return response.json();
}