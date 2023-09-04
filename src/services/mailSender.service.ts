import path from 'path';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'testcompany850@gmail.com',
    pass: 'testcompany1234',
  },
});

export const renderTemplate = (templateName: string, context: any) => {
  const filePath = path.resolve(
    __dirname,
    '../../src/views',
    `${templateName}.handlebars`,
  );
  const source = fs.readFileSync(filePath, 'utf-8');
  const template = handlebars.compile(source);
  return template(context);
};

export const sendCustomMail = (
  recipient: string,
  subject: string,
  name: string,
  username: string,
  password: string,
  emailTemplate: string,
  companyName?: any,
  totalcost?: any,
) => {
  const templateVars: Record<string, string> = {
    name: name,
    username: username,
    password: password,
  };

  // Add the companyName to templateVars if it is provided
  if (companyName) {
    templateVars.companyName = companyName;
  }
  if (totalcost) {
    templateVars.totalcost = totalcost;
  }

  const mailOptions: nodemailer.SendMailOptions = {
    from: 'testcompany850@gmail.com',
    to: recipient,
    subject: subject,
    html: renderTemplate(emailTemplate, templateVars),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
