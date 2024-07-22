import base58 from "bs58";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";

import { SigninMessage } from "@/lib/SignInMessage";

export const handleSignIn = async (
  roomId: string,
  displayName: string,
  signIn: any,
  publicKey: any,
) => {
  try {
    const time = {
      issuedAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 5,
    };

    const signInMessage = new SigninMessage({
      domain: window.location.host,
      publicKey: publicKey.toBase58(),
      expTime: new Date(time.expiresAt).toISOString(),
      statement: "Please Sign In to verify wallet",
    });

    const data = new TextEncoder().encode(signInMessage.prepare());

    const signature = await signIn(data);

    const serializedSignature = base58.encode(signature);

    const token = await axios.request({
      method: "POST",
      url: "/api/getAccessToken",
      data: {
        displayName,
        roomId,
        address: publicKey.toBase58(),
        expirationTime: time.expiresAt,
        domain: window.location.host,
        signature: serializedSignature,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return token?.data?.token;
  } catch (error: any) {
    if (isAxiosError(error)) {
      toast.error(error.response?.data?.error);
    }
  }
};
