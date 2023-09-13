"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const multer_1 = tslib_1.__importDefault(require("multer"));
const keys_1 = require("../keys");
/**
 * A provider to return an `Express` request handler from `multer` middleware
 */
let FileUploadProvider = class FileUploadProvider {
    constructor(options = {}) {
        this.options = options;
        if (!this.options.storage) {
            // Default to in-memory storage
            this.options.storage = multer_1.default.memoryStorage();
        }
    }
    value() {
        return (0, multer_1.default)(this.options).any();
    }
};
FileUploadProvider = tslib_1.__decorate([
    (0, core_1.injectable)({
        scope: core_1.BindingScope.TRANSIENT,
        tags: { [core_1.ContextTags.KEY]: keys_1.FILE_UPLOAD_SERVICE },
    }),
    tslib_1.__param(0, (0, core_1.config)()),
    tslib_1.__metadata("design:paramtypes", [Object])
], FileUploadProvider);
exports.FileUploadProvider = FileUploadProvider;
//# sourceMappingURL=file-upload.service.js.map