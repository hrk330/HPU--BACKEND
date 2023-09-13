"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProviderRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let ServiceProviderRepository = class ServiceProviderRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, userCredsRepositoryGetter, userDocsRepositoryGetter, withdrawalRequestRepositoryGetter, accountRepositoryGetter) {
        super(models_1.ServiceProvider, dataSource);
        this.userCredsRepositoryGetter = userCredsRepositoryGetter;
        this.userDocsRepositoryGetter = userDocsRepositoryGetter;
        this.withdrawalRequestRepositoryGetter = withdrawalRequestRepositoryGetter;
        this.accountRepositoryGetter = accountRepositoryGetter;
        this.account = this.createHasOneRepositoryFactoryFor('account', accountRepositoryGetter);
        this.registerInclusionResolver('account', this.account.inclusionResolver);
        this.withdrawalRequests = this.createHasManyRepositoryFactoryFor('withdrawalRequests', withdrawalRequestRepositoryGetter);
        this.registerInclusionResolver('withdrawalRequests', this.withdrawalRequests.inclusionResolver);
        this.userDocs = this.createHasManyRepositoryFactoryFor('userDocs', userDocsRepositoryGetter);
        this.registerInclusionResolver('userDocs', this.userDocs.inclusionResolver);
        this.userCreds = this.createHasOneRepositoryFactoryFor('userCreds', userCredsRepositoryGetter);
        this.registerInclusionResolver('userCreds', this.userCreds.inclusionResolver);
    }
};
ServiceProviderRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.MongoDb')),
    tslib_1.__param(1, repository_1.repository.getter('UserCredsRepository')),
    tslib_1.__param(2, repository_1.repository.getter('UserDocsRepository')),
    tslib_1.__param(3, repository_1.repository.getter('WithdrawalRequestRepository')),
    tslib_1.__param(4, repository_1.repository.getter('AccountRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoDbDataSource, Function, Function, Function, Function])
], ServiceProviderRepository);
exports.ServiceProviderRepository = ServiceProviderRepository;
//# sourceMappingURL=service-provider.repository.js.map