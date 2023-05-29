// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
import {AppUsers, VerificationRequestObject} from '../models';
import {AppUsersRepository, VerificationCodesRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import _ from 'lodash';

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
    if(await this.verifyVerificationCode(verificationRequestObject)) {
      result.code = 0;
      result.msg = "Verification code has been verified.";
    }
    return JSON.stringify(result);
  }

  async verifyVerificationCode(verificationRequestObject: VerificationRequestObject) : Promise<boolean> {
    let result: boolean = false;
    let verificationKey: string = "";

    if(verificationRequestObject.type === "E") { verificationKey = verificationRequestObject.email; }
    else if(verificationRequestObject.type === "U") { verificationKey = verificationRequestObject.userId;}

    const verificationCodefilter = {where: {key: verificationKey, code: verificationRequestObject.verificationCode, status: 'L'}, order: ['createdAt desc']};
    const verificationCodeObject = await this.verificationCodesRepository.findOne(verificationCodefilter);
    if (verificationCodeObject) {
      const currentDateTime = new Date();
      if (verificationCodeObject.expiry && currentDateTime < verificationCodeObject.expiry) {
        await this.verificationCodesRepository.updateById(verificationCodeObject.id, {status: 'V', lastTry: currentDateTime});
        result = true;
      } else {
        this.verificationCodesRepository.updateById(verificationCodeObject.id, {status: 'E', lastTry: currentDateTime});
      }
    }
    return result;
  }

  @authenticate('jwt')
  @post('/codeVerification/updatePhoneNumber', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(AppUsers, {
              title: 'NewUser',
            }),
          },
        },
      },
    },
  })
  async updatePhoneNumber(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(VerificationRequestObject, {
            title: 'VerificationRequestObject',
          }),
        },
      },
    })
    verificationRequestObject: VerificationRequestObject,
  ): Promise<String> {
    let result = {code: 5, msg: "Code verification Failed.", user: {}};

    const codeVerificationResponse: boolean = await this.verifyVerificationCode(verificationRequestObject);
    if(codeVerificationResponse) {
      await this.appUsersRepository.updateById(verificationRequestObject.userId, _.pick(verificationRequestObject, 'phoneNo'));
      const user = await this.appUsersRepository.findById(verificationRequestObject.userId, {});
      result = {code: 0, msg: "User profile updated successfully.", user: user};
    }
    return JSON.stringify(result);
  }

  @authenticate('jwt')
  @post('/codeVerification/verifyPhoneNumber', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(AppUsers, {
              title: 'NewUser',
            }),
          },
        },
      },
    },
  })
  async verifyPhoneNumber(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AppUsers, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: AppUsers,
  ): Promise<String> {
    let result = {code: 5, msg: "Code verification Failed.", user: {}};
    const codeVerificationController: CodeVerificationController = new CodeVerificationController(this.verificationCodesRepository, this.appUsersRepository);
    const verificationRequestObject: VerificationRequestObject = new VerificationRequestObject;
    verificationRequestObject.userId = newUserRequest.id;
    verificationRequestObject.type = "U";
    verificationRequestObject.verificationCode = newUserRequest.verificationCode;

    const codeVerificationResponse: boolean = await codeVerificationController.verifyVerificationCode(verificationRequestObject);
    if (codeVerificationResponse) {
      result = {code: 0, msg: "Phone Number verified successfully.", user: {}};
    }
    return JSON.stringify(result);
  }

  @authenticate('jwt')
  @post('/codeVerification/verifyEmailAddress', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(AppUsers, {
              title: 'NewUser',
            }),
          },
        },
      },
    },
  })
  async verifyEmailAddress(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AppUsers, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: AppUsers,
  ): Promise<String> {
    let result = {code: 5, msg: "Code verification Failed.", user: {}};
    const codeVerificationController: CodeVerificationController = new CodeVerificationController(this.verificationCodesRepository, this.appUsersRepository);
    const verificationRequestObject: VerificationRequestObject = new VerificationRequestObject;
    verificationRequestObject.email = newUserRequest.email;
    verificationRequestObject.type = "E";
    verificationRequestObject.verificationCode = newUserRequest.verificationCode;

    const codeVerificationResponse: boolean = await codeVerificationController.verifyVerificationCode(verificationRequestObject);
    if (codeVerificationResponse) {
      result = {code: 0, msg: "Email verified successfully.", user: {}};
    }
    return JSON.stringify(result);
  }

  @authenticate('jwt')
  @post('/codeVerification/updateEmailAddress', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(AppUsers, {
              title: 'NewUser',
            }),
          },
        },
      },
    },
  })
  async updateEmailAddress(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AppUsers, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: AppUsers,
  ): Promise<String> {
    let result = {code: 5, msg: "Code verification Failed.", user: {}};
    const codeVerificationController: CodeVerificationController = new CodeVerificationController(this.verificationCodesRepository, this.appUsersRepository);
    const verificationRequestObject: VerificationRequestObject = new VerificationRequestObject;
    verificationRequestObject.userId = newUserRequest.id;
    verificationRequestObject.type = "E";
    verificationRequestObject.verificationCode = newUserRequest.verificationCode;

    const codeVerificationResponse: boolean = await codeVerificationController.verifyVerificationCode(verificationRequestObject);
    if (codeVerificationResponse) {
      await this.appUsersRepository.updateById(newUserRequest.id, _.pick(newUserRequest, 'email'));
      const user = await this.appUsersRepository.findById(newUserRequest.id, {});
      result = {code: 0, msg: "User profile updated successfully.", user: user};
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

  @post('/appUsers/sendSmsCode', {
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
          schema: getModelSchemaRef(VerificationRequestObject, {
            title: 'VerificationRequestObject', partial: true
          }),
        },
      },
    })
    verificationRequestObject: VerificationRequestObject
  ): Promise<String> {
    let result = {code: 5, msg: "Verification code not sent."};
    try {
      await this.verificationCodesRepository.create({key: verificationRequestObject.userId, code: await this.getRandomInt(999999), type: 'U', status: 'L', expiry: (await this.addMinutes(new Date(), 15)).toString()});
      result.code = 0;
      result.msg = "Verification code sent successfully.";
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
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
