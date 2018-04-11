import nodemailer from "nodemailer";
import Email from "email-templates";
import config from "../config/index";
import path from "path";

export default class EmailApi {
  
  constructor() {
    this.transporter = nodemailer.createTransport(config.smtp);
  }
  
  sendWelcomeEmail = async (user) => {
    
    const email = new Email(
    {
      message: {
        from: {
          name: "Our Voice",
          address: "no-reply@our-voice.io"
        }
      },
      send: true,
      transport: this.transporter,
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


