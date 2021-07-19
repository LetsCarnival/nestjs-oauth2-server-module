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
exports.RefreshTokenStrategy = void 0;
const strategy_1 = require("../../domain/strategy");
const dto_1 = require("../../ui/dto");
const common_1 = require("@nestjs/common");
const command_1 = require("../../app/command");
const cqrs_1 = require("@nestjs/cqrs");
let RefreshTokenStrategy = class RefreshTokenStrategy {
    /**
     * Constructor
     *
     * @param clientRepository
     * @param accessTokenRepository
     * @param commandBus
     */
    constructor(clientRepository, accessTokenRepository, commandBus) {
        this.clientRepository = clientRepository;
        this.accessTokenRepository = accessTokenRepository;
        this.commandBus = commandBus;
    }
    validate(request, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((client.clientSecret && client.clientSecret !== request.client_secret) ||
                client.deletedAt !== null ||
                !client.grants.includes(request.grant_type)) {
                return false;
            }
            return true;
        });
    }
    getOauth2Response(request, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const expiredToken = yield this.accessTokenRepository.findByRefreshToken(request.refresh_token);
            if (expiredToken.refreshTokenExpiresAt < new Date(Date.now()) || expiredToken.client.clientId !== client.clientId) {
                throw new common_1.UnauthorizedException("You are not allowed to access the given resource");
            }
            // Create a new AccessToken
            const exp = (Date.now() + expiredToken.client.accessTokenLifetime * 1000) / 1000;
            const iat = Date.now() / 1000;
            const accessToken = yield this.commandBus.execute(new command_1.CreateAccessTokenCommand(expiredToken.client.id, expiredToken.scope, exp, iat, {
                client_id: expiredToken.client.clientId,
                client_secret: expiredToken.client.clientSecret,
                exp,
                iat,
                scopes: JSON.parse(expiredToken.scope),
            }, (expiredToken.userId !== null) ? expiredToken.userId : undefined));
            return new dto_1.OAuth2Response(accessToken.accessToken, accessToken.refreshToken, ~~((accessToken.accessTokenExpiresAt.getTime() - Date.now()) / 1000), ~~((accessToken.refreshTokenExpiresAt.getTime() - Date.now()) / 1000));
        });
    }
};
RefreshTokenStrategy = __decorate([
    strategy_1.Oauth2GrantStrategy('refresh_token'),
    __param(0, common_1.Inject('ClientRepositoryInterface')),
    __param(1, common_1.Inject('AccessTokenRepositoryInterface')),
    __metadata("design:paramtypes", [Object, Object, cqrs_1.CommandBus])
], RefreshTokenStrategy);
exports.RefreshTokenStrategy = RefreshTokenStrategy;
//# sourceMappingURL=refresh-token.strategy.js.map