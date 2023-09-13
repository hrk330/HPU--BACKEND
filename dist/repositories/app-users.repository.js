"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUsersRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let AppUsersRepository = class AppUsersRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, vehicleRepositoryGetter, userCredsRepositoryGetter, userDocsRepositoryGetter, accountRepositoryGetter, withdrawalRequestRepositoryGetter) {
        super(models_1.AppUsers, dataSource);
        this.vehicleRepositoryGetter = vehicleRepositoryGetter;
        this.userCredsRepositoryGetter = userCredsRepositoryGetter;
        this.userDocsRepositoryGetter = userDocsRepositoryGetter;
        this.accountRepositoryGetter = accountRepositoryGetter;
        this.withdrawalRequestRepositoryGetter = withdrawalRequestRepositoryGetter;
        this.withdrawalRequests = this.createHasManyRepositoryFactoryFor('withdrawalRequests', withdrawalRequestRepositoryGetter);
        this.registerInclusionResolver('withdrawalRequests', this.withdrawalRequests.inclusionResolver);
        this.account = this.createHasOneRepositoryFactoryFor('account', accountRepositoryGetter);
        this.registerInclusionResolver('account', this.account.inclusionResolver);
        this.userDocs = this.createHasManyRepositoryFactoryFor('userDocs', userDocsRepositoryGetter);
        this.registerInclusionResolver('userDocs', this.userDocs.inclusionResolver);
        this.userCreds = this.createHasOneRepositoryFactoryFor('userCreds', userCredsRepositoryGetter);
        this.registerInclusionResolver('userCreds', this.userCreds.inclusionResolver);
        this.vehicles = this.createHasManyRepositoryFactoryFor('vehicles', vehicleRepositoryGetter);
        this.registerInclusionResolver('vehicles', this.vehicles.inclusionResolver);
    }
};
AppUsersRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.MongoDb')),
    tslib_1.__param(1, repository_1.repository.getter('VehicleRepository')),
    tslib_1.__param(2, repository_1.repository.getter('UserCredsRepository')),
    tslib_1.__param(3, repository_1.repository.getter('UserDocsRepository')),
    tslib_1.__param(4, repository_1.repository.getter('AccountRepository')),
    tslib_1.__param(5, repository_1.repository.getter('WithdrawalRequestRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoDbDataSource, Function, Function, Function, Function, Function])
], AppUsersRepository);
exports.AppUsersRepository = AppUsersRepository;
//# sourceMappingURL=app-users.repository.js.map