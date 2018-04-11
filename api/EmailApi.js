import nodemailer from "nodemailer";
import Email from "email-templates";
import config from "../config/index";
import path from "path";

export default class EmailApi {
  
  constructor() {
    console.log("Using SMTP config", config.smtp);
    this.transporter = nodemailer.createTransport(config.smtp);
  }
  
  sendWelcomeEmail = async (user) => {
    const email = new Email(
    {
      message: {
        from: "no-reply@our-voice.io"
      },
      send: true,
      transport: Object.assign({}, this.transporter, { send: true }),
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, "..")
        }
      }
    });
  
    await email.send(
    {
      template: "welcome",
      message: {
        to: user.email
      },
      send: true,
      locals: Object.assign({}, user, { website: "http://our-voice.io" })
    });
  };
  
}


