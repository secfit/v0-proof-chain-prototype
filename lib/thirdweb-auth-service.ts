// Thirdweb Official Authentication Service
// Uses the official Thirdweb API endpoints for authentication

const THIRDWEB_API_BASE = "https://api.thirdweb.com/v1";

export interface ThirdwebAuthResponse {
  isNewUser: boolean;
  token: string;
  type: string;
  walletAddress: string;
}

export interface ThirdwebAuthInitiateResponse {
  challenge: string;
  expiresAt: string;
}

export interface ThirdwebWalletInfo {
  address: string;
  profiles: Array<{
    type: string;
    identifier: string;
    verified: boolean;
  }>;
}

/**
 * Initiate email authentication using Thirdweb API
 */
export async function initiateEmailAuth(email: string): Promise<ThirdwebAuthInitiateResponse> {
  try {
    console.log("[Thirdweb Auth] Initiating email authentication for:", email);

    const response = await fetch(`${THIRDWEB_API_BASE}/auth/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "30f238d7e42614f3c0fefcc95616ac9c",
      },
      body: JSON.stringify({
        method: "email",
        email: email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Thirdweb auth initiate failed: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    console.log("[Thirdweb Auth] Email auth initiated successfully");
    
    return {
      challenge: data.challenge,
      expiresAt: data.expiresAt,
    };
  } catch (error) {
    console.error("[Thirdweb Auth] Error initiating email auth:", error);
    throw error;
  }
}

/**
 * Complete email authentication using Thirdweb API
 */
export async function completeEmailAuth(
  email: string,
  verificationCode: string
): Promise<ThirdwebAuthResponse> {
  try {
    console.log("[Thirdweb Auth] Completing email authentication for:", email);

    const response = await fetch(`${THIRDWEB_API_BASE}/auth/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "30f238d7e42614f3c0fefcc95616ac9c",
      },
      body: JSON.stringify({
        method: "email",
        email: email,
        code: verificationCode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Thirdweb auth complete failed: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    console.log("[Thirdweb Auth] Email auth completed successfully");
    
    return {
      isNewUser: data.isNewUser,
      token: data.token,
      type: data.type,
      walletAddress: data.walletAddress,
    };
  } catch (error) {
    console.error("[Thirdweb Auth] Error completing email auth:", error);
    throw error;
  }
}

/**
 * Get wallet information using Thirdweb API
 */
export async function getWalletInfo(token: string): Promise<ThirdwebWalletInfo> {
  try {
    console.log("[Thirdweb Auth] Getting wallet info");

    const response = await fetch(`${THIRDWEB_API_BASE}/wallets/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "x-client-id": process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "30f238d7e42614f3c0fefcc95616ac9c",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Thirdweb wallet info failed: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    console.log("[Thirdweb Auth] Wallet info retrieved successfully");
    
    return {
      address: data.result.address,
      profiles: data.result.profiles || [],
    };
  } catch (error) {
    console.error("[Thirdweb Auth] Error getting wallet info:", error);
    throw error;
  }
}

/**
 * Initiate SIWE (Sign-In with Ethereum) authentication
 */
export async function initiateSIWEAuth(): Promise<ThirdwebAuthInitiateResponse> {
  try {
    console.log("[Thirdweb Auth] Initiating SIWE authentication");

    const response = await fetch(`${THIRDWEB_API_BASE}/auth/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "30f238d7e42614f3c0fefcc95616ac9c",
      },
      body: JSON.stringify({
        method: "siwe",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Thirdweb SIWE initiate failed: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    console.log("[Thirdweb Auth] SIWE auth initiated successfully");
    
    return {
      challenge: data.challenge,
      expiresAt: data.expiresAt,
    };
  } catch (error) {
    console.error("[Thirdweb Auth] Error initiating SIWE auth:", error);
    throw error;
  }
}

/**
 * Complete SIWE authentication
 */
export async function completeSIWEAuth(signedMessage: string): Promise<ThirdwebAuthResponse> {
  try {
    console.log("[Thirdweb Auth] Completing SIWE authentication");

    const response = await fetch(`${THIRDWEB_API_BASE}/auth/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "30f238d7e42614f3c0fefcc95616ac9c",
      },
      body: JSON.stringify({
        method: "siwe",
        signature: signedMessage,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Thirdweb SIWE complete failed: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    console.log("[Thirdweb Auth] SIWE auth completed successfully");
    
    return {
      isNewUser: data.isNewUser,
      token: data.token,
      type: data.type,
      walletAddress: data.walletAddress,
    };
  } catch (error) {
    console.error("[Thirdweb Auth] Error completing SIWE auth:", error);
    throw error;
  }
}
