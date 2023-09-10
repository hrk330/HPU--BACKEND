import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import path from 'path';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'testcompany850@gmail.com',
    pass: 'apsxwzplafbvhhei',
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
  name?: any,
  username?: any,
  password?: any,
  emailTemplate?: string,
  companyName?: any,
  totalcost?: any,
  veriCode?: any,
) => {
  const templateVars: Record<string, string> = {};

  // Add the companyName to templateVars if it is provided
  if (name) {
    templateVars.name = name;
  }
  if (username) {
    templateVars.username = username;
  }
  if (password) {
    templateVars.password = password;
  }
  if (emailTemplate) {
    templateVars.emailTemplate = emailTemplate;
  }
  if (companyName) {
    templateVars.companyName = companyName;
  }
  if (totalcost) {
    templateVars.totalcost = totalcost;
  }
  if (veriCode) {
    templateVars.veriCode = veriCode;
  }

  const mailOptions: nodemailer.SendMailOptions = {
    from: 'testcompany850@gmail.com',
    to: recipient,
    subject: subject,
    html: renderTemplate(emailTemplate as string, templateVars),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
