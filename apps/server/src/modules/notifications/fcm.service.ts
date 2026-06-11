import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { env } from "@finn-app/env/server";

function loadServiceAccount() {
  if (env.FCM_SERVICE_ACCOUNT_BASE64) {
    return JSON.parse(
      Buffer.from(env.FCM_SERVICE_ACCOUNT_BASE64, "base64").toString("utf-8"),
    );
  }

  if (!env.FCM_SERVICE_ACCOUNT_PATH) {
    throw new Error(
      "Missing FCM service account configuration. Set FCM_SERVICE_ACCOUNT_BASE64 or FCM_SERVICE_ACCOUNT_PATH.",
    );
  }

  const filePath = resolve(env.FCM_SERVICE_ACCOUNT_PATH);

  return JSON.parse(readFileSync(filePath, "utf-8"));
}

let fcmApp: import("firebase-admin/app").App | undefined;

async function getFcmApp() {
  if (fcmApp) {
    return fcmApp;
  }

  const { initializeApp, cert, getApps } = await import("firebase-admin/app");

  if (getApps().length > 0) {
    fcmApp = getApps()[0];

    return fcmApp;
  }

  const serviceAccount = loadServiceAccount();

  fcmApp = initializeApp({
    credential: cert(serviceAccount),
    projectId: env.FCM_PROJECT_ID,
  });

  return fcmApp;
}

export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>,
) {
  const app = await getFcmApp();
  const { getMessaging } = await import("firebase-admin/messaging");

  const message: import("firebase-admin/messaging").TokenMessage = {
    token,
    notification: { title, body },
    data,
    apns: {
      payload: {
        aps: {
          sound: "default",
          badge: 1,
        },
      },
    },
    android: {
      notification: {
        sound: "default",
        channelId: "price-alerts",
      },
    },
  };

  try {
    const response = await getMessaging(app).send(message);

    return { success: true, messageId: response };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown FCM error";

    return { success: false, error: errorMessage };
  }
}

export async function sendPushNotificationToMultipleTokens(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>,
) {
  const app = await getFcmApp();
  const { getMessaging } = await import("firebase-admin/messaging");

  const message: import("firebase-admin/messaging").MulticastMessage = {
    tokens,
    notification: { title, body },
    data,
    apns: {
      payload: {
        aps: {
          sound: "default",
          badge: 1,
        },
      },
    },
    android: {
      notification: {
        sound: "default",
        channelId: "price-alerts",
      },
    },
  };

  try {
    const response = await getMessaging(app).sendEachForMulticast(message);

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown FCM error";

    return { success: false, error: errorMessage };
  }
}
