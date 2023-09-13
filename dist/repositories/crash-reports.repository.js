"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrashReportsRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let CrashReportsRepository = class CrashReportsRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, witnessRepositoryGetter) {
        super(models_1.CrashReports, dataSource);
        this.witnessRepositoryGetter = witnessRepositoryGetter;
        this.witnesses = this.createHasManyRepositoryFactoryFor('witnesses', witnessRepositoryGetter);
        this.registerInclusionResolver('witnesses', this.witnesses.inclusionResolver);
    }
};
CrashReportsRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.MongoDb')),
    tslib_1.__param(1, repository_1.repository.getter('WitnessRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoDbDataSource, Function])
], CrashReportsRepository);
exports.CrashReportsRepository = CrashReportsRepository;
//# sourceMappingURL=crash-reports.repository.js.map