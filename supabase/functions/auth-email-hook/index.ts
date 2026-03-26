import * as webhooksJs from "@lovable.dev/webhooks-js";
import * as emailJs from "@lovable.dev/email-js";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

import SignupEmail from "../_shared/email-templates/signup.tsx";
import RecoveryEmail from "../_shared/email-templates/recovery.tsx";
import MagicLinkEmail from "../_shared/email-templates/magic-link.tsx";
import InviteEmail from "../_shared/email-templates/invite.tsx";
import EmailChangeEmail from "../_shared/email-templates/email-change.tsx";
import ReauthenticationEmail from "../_shared/email-templates/reauthentication.tsx";

const SITE_NAME = "HostOnce Hub";
const SITE_URL = "https://host-once-hub.lovable.app";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  try {
    const rawBody = await req.text();
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      throw new Error("LOVABLE_API_KEY is not set");
    }

    const Webhook = (webhooksJs as any).Webhook || (webhooksJs as any).default?.Webhook || webhooksJs;
    const wh = typeof Webhook === 'function' ? new Webhook(apiKey) : new (Webhook as any)(apiKey);
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const payload = wh.verify(rawBody, headers) as any;

    const {
      email_data: {
        token,
        token_hash,
        redirect_to,
        email_action_type,
        site_url,
        token_new,
        token_hash_new,
      },
      email_data,
    } = payload;

    const recipient = email_data.email || "";
    const confirmationUrl = redirect_to
      ? `${site_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(redirect_to)}`
      : `${site_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}`;

    let subject = "";
    let htmlBody = "";

    const props = {
      siteName: SITE_NAME,
      siteUrl: SITE_URL,
      confirmationUrl,
      recipient,
      token,
    };

    switch (email_action_type) {
      case "signup":
        subject = `Confirm your ${SITE_NAME} account`;
        htmlBody = renderToStaticMarkup(createElement(SignupEmail, props));
        break;
      case "recovery":
        subject = `Reset your ${SITE_NAME} password`;
        htmlBody = renderToStaticMarkup(createElement(RecoveryEmail, props));
        break;
      case "magiclink":
        subject = `Your ${SITE_NAME} sign-in link`;
        htmlBody = renderToStaticMarkup(createElement(MagicLinkEmail, props));
        break;
      case "invite":
        subject = `You've been invited to ${SITE_NAME}`;
        htmlBody = renderToStaticMarkup(createElement(InviteEmail, props));
        break;
      case "email_change":
        subject = `Confirm your email change on ${SITE_NAME}`;
        htmlBody = renderToStaticMarkup(
          createElement(EmailChangeEmail, {
            ...props,
            newEmail: email_data.new_email,
          })
        );
        break;
      case "reauthentication":
        subject = `Your ${SITE_NAME} verification code`;
        htmlBody = renderToStaticMarkup(
          createElement(ReauthenticationEmail, props)
        );
        break;
      default:
        subject = `Message from ${SITE_NAME}`;
        htmlBody = `<p>You have a notification from ${SITE_NAME}.</p>`;
    }

    const callbackUrl = (payload as any).callback_url;
    if (!callbackUrl) {
      throw new Error("No callback_url in payload");
    }

    const sendEmail = (emailJs as any).sendEmail || (emailJs as any).default?.sendEmail || (emailJs as any).default;
    await sendEmail(
      {
        to: recipient,
        subject,
        html: htmlBody,
      },
      {
        apiKey,
        callbackUrl,
      }
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Auth email hook error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
