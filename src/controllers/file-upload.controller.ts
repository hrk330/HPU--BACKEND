// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
    param,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import _ from 'lodash';
import { unlink } from 'node:fs/promises';
import {FILE_UPLOAD_SERVICE} from '../keys';
import { UserDocs } from '../models';
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


  @post('/files/{userId}', {
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
    @param.path.string('userId') userId: string,  
  ): Promise<object> {
	  if(userId) {
	    return new Promise<object>((resolve, reject) => {
	      this.handler(request, response, (err) => {
	        if (err) {
	          err.code = 5;
	          resolve(err);
	        }
	        else {
	          resolve(this.saveUploadedFileRecords(request));
	        }
	      });
	    });
    } else {
			return {code: 5, msg: "Some error occured while uploading doc.", userDoc: {}};
		}
  }

  /**
   * Get files and fields for the request
   * @param request - Http request
   */
  private async saveUploadedFileRecords(request: Request) {

    const uploadedFiles = request.files;
    const files = [];
    if (Array.isArray(uploadedFiles)) {
      for (const entry of uploadedFiles) {
        const result = await this.insertFilesDate(request, entry);
        files.push(_.pick(result.userDoc, ['id', 'docType', 'docName', 'docSize', 'userId', 'creadtedAt']));
      }
    }
    return {code: 0, msg: "File uploaded successfully", files};
  }

  private async insertFilesDate(request: Request, file: Express.Multer.File) {
    const result = {code: 5, msg: "Some error occured while updating doc.", userDoc: {}};
    try {
			if(file?.destination) {
				file.destination = '/assets/media/';
			}
			let userDoc: UserDocs = new UserDocs;
			if(request.body.docUpdate) {
				let userDocsArray: UserDocs[] = await this.appUsersRepository.userDocs(request.body.userId).find({where: {docType: request.body.docType, id: request.body.id}});
				if(userDocsArray?.length > 0) {
					try{
						await unlink(__dirname + '/../../public/assets/media/' + userDocsArray[0].docName);
					} catch(e) {
						console.log(e.message);
					}
					await this.appUsersRepository.userDocs(request.body.userId).patch({docName: file.filename, docSize: file.size, mimetype: file.mimetype, docPath: file.destination, docStatus: "P", comments: request.body.comments, updatedAt: new Date()}, {docType: request.body.docType, id: request.body.id});
					userDocsArray = await this.appUsersRepository.userDocs(request.body.userId).find({where: {docType: request.body.docType, id: request.body.id}});
					if(userDocsArray?.length > 0) {
						userDoc = userDocsArray[0];
					}	
				}
			} else {
				userDoc = await this.appUsersRepository.userDocs(request.body.userId).create({docType: request.body.docType, docName: file.filename, docSize: file.size, mimetype: file.mimetype, docPath: file.destination, comments: request.body.comments});	
			}
      
      if(request.body.docType === 'PP') {
      	await this.appUsersRepository.updateById(request.body.userId, {profilePic: '/assets/media/' + file.filename});
      }
      result.userDoc = userDoc;
      result.code = 0;
      result.msg = "File uploaded successfully";
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
    }
    return result;
  }
}
