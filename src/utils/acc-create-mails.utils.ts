import {
  AppUsers,
  Company,
  ServiceProvider,
  VerificationRequestObject,
} from '../models';
import {sendCustomMail} from '../services';

//   }
export class AccCreateEmails {
  async sendCompanyAccCreateMail(
    savedCompany: Company,
    company: Omit<Company, 'companyId'>,
  ): Promise<void> {
    console.log('Company Email = ', savedCompany.email);
    console.log('Company Name = ', savedCompany.companyName);
    console.log('Company Password = ', company.password);

    if (savedCompany) {
      const subject = 'Company Registration Credentials';
      const emailTemplate = 'CompanyAccountCreate';
      console.log(
        `Sending Mail to Company with this email (${savedCompany.email}) for Account Credentials`,
      );
      sendCustomMail(
        savedCompany.email,
        subject,
        savedCompany.companyName,
        savedCompany.email,
        company.password,
        emailTemplate,
      );

      console.log(
        `Email Sent To Company with this email (${savedCompany.email})`,
      );
    }
  }

  async sendRiderAccCreateMail(
    savedUser: ServiceProvider,
    serviceProvider: Omit<ServiceProvider, 'id'>,
  ): Promise<void> {
    console.log('Rider Email = ', savedUser.email);
    console.log(`Rider Name = ${savedUser.firstName} ${savedUser.lastName}`);
    console.log('Rider Password', serviceProvider.password);

    if (savedUser) {
      const subject = 'Rider Registration Credentials';
      const emailTemplate = 'addRidertemplate';
      console.log(
        `Sending Mail to Rider with this email (${savedUser.email}) for Account Credentials`,
      );
      sendCustomMail(
        savedUser.email,
        subject,
        savedUser.firstName,
        savedUser.email,
        serviceProvider.password,
        emailTemplate,
        savedUser.companyName,
      );
      console.log(`Email Sent To Rider with this email (${savedUser.email})`);
    }
  }

  async sendUserAccCreateByAdminEmail(
    savedUser: AppUsers,
    newUserRequest: AppUsers,
  ): Promise<void> {
    console.log('User Email = ', savedUser.email);
    console.log(`User Name = ${savedUser.firstName} ${savedUser.lastName}`);
    console.log('User Password', newUserRequest.password);

    if (savedUser) {
      const subject = 'User Registration Credentials';
      const emailTemplate = 'CompanyAccountCreate';
      console.log(
        `Sending Mail to User with this email (${savedUser.email}) for Account Credentials`,
      );
      sendCustomMail(
        savedUser.email,
        subject,
        savedUser.firstName + '' + savedUser.lastName,
        savedUser.email,
        newUserRequest.password,
        emailTemplate,
      );

      console.log(`Email Sent To User with this email (${savedUser.email})`);
    }
  }

  async sendUserAccCreateByAppVerificationEmail(
    verificationRequestObject: VerificationRequestObject,
  ): Promise<void> {
    console.log('User Email = ', verificationRequestObject.email);
    console.log('User Type', verificationRequestObject.type);

    if (
      verificationRequestObject.email &&
      (verificationRequestObject.type = 'SU')
    ) {
      const subject = 'Verification Code For Sign Up';
      const emailTemplate = 'verificationCodeTemplate';
      const veriCode = 1234;
      console.log(
        `Sending Verification Mail for sign up to User with this email (${verificationRequestObject.email}) for Account Credentials`,
      );
      sendCustomMail(
        verificationRequestObject.email,
        subject,
        undefined,
        undefined,
        undefined,
        emailTemplate,
        undefined,
        undefined,
        veriCode,
      );

      console.log(
        `Verification Email for sign up Sent To User with this email (${verificationRequestObject.email})`,
      );
    } else if (
      verificationRequestObject.email &&
      (verificationRequestObject.type = 'RP')
    ) {
      const subject = 'Verification Code For Reset Password';
      const emailTemplate = 'verificationCodeTemplate';
      const veriCode = 1234;
      console.log(
        `Sending Verification Mail for reset password to User with this email (${verificationRequestObject.email}) for Account Credentials`,
      );
      sendCustomMail(
        verificationRequestObject.email,
        subject,
        undefined,
        undefined,
        undefined,
        emailTemplate,
        undefined,
        undefined,
        veriCode,
      );

      console.log(
        `Verification Email for reset password Sent To User with this email (${verificationRequestObject.email})`,
      );
    }
  }
}
