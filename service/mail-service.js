import sgMail from '@sendgrid/mail';
import 'dotenv/config';
import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, API_URL, SENDGRID_API_KEY, SENDGRID_MAIL } =
  process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });
  }

  async sendVerifyMail(to, link) {
    await this.transporter.sendMail({
      from: SMTP_USER,
      to,
      subject: 'Account`s verification ' + API_URL,
      text: '',
      html: `
				<div>
					<h1>Go to link for verification your e-mail</h1>
					<a href=${link}>${link}</a>
				</div>
			`,
    });
  }

  async sendVerifyMailSendgrid(to, link) {
    const msg = {
      from: SENDGRID_MAIL,
      to,
      subject: 'Account`s verification ' + API_URL,
      html: `
			<div>
					<h1>Go to link for verification your e-mail</h1>
					<a target="_blank" href=${link}>Click to verify email</a>
				</div>
			`,
    };
    try {
      await sgMail.send(msg);
      console.log('Email sent');
    } catch (error) {
      console.error(error);
    }
  }
}

export default new MailService();
