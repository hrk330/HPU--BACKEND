// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {getModelSchemaRef, post, requestBody} from '@loopback/rest';
import _ from 'lodash';
import {CodeVerificationResponse} from '../interfaces';
import {AppUsers, ServiceProvider, VerificationRequestObject} from '../models';
import {
  AppUsersRepository,
  ServiceProviderRepository,
  VerificationCodesRepository,
} from '../repositories';
import {AccCreateEmails} from '../utils';

// import {inject} from '@loopback/core';

export class CodeVerificationController {
  private AccCreateEmails: AccCreateEmails = new AccCreateEmails();
  constructor(
    @repository(VerificationCodesRepository)
    protected verificationCodesRepository: VerificationCodesRepository,
    @repository(AppUsersRepository)
    public appUsersRepository: AppUsersRepository,
    @repository(ServiceProviderRepository)
    public serviceProviderRepository: ServiceProviderRepository,
  ) {}

  @post('/codeVerification/appUser/verifyCode', {
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
  async verifyCodeForAppUser(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(VerificationRequestObject, {
            title: 'VerificationRequestObject',
            partial: true,
          }),
        },
      },
    })
    verificationRequestObject: VerificationRequestObject,
  ): Promise<String> {
    let result: CodeVerificationResponse = {
      code: 5,
      msg: 'Verification code was not verified.',
    };
    const codeVerificationResponse: CodeVerificationResponse =
      await this.verifyVerificationCode(verificationRequestObject);
    if (codeVerificationResponse) {
      if (codeVerificationResponse.code === 0) {
        result.code = 0;
        result.msg = 'Verification code has been verified.';
      } else {
        result = codeVerificationResponse;
      }
    }
    return JSON.stringify(result);
  }

  @post('/codeVerification/serviceProvider/verifyCode', {
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
  async verifyCodeForServiceProvider(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(VerificationRequestObject, {
            title: 'VerificationRequestObject',
            partial: true,
          }),
        },
      },
    })
    verificationRequestObject: VerificationRequestObject,
  ): Promise<String> {
    let result: CodeVerificationResponse = {
      code: 5,
      msg: 'Verification code was not verified.',
    };

    const codeVerificationResponse: CodeVerificationResponse =
      await this.verifyVerificationCode(verificationRequestObject);
    if (codeVerificationResponse) {
      if (codeVerificationResponse.code === 0) {
        result.code = 0;
        result.msg = 'Verification code has been verified.';
      } else {
        result = codeVerificationResponse;
      }
    }
    return JSON.stringify(result);
  }

  async verifyVerificationCode(
    verificationRequestObject: VerificationRequestObject,
  ): Promise<CodeVerificationResponse> {
    const result: CodeVerificationResponse = {
      code: 5,
      msg: 'Verification code was not verified.',
    };
    let verificationKey = '';

    if (verificationRequestObject.type === 'E') {
      verificationKey = verificationRequestObject.email;
    } else if (verificationRequestObject.type === 'U') {
      verificationKey = verificationRequestObject.userId;
    }

    const verificationCodeFilter = {
      where: {
        key: verificationKey,
        code: verificationRequestObject.verificationCode,
        type: verificationRequestObject.type,
        status: 'L',
      },
      order: ['createdAt desc'],
    };
    const verificationCodeObject =
      await this.verificationCodesRepository.findOne(verificationCodeFilter);
    if (verificationCodeObject) {
      const currentDateTime = new Date();
      if (
        verificationCodeObject.expiry &&
        currentDateTime < verificationCodeObject.expiry
      ) {
        await this.verificationCodesRepository.updateById(
          verificationCodeObject.id,
          {status: 'V', lastTry: currentDateTime},
        );
        result.code = 0;
        result.msg = 'Verification code has been verified.';
      } else {
        await this.verificationCodesRepository.updateById(
          verificationCodeObject.id,
          {status: 'E', lastTry: currentDateTime},
        );
        result.code = 5;
        result.msg = 'Verification code has been expired.';
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
    let result: CodeVerificationResponse = {
      code: 5,
      msg: 'Code verification Failed.',
    };

    const codeVerificationResponse: CodeVerificationResponse =
      await this.verifyVerificationCode(verificationRequestObject);
    if (codeVerificationResponse) {
      if (codeVerificationResponse.code === 0) {
        let user: AppUsers | ServiceProvider | undefined = undefined;
        if (verificationRequestObject.userType === 'U') {
          await this.appUsersRepository.updateById(
            verificationRequestObject.userId,
            _.pick(verificationRequestObject, 'phoneNo'),
          );
          user = await this.appUsersRepository.findById(
            verificationRequestObject.userId,
            {},
          );
        } else if (verificationRequestObject.userType === 'S') {
          await this.serviceProviderRepository.updateById(
            verificationRequestObject.userId,
            _.pick(verificationRequestObject, 'phoneNo'),
          );
          user = await this.serviceProviderRepository.findById(
            verificationRequestObject.userId,
            {},
          );
        }
        result = {
          code: 0,
          msg: 'Mobile number updated successfully.',
          user: user,
        };
      } else {
        result = codeVerificationResponse;
      }
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
    let result: CodeVerificationResponse = {
      code: 5,
      msg: 'Code verification Failed.',
    };
    const verificationRequestObject: VerificationRequestObject =
      new VerificationRequestObject();
    verificationRequestObject.userId = newUserRequest.id;
    verificationRequestObject.type = 'U';
    verificationRequestObject.verificationCode =
      newUserRequest.verificationCode;

    const codeVerificationResponse: CodeVerificationResponse =
      await this.verifyVerificationCode(verificationRequestObject);
    if (codeVerificationResponse) {
      if (codeVerificationResponse.code === 0) {
        result = {code: 0, msg: 'Phone Number verified successfully.'};
      } else {
        result = codeVerificationResponse;
      }
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
    let result: CodeVerificationResponse = {
      code: 5,
      msg: 'Code verification Failed.',
    };
    const verificationRequestObject: VerificationRequestObject =
      new VerificationRequestObject();
    verificationRequestObject.email = newUserRequest.email;
    verificationRequestObject.type = 'E';
    verificationRequestObject.verificationCode =
      newUserRequest.verificationCode;

    const codeVerificationResponse: CodeVerificationResponse =
      await this.verifyVerificationCode(verificationRequestObject);
    if (codeVerificationResponse) {
      if (codeVerificationResponse.code === 0) {
        result.code = 0;
        result.msg = 'Email verified successfully.';
      } else {
        result = codeVerificationResponse;
      }
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
    let result: CodeVerificationResponse = {
      code: 5,
      msg: 'Code verification Failed.',
    };
    const verificationRequestObject: VerificationRequestObject =
      new VerificationRequestObject();
    verificationRequestObject.userId = newUserRequest.id;
    verificationRequestObject.type = 'E';
    verificationRequestObject.verificationCode =
      newUserRequest.verificationCode;

    const codeVerificationResponse: CodeVerificationResponse =
      await this.verifyVerificationCode(verificationRequestObject);
    if (codeVerificationResponse) {
      if (codeVerificationResponse.code === 0) {
        await this.appUsersRepository.updateById(
          newUserRequest.id,
          _.pick(newUserRequest, 'email'),
        );
        const user = await this.appUsersRepository.findById(
          newUserRequest.id,
          {},
        );
        result = {
          code: 0,
          msg: 'User profile updated successfully.',
          user: user,
        };
      } else {
        result = codeVerificationResponse;
      }
    }
    return JSON.stringify(result);
  }

  @post('/codeVerification/appUser/sendEmailCode', {
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
  async sendEmailCodeForAppUser(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(VerificationRequestObject, {
            title: 'VerificationRequestObject',
            partial: true,
          }),
        },
      },
    })
    verificationRequestObject: VerificationRequestObject,
  ): Promise<String> {
    const user = await this.appUsersRepository.findOne({
      where: {email: verificationRequestObject.email, roleId: 'APPUSER'},
    });
    if (
      verificationRequestObject.email &&
      verificationRequestObject.type === 'SU'
    ) {
      await this.AccCreateEmails.sendUserAccCreateByAppVerificationEmail(
        verificationRequestObject,
      );
    }
    if (
      verificationRequestObject.email &&
      verificationRequestObject.type === 'RP'
    ) {
      await this.AccCreateEmails.sendUserAccCreateByAppVerificationEmail(
        verificationRequestObject,
      );
    }

    return JSON.stringify(
      await this.insertVerificationCode(user, verificationRequestObject, 'E'),
    );
  }

  @post('/codeVerification/serviceProvider/sendEmailCode', {
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
  async sendEmailCodeForServiceProvider(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(VerificationRequestObject, {
            title: 'VerificationRequestObject',
            partial: true,
          }),
        },
      },
    })
    verificationRequestObject: VerificationRequestObject,
  ): Promise<String> {
    const user = await this.serviceProviderRepository.findOne({
      where: {
        email: verificationRequestObject.email,
        roleId: 'SERVICEPROVIDER',
      },
    });
    return JSON.stringify(
      await this.insertVerificationCode(user, verificationRequestObject, 'E'),
    );
  }

  async insertVerificationCode(
    user: AppUsers | ServiceProvider | null,
    verificationRequestObject: VerificationRequestObject,
    codeType: string,
  ): Promise<CodeVerificationResponse> {
    const result: CodeVerificationResponse = {
      code: 5,
      msg: 'Verification code not sent.',
    };
    const successMessage = 'Verification code sent successfully.';
    if (verificationRequestObject?.type === 'RP') {
      if (!user?.id) {
        result.code = 5;
        result.msg = 'User does not exits.';
      } else if (user?.id && user?.socialId?.length > 0) {
        result.code = 5;
        result.msg =
          'Reset password is not allowed for accounts signed up with social id.';
      } else {
        try {
          await this.verificationCodesRepository.create({
            key: verificationRequestObject.email,
            code: await this.getRandomInt(999999),
            type: codeType,
            status: 'L',
            expiry: (await this.addMinutes(new Date(), 15)).toString(),
          });
          // mailOptions.to = verificationRequestObject.email;
          // mailOptions.text = "Your Verification Code is: " + verificationCode;
          // console.log("before sending");

          // const response = await transporter.sendMail(mailOptions);
          // console.log(response)
          result.code = 0;
          result.msg = successMessage;
        } catch (e) {
          result.code = 5;
          result.msg = 'Some error occurred while sending verification code.';
        }
      }
    } else if (verificationRequestObject?.type === 'SU') {
      if (user?.id) {
        result.code = 5;
        result.msg = 'User already exits.';
      } else {
        try {
          await this.verificationCodesRepository.create({
            key: verificationRequestObject.email,
            code: await this.getRandomInt(999999),
            type: codeType,
            status: 'L',
            expiry: (await this.addMinutes(new Date(), 15)).toString(),
          });
          result.code = 0;
          result.msg = successMessage;
        } catch (e) {
          result.code = 5;
          result.msg = e.message;
        }
      }
    }
    return result;
  }

  @post('/codeVerification/sendSmsCode', {
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
            title: 'VerificationRequestObject',
            partial: true,
          }),
        },
      },
    })
    verificationRequestObject: VerificationRequestObject,
  ): Promise<String> {
    const result: CodeVerificationResponse = {
      code: 5,
      msg: 'Verification code not sent.',
    };
    try {
      await this.verificationCodesRepository.create({
        key: verificationRequestObject.userId,
        code: await this.getRandomInt(999999),
        type: 'U',
        status: 'L',
        expiry: (await this.addMinutes(new Date(), 15)).toString(),
      });
      result.code = 0;
      result.msg = 'Verification code sent successfully.';
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  async getRandomInt(max: number): Promise<string> {
    //return Math.floor(Math.random() * max).toString();
    return '1234';
  }

  async addMinutes(date: Date, minutes: number): Promise<Date> {
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }
}
