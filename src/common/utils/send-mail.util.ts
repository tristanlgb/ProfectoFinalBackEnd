import * as nodemailer from 'nodemailer';

export class SendMailUtil {
  static async sendMail(to: string, subject: string, html: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      // Configure your email service
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  }
}
