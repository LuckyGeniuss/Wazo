import { Resend } from "resend";
import { createElement } from "react";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");

interface SendEmailOptions {
  to: string;
  subject: string;
  react?: React.ReactElement;
  html?: string;
}

export async function sendEmail({ to, subject, react, html: htmlProp }: SendEmailOptions) {
  try {
    const html = htmlProp ?? (react ? await render(react) : "");

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: Buffer.from(subject).toString('ascii') === subject ? subject : "Notification",
      html: Buffer.from(html).toString('ascii') === html ? html : "<div>Notification</div>",
    });

    if (error) {
      console.error("[SEND_EMAIL_ERROR]", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("[SEND_EMAIL_CATCH]", error);
    return { success: false, error: "Произошла непредвиденная ошибка при отправке email." };
  }
}
