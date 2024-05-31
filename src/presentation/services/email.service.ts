import nodemailer, { Transporter } from "nodemailer";

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachement[];
}

export interface Attachement {
  filename: string;
  path: string;
}

export class EmailService {
  private transporter: Transporter;

  constructor(mailerService: string, mailerEmail: string, mailerKey: string) {
    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: { user: mailerEmail, pass: mailerKey },
    });
  }

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachments = [] } = options;

    try {
      const sentInformation = await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachments,
      });

      // console.log(sentInformation);

      // const log = new LogEntity({
      //   level: LogSeverityLevel.low,
      //   message: `Email sent to ${Array.isArray(to) ? to.join(" ") : to} `,
      //   origin: "email.service.ts",
      // });
      // this.logRepository.saveLog(log);

      return true;
    } catch (error) {
      // const log = new LogEntity({
      //   level: LogSeverityLevel.low,
      //   message: `Email not sent to ${
      //     Array.isArray(to) ? to.join(" ") : to
      //   } due to an error: ${error}`,
      //   origin: "email.service.ts",
      // });
      // this.logRepository.saveLog(log);
      return false;
    }
  }
}
