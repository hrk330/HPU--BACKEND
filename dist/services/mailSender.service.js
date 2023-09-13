"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCustomMail = exports.renderTemplate = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const handlebars_1 = tslib_1.__importDefault(require("handlebars"));
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
const path_1 = tslib_1.__importDefault(require("path"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'testcompany850@gmail.com',
        pass: 'apsxwzplafbvhhei',
    },
});
const renderTemplate = (templateName, context) => {
    const filePath = path_1.default.resolve(__dirname, '../../src/views', `${templateName}.handlebars`);
    const source = fs_1.default.readFileSync(filePath, 'utf-8');
    const template = handlebars_1.default.compile(source);
    return template(context);
};
exports.renderTemplate = renderTemplate;
const sendCustomMail = (recipient, subject, name, username, password, emailTemplate, companyName, totalcost, veriCode) => {
    const templateVars = {};
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
    const mailOptions = {
        from: 'testcompany850@gmail.com',
        to: recipient,
        subject: subject,
        html: (0, exports.renderTemplate)(emailTemplate, templateVars),
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
};
exports.sendCustomMail = sendCustomMail;
//# sourceMappingURL=mailSender.service.js.map