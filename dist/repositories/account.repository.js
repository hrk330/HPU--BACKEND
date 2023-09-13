"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let AccountRepository = class AccountRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, withdrawalRequestRepositoryGetter) {
        super(models_1.Account, dataSource);
        this.withdrawalRequestRepositoryGetter = withdrawalRequestRepositoryGetter;
        this.withdrawalRequests = this.createHasManyRepositoryFactoryFor('withdrawalRequests', withdrawalRequestRepositoryGetter);
        this.registerInclusionResolver('withdrawalRequests', this.withdrawalRequests.inclusionResolver);
    }
};
AccountRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.MongoDb')),
    tslib_1.__param(1, repository_1.repository.getter('WithdrawalRequestRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoDbDataSource, Function])
], AccountRepository);
exports.AccountRepository = AccountRepository;
//# sourceMappingURL=account.repository.js.map