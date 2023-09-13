"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDbDataSource = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const config = {
    name: 'MongoDb',
    connector: 'mongodb',
    url: 'mongodb+srv://user:user@cluster0.sxupysi.mongodb.net/test?retryWrites=true&w=majority',
    host: 'cluster0.sxupysi.mongodb.net',
    port: '',
    user: 'planlabweb',
    password: 'Temp123',
    database: 'autoService',
    useNewUrlParser: true,
};
// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
let MongoDbDataSource = class MongoDbDataSource extends repository_1.juggler.DataSource {
    constructor(dsConfig = config) {
        super(dsConfig);
    }
};
MongoDbDataSource.dataSourceName = 'MongoDb';
MongoDbDataSource.defaultConfig = config;
MongoDbDataSource = tslib_1.__decorate([
    (0, core_1.lifeCycleObserver)('datasource'),
    tslib_1.__param(0, (0, core_1.inject)('datasources.config.MongoDb', { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], MongoDbDataSource);
exports.MongoDbDataSource = MongoDbDataSource;
//# sourceMappingURL=mongo-db.datasource.js.map