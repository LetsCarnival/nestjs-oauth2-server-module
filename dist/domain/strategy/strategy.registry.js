"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oauth2GrantStrategyRegistry = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const strategy_explorer_1 = require("./strategy.explorer");
/**
 * This is the main class used to execute strategies
 */
let Oauth2GrantStrategyRegistry = class Oauth2GrantStrategyRegistry {
    constructor(moduleRef) {
        this.moduleRef = moduleRef;
        /**
         * Store all available granted strategy
         */
        this.registry = {};
    }
    /**
     * Register a single strategy
     *
     * @param strategy
     */
    registerStrategy(strategy) {
        const instance = this.moduleRef.get(strategy, { strict: false });
        if (!instance) {
            return;
        }
        const strategyName = this.reflectStrategyName(strategy);
        this.registry[strategyName] = instance;
    }
    /**
     * Register all strategies with the decorator
     *
     * @param strategies
     */
    register(strategies = []) {
        strategies.forEach(strategy => this.registerStrategy(strategy));
    }
    /**
     * Validate the client associated to the given request
     *
     * @param request
     * @param client
     */
    validate(request, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(request.grant_type in this.registry)) {
                throw new common_1.HttpException(`Cannot find the a strategy for the grant type "${request.grant_type}"`, 400);
            }
            return yield this.registry[request.grant_type].validate(request, client);
        });
    }
    /**
     * Get the response
     *
     * @param request
     * @param client
     */
    getOauth2Response(request, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(request.grant_type in this.registry)) {
                throw new common_1.HttpException(`Cannot find the a strategy for the grant type "${request.grant_type}"`, 400);
            }
            return yield this.registry[request.grant_type].getOauth2Response(request, client);
        });
    }
    reflectStrategyName(strategy) {
        return Reflect.getMetadata(strategy_explorer_1.OAUTH2_STRATEGY_METADATA, strategy);
    }
};
Oauth2GrantStrategyRegistry = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ModuleRef])
], Oauth2GrantStrategyRegistry);
exports.Oauth2GrantStrategyRegistry = Oauth2GrantStrategyRegistry;
//# sourceMappingURL=strategy.registry.js.map