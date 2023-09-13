"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOrdersRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let ServiceOrdersRepository = class ServiceOrdersRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, servicesRepositoryGetter, crashReportsRepositoryGetter) {
        super(models_1.ServiceOrders, dataSource);
        this.servicesRepositoryGetter = servicesRepositoryGetter;
        this.crashReportsRepositoryGetter = crashReportsRepositoryGetter;
        this.crashReport = this.createHasOneRepositoryFactoryFor('crashReport', crashReportsRepositoryGetter);
        this.registerInclusionResolver('crashReport', this.crashReport.inclusionResolver);
        this.service = this.createBelongsToAccessorFor('service', servicesRepositoryGetter);
        this.registerInclusionResolver('service', this.service.inclusionResolver);
    }
};
ServiceOrdersRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.MongoDb')),
    tslib_1.__param(1, repository_1.repository.getter('ServicesRepository')),
    tslib_1.__param(2, repository_1.repository.getter('CrashReportsRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoDbDataSource, Function, Function])
], ServiceOrdersRepository);
exports.ServiceOrdersRepository = ServiceOrdersRepository;
//# sourceMappingURL=service-orders.repository.js.map