import nodeMailer from "nodemailer"
import handlebars from "handlebars"
import fs from "fs"
import path from "path"

const sendEmail = async (email, subject, payload, templates) => {
    try {
      // create reusable transporter object using the default SMTP transport
      const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        service:"Gmail",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD, 
        },
      })
      transporter.verify().then(console.log).catch(console.error)
  
      const source = fs.readFileSync(path.join(__dirname, templates), "utf8");
      const compiledTemplate = handlebars.compile(source);
      const options = () => {
        return {
          from: process.env.FROM_EMAIL,
          to: email,
          subject: subject,
          html: compiledTemplate(payload),
        };
      };
  
      // Send email
      transporter.sendMail(options(), (error, info) => {
        if (error) {
          return error;
        } else {
          return res.status(200).json({
            success: true,
          });
        }
      });
    } catch (error) {
      return error;
    }
  }


  export default sendEmail