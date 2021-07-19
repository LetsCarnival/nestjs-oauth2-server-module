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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.Oauth2Controller = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const strategy_1 = require("../../domain/strategy");
let Oauth2Controller = class Oauth2Controller {
    /**
     * Constructor
     *
     * @param clientRepository
     * @param strategyRegistry
     */
    constructor(clientRepository, strategyRegistry) {
        this.clientRepository = clientRepository;
        this.strategyRegistry = strategyRegistry;
    }
    token(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.clientRepository.findByClientId(request.client_id);
            if (!(yield this.strategyRegistry.validate(request, client))) {
                throw new common_1.ForbiddenException("You are not allowed to access the given resource");
            }
            return yield this.strategyRegistry.getOauth2Response(request, client);
        });
    }
};
__decorate([
    common_1.Post('token'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.OAuth2Request]),
    __metadata("design:returntype", Promise)
], Oauth2Controller.prototype, "token", null);
Oauth2Controller = __decorate([
    common_1.Controller('oauth2'),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    __param(0, common_1.Inject('ClientRepositoryInterface')),
    __metadata("design:paramtypes", [Object, strategy_1.Oauth2GrantStrategyRegistry])
], Oauth2Controller);
exports.Oauth2Controller = Oauth2Controller;
//# sourceMappingURL=oauth2.controller.js.map