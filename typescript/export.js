"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Transaction = /** @class */ (function () {
    function Transaction() {
        this.store = {};
        this.store = {};
        this.logs = [];
    }
    ;
    Transaction.prototype.dispatch = function (scenario) {
        var _this = this;
        this.scenario = scenario.sort(function (a, b) { return a.index - b.index; });
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var _i, scenario_1, scene, log, err_1, resError_1, reversLogsNum, index, _a, _b, i, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _i = 0, scenario_1 = scenario;
                        _c.label = 1;
                    case 1:
                        if (!(_i < scenario_1.length)) return [3 /*break*/, 19];
                        scene = scenario_1[_i];
                        log = {
                            index: scene.index,
                            meta: scene.meta,
                            storeBefore: this.store,
                            error: null,
                        };
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 18]);
                        return [4 /*yield*/, scene.call(this.store)];
                    case 3:
                        _c.sent();
                        log.storeAfter = this.store;
                        this.logs.push(JSON.parse(JSON.stringify(log)));
                        return [3 /*break*/, 18];
                    case 4:
                        err_1 = _c.sent();
                        if (!(typeof scene.restore !== "undefined")) return [3 /*break*/, 17];
                        _c.label = 5;
                    case 5:
                        _c.trys.push([5, 7, , 17]);
                        return [4 /*yield*/, scene.restore(this.store)];
                    case 6:
                        _c.sent();
                        log.error = {
                            name: err_1.name,
                            message: err_1.message,
                            info: "This step have no restore error",
                        };
                        log.storeAfter = scene.restore(this.store);
                        this.logs.push(JSON.parse(JSON.stringify(log)));
                        return [3 /*break*/, 17];
                    case 7:
                        resError_1 = _c.sent();
                        log.error = {
                            name: resError_1.name,
                            message: resError_1.message,
                            info: "This step have restore error",
                        };
                        delete log.storeBefore;
                        this.logs.push(JSON.parse(JSON.stringify(log)));
                        reversLogsNum = this.logs.length - 2;
                        reversLogsNum;
                        _c.label = 8;
                    case 8:
                        if (!(reversLogsNum >= 0)) return [3 /*break*/, 16];
                        index = this.logs[reversLogsNum].index;
                        _a = 0, _b = this.scenario;
                        _c.label = 9;
                    case 9:
                        if (!(_a < _b.length)) return [3 /*break*/, 14];
                        i = _b[_a];
                        if (!(i.index === index)) return [3 /*break*/, 13];
                        if (!(this.logs[reversLogsNum].error === null)) return [3 /*break*/, 13];
                        _c.label = 10;
                    case 10:
                        _c.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, i.restore(this.store)];
                    case 11:
                        _c.sent();
                        this.logs[reversLogsNum].error = "firstly call successful,than restored";
                        return [3 /*break*/, 13];
                    case 12:
                        e_1 = _c.sent();
                        this.logs[reversLogsNum].error = "firstly call successful, than restored error";
                        throw new Error("Restore failed: " + e_1.message + " with index " + i.index);
                    case 13:
                        _a++;
                        return [3 /*break*/, 9];
                    case 14:
                        console.log(this.logs[reversLogsNum]);
                        _c.label = 15;
                    case 15:
                        reversLogsNum--;
                        return [3 /*break*/, 8];
                    case 16:
                        this.store = null;
                        return [3 /*break*/, 19];
                    case 17: return [3 /*break*/, 18];
                    case 18:
                        _i++;
                        return [3 /*break*/, 1];
                    case 19: return [2 /*return*/];
                }
            });
        }); })();
    };
    return Transaction;
}());
var scenario = [
    {
        index: 1,
        meta: {
            title: "Read popular customers",
            description: "This action is responsible for reading the most popular customers",
        },
        // callback for main execution
        call: function (store) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //   throw new Error("some error");
                return [2 /*return*/, store];
            });
        }); },
        // callback for rollback
        restore: function (store) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // throw new Error("restore1 error");
                return [2 /*return*/, store];
            });
        }); },
    },
    {
        index: 30,
        meta: {
            title: "Delete customer",
            description: "This action is responsible for deleting customer",
        },
        // callback for main execution
        call: function (store) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new TypeError("some error");
            });
        }); },
        // callback for rollback
        restore: function (store) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //   return store;
                throw new Error("restore2 error");
            });
        }); },
    },
    {
        index: 25,
        meta: {
            title: "Delete customer",
            description: "This action is responsible for deleting customer",
        },
        // callback for main execution
        call: function (store) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new TypeError("some error");
            });
        }); },
        // callback for rollback
        restore: function (store) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, store];
            });
        }); },
    },
];
var transaction = new Transaction();
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, transaction.dispatch(scenario)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                // log detailed error
                // const errors = [];
                // let error = {
                //   name: err.name,
                //   message: err.message,
                //   track: err.track,
                // };
                // errors.push(error);
                console.log(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=export.js.map