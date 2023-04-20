// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
import {VerificationRequestObject} from '../models';
import {AppUsersRepository, VerificationCodesRepository} from '../repositories';

// import {inject} from '@loopback/core';


export class CodeVerificationController {
  constructor(
    @repository(VerificationCodesRepository)
    protected verificationCodesRepository: VerificationCodesRepository,
    @repository(AppUsersRepository)
    public appUsersRepository: AppUsersRepository,
  ) { }

  @post('/codeVerification/verifyCode', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: String,
          },
        },
      },
    },
  })
  async verifyCode(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(VerificationRequestObject, {
            title: 'VerificationRequestObject', partial: true
          }),
        },
      },
    })
    verificationRequestObject: VerificationRequestObject
  ): Promise<String> {
    let result = {code: 5, msg: "Verification code was not verified."};
    const verificationCodefilter = {where: {key: verificationRequestObject.email, code: verificationRequestObject.verificationCode, status: 'L'}, order: ['createdAt desc']};
    const verificationCodeObject = await this.verificationCodesRepository.findOne(verificationCodefilter);
    if (verificationCodeObject) {
      const currentDateTime = new Date();
      if (verificationCodeObject.expiry && currentDateTime < verificationCodeObject.expiry) {
        await this.verificationCodesRepository.updateById(verificationCodeObject.id, {status: 'V'});
        result.code = 0;
        result.msg = "Verification code has been verified.";
      }
    }

    return JSON.stringify(result);
  }

  @post('/codeVerification/sendEmailCode', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: String,
          },
        },
      },
    },
  })
  async sendEmailCode(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(VerificationRequestObject, {
            title: 'VerificationRequestObject', partial: true
          }),
        },
      },
    }) verificationRequestObject: VerificationRequestObject,
  ): Promise<String> {
    let result = {code: 5, msg: "Verification code not sent."};
    const filter = {where: {email: verificationRequestObject.email}};

    const user = await this.appUsersRepository.findOne(filter);

    if (verificationRequestObject.type === 'RP') {
      if (!user || !user.id) {
        result.code = 5;
        result.msg = "User does not exits.";
      } else {
        try {
          const verificationCode = await this.getRandomInt(999999);
          this.verificationCodesRepository.create({key: verificationRequestObject.email, code: verificationCode, type: 'E', status: 'L', expiry: (await this.addMinutes(new Date(), 15)).toString()});
          // mailOptions.to = verificationRequestObject.email;
          // mailOptions.text = "Your Verification Code is: " + verificationCode;
          // console.log("before sending");

          // const response = await transporter.sendMail(mailOptions);
          // console.log(response)
          result.code = 0;
          result.msg = "Verification code sent successfully.";
        } catch (e) {
          result.code = 5;
          result.msg = "Some error occured while sending verification code.";
        }
      }
    } else if (verificationRequestObject.type === 'SU') {
      if (user && user.id) {
        result.code = 5;
        result.msg = "User already exits.";
      } else {
        try {
          this.verificationCodesRepository.create({key: verificationRequestObject.email, code: await this.getRandomInt(999999), type: 'E', status: 'L', expiry: (await this.addMinutes(new Date(), 15)).toString()});
          result.code = 0;
          result.msg = "Verification code sent successfully.";
        } catch (e) {
          result.code = 5;
          result.msg = e.message;
        }
      }
    }


    return JSON.stringify(result);
  }

  @post('/appUsers/sendSmsCode/{mobileNumber}', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: String,
          },
        },
      },
    },
  })
  async sendSmsCode(
    @requestBody({
      content: {
        'application/json': {
          schema: String,
        },
      },
    })
    @param.path.string('mobileNumber') mobileNumber: string,
  ): Promise<String> {
    this.verificationCodesRepository.create({key: mobileNumber, code: await this.getRandomInt(999999), type: 'M', status: 'L', expiry: (await this.addMinutes(new Date(), 15)).toString()});
    return "SUCCESS";
  }

  async getRandomInt(max: number): Promise<string> {
    //return Math.floor(Math.random() * max).toString();
    return "1234";
  }

  async addMinutes(date: Date, minutes: number): Promise<Date> {
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }
}
