"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let CompanyRepository = class CompanyRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, userCredsRepositoryGetter, accountRepositoryGetter, bankAccountRepositoryGetter, serviceProviderRepositoryGetter) {
        super(models_1.Company, dataSource);
        this.userCredsRepositoryGetter = userCredsRepositoryGetter;
        this.accountRepositoryGetter = accountRepositoryGetter;
        this.bankAccountRepositoryGetter = bankAccountRepositoryGetter;
        this.serviceProviderRepositoryGetter = serviceProviderRepositoryGetter;
        this.serviceProviders = this.createHasManyRepositoryFactoryFor('serviceProviders', serviceProviderRepositoryGetter);
        this.registerInclusionResolver('serviceProviders', this.serviceProviders.inclusionResolver);
        this.bankAccount = this.createHasOneRepositoryFactoryFor('bankAccount', bankAccountRepositoryGetter);
        this.registerInclusionResolver('bankAccount', this.bankAccount.inclusionResolver);
        this.account = this.createHasOneRepositoryFactoryFor('account', accountRepositoryGetter);
        this.registerInclusionResolver('account', this.account.inclusionResolver);
        this.userCreds = this.createHasOneRepositoryFactoryFor('userCreds', userCredsRepositoryGetter);
        this.registerInclusionResolver('userCreds', this.userCreds.inclusionResolver);
    }
};
CompanyRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.MongoDb')),
    tslib_1.__param(1, repository_1.repository.getter('UserCredsRepository')),
    tslib_1.__param(2, repository_1.repository.getter('AccountRepository')),
    tslib_1.__param(3, repository_1.repository.getter('BankAccountRepository')),
    tslib_1.__param(4, repository_1.repository.getter('ServiceProviderRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoDbDataSource, Function, Function, Function, Function])
], CompanyRepository);
exports.CompanyRepository = CompanyRepository;
//# sourceMappingURL=company.repository.js.map