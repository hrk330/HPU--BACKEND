// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import _ from 'lodash';
import {FILE_UPLOAD_SERVICE} from '../keys';
import {AppUsersRepository} from '../repositories';
import {FileUploadHandler} from '../types';

/**
 * A controller to handle file uploads using multipart/form-data media type
 */
export class FileUploadController {
  /**
   * Constructor
   * @param handler - Inject an express request handler to deal with the request
   */
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
    @repository(AppUsersRepository) public appUsersRepository: AppUsersRepository,
  ) { }


  @post('/files', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  async fileUpload(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, (err) => {
        if (err) {
          err.code = 5;
          resolve(err);
        }
        else {
          resolve(this.getFilesAndFields(request));
        }
      });
    });
  }

  /**
   * Get files and fields for the request
   * @param request - Http request
   */
  private async getFilesAndFields(request: Request) {

    const uploadedFiles = request.files;
    let files: Array<any> = [];
    if (Array.isArray(uploadedFiles)) {
      for (const entry of uploadedFiles) {
        const result = await this.InsertFilesDate(request, entry);
        files.push(_.pick(result.userDoc, ['id', 'docType', 'docName', 'docSize', 'userId', 'creadtedAt']));
      }
    }
    return {code: 0, msg: "Document uploaded successfully", files};
  }

  private async InsertFilesDate(request: Request, file: Express.Multer.File) {
    let result = {code: 5, msg: "Some error occured while updating doc.", userDoc: {}};
    try {
      const userDoc = await this.appUsersRepository.userDocs(request.body.userId).create({docType: request.body.docType, docName: file.filename, docSize: file.size, mimetype: file.mimetype, docPath: file.destination});
      result.userDoc = userDoc;
      result.code = 0;
      result.msg = "Document uploaded successfully";
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
    }
    return result;
  }
}
