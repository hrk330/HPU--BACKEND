"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let VehicleRepository = class VehicleRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, remindersRepositoryGetter) {
        super(models_1.Vehicle, dataSource);
        this.remindersRepositoryGetter = remindersRepositoryGetter;
        this.reminders = this.createHasManyRepositoryFactoryFor('reminders', remindersRepositoryGetter);
        this.registerInclusionResolver('reminders', this.reminders.inclusionResolver);
    }
};
VehicleRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.MongoDb')),
    tslib_1.__param(1, repository_1.repository.getter('RemindersRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoDbDataSource, Function])
], VehicleRepository);
exports.VehicleRepository = VehicleRepository;
//# sourceMappingURL=vehicle.repository.js.map