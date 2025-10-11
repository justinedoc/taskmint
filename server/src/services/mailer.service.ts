import env from "@server/app/validate-env"; // Ensure this path is correct
import fs from "fs/promises";
import nodemailer from "nodemailer";
import path from "path";

const __dirname = import.meta.dir;

type EmailTemplate = "welcome" | "forgot-password" | "password-reset" | "otp";

type EmailOptionsPayload = {
  otp?: string | number;
  username?: string;
  reset_link?: string;
  login_link?: string;
};

interface EmailOptions {
  to: string;
  subject: string;
  template: EmailTemplate;
  payload: EmailOptionsPayload;
}

export class Mailer {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: 587,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  private async loadAndProcessTemplate(
    templateName: EmailTemplate,
    payload: { [key: string]: any }
  ): Promise<string> {
    const templatePath = path.join(
      __dirname,
      `../templates/${templateName}.template.html`
    );
    let htmlContent = "";
    try {
      htmlContent = await fs.readFile(templatePath, "utf8");
    } catch (error) {
      console.error(`Error reading email template '${templateName}':`, error);
      throw new Error(`Failed to load email template: ${templateName}`);
    }

    for (const key in payload) {
      const placeholder = new RegExp(`<%=\\s*${key}\\s*%>`, "g");
      htmlContent = htmlContent.replace(placeholder, payload[key]);
    }

    return htmlContent;
  }

  public async sendMail({
    to,
    subject,
    template,
    payload,
  }: EmailOptions): Promise<void> {
    try {
      if (env.ENV === "development") return; // FIXME: remove after configuring email sender
      const emailHtml = await this.loadAndProcessTemplate(template, payload);
      const mailOptions = {
        from: '"TaskMint" <no-reply@taskmint.com>',
        to,
        subject,
        html: emailHtml,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email.");
    }
  }
}

const mailer = new Mailer();

export default mailer;
