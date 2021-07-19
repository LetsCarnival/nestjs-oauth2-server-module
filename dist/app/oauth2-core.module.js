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
var Oauth2CoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oauth2CoreModule = exports.Providers = exports.Oauth2Strategies = exports.Resolvers = exports.ServiceNames = exports.Services = exports.Sagas = exports.QueryHandlers = exports.EventHandlers = exports.CommandHandlers = void 0;
const common_1 = require("@nestjs/common");
const domain_1 = require("../domain");
const oauth2_constants_1 = require("./oauth2.constants");
const command_1 = require("./command");
const typeorm_1 = require("../infrastructure/typeorm");
const oauth2_grant_strategy_1 = require("../infrastructure/oauth2-grant-strategy");
const strategy_1 = require("../infrastructure/strategy");
const controller_1 = require("../ui/controller");
const typeorm_2 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
exports.CommandHandlers = [
    command_1.CreateClientHandler,
    command_1.CreateAccessTokenHandler,
];
exports.EventHandlers = [];
exports.QueryHandlers = [];
exports.Sagas = [];
exports.Services = [
    { provide: 'ClientRepositoryInterface', useClass: typeorm_1.ClientRepository },
    { provide: 'AccessTokenRepositoryInterface', useClass: typeorm_1.AccessTokenRepository },
];
exports.ServiceNames = [
    'ClientRepositoryInterface',
    'AccessTokenRepositoryInterface',
];
exports.Resolvers = [];
exports.Oauth2Strategies = [
    oauth2_grant_strategy_1.ClientCredentialsStrategy,
    oauth2_grant_strategy_1.RefreshTokenStrategy,
    oauth2_grant_strategy_1.PasswordStrategy,
];
exports.Providers = [
    domain_1.StrategyExplorer,
    domain_1.Oauth2GrantStrategyRegistry,
];
let Oauth2CoreModule = Oauth2CoreModule_1 = class Oauth2CoreModule {
    constructor(options, explorerService, strategyRegistry) {
        this.options = options;
        this.explorerService = explorerService;
        this.strategyRegistry = strategyRegistry;
    }
    /**
     * Create the static for Root Options
     *
     * @param options
     */
    static forRoot(options) {
        const oAuth2OptionsProvider = {
            provide: oauth2_constants_1.OAUTH2_SERVER_OPTIONS,
            useValue: options,
        };
        const userLoaderProvider = {
            provide: 'UserLoaderInterface',
            useFactory: (options) => __awaiter(this, void 0, void 0, function* () {
                return options.userLoader;
            }),
            inject: [oauth2_constants_1.OAUTH2_SERVER_OPTIONS],
        };
        const userValidatorProvider = {
            provide: 'UserValidatorInterface',
            useFactory: (options) => __awaiter(this, void 0, void 0, function* () {
                return options.userValidator;
            }),
            inject: [oauth2_constants_1.OAUTH2_SERVER_OPTIONS],
        };
        return {
            module: Oauth2CoreModule_1,
            imports: [
                cqrs_1.CqrsModule,
                typeorm_2.TypeOrmModule.forFeature([
                    domain_1.ClientEntity,
                    domain_1.AccessTokenEntity,
                ]),
            ],
            controllers: [
                controller_1.Oauth2Controller
            ],
            providers: [
                oAuth2OptionsProvider,
                userValidatorProvider,
                userLoaderProvider,
                ...exports.Providers,
                ...exports.Services,
                ...exports.Resolvers,
                ...exports.Oauth2Strategies,
                ...exports.CommandHandlers,
                ...exports.EventHandlers,
                ...exports.QueryHandlers,
                ...exports.Sagas,
                strategy_1.AccessTokenStrategy,
            ],
            exports: [
                ...exports.Providers,
                ...exports.ServiceNames,
                userValidatorProvider,
                userLoaderProvider
            ]
        };
    }
    static forRootAsync(options) {
        const providers = this.createAsyncProviders(options);
        const userLoaderProvider = {
            provide: 'UserLoaderInterface',
            useFactory: (options) => __awaiter(this, void 0, void 0, function* () {
                return options.userLoader;
            }),
            inject: [oauth2_constants_1.OAUTH2_SERVER_OPTIONS],
        };
        const userValidatorProvider = {
            provide: 'UserValidatorInterface',
            useFactory: (options) => __awaiter(this, void 0, void 0, function* () {
                return options.userValidator;
            }),
            inject: [oauth2_constants_1.OAUTH2_SERVER_OPTIONS],
        };
        return {
            module: Oauth2CoreModule_1,
            imports: [
                ...(options.imports || []),
                cqrs_1.CqrsModule,
                typeorm_2.TypeOrmModule.forFeature([
                    domain_1.ClientEntity,
                    domain_1.AccessTokenEntity,
                ]),
            ],
            providers: [
                ...providers,
                userValidatorProvider,
                userLoaderProvider,
                ...exports.Providers,
                ...exports.Services,
                ...exports.Resolvers,
                ...exports.Oauth2Strategies,
                ...exports.CommandHandlers,
                ...exports.EventHandlers,
                ...exports.QueryHandlers,
                ...exports.Sagas,
                strategy_1.AccessTokenStrategy,
            ],
            controllers: [
                controller_1.Oauth2Controller
            ],
            exports: [
                ...exports.Providers,
                ...exports.ServiceNames,
                userValidatorProvider,
                userLoaderProvider
            ]
        };
    }
    static createAsyncProviders(options) {
        const providers = [
            this.createAsyncOptionsProvider(options),
        ];
        return providers;
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: oauth2_constants_1.OAUTH2_SERVER_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            provide: oauth2_constants_1.OAUTH2_SERVER_OPTIONS,
            useFactory: (optionsFactory) => __awaiter(this, void 0, void 0, function* () {
                return optionsFactory.createOauth2Options();
            }),
            inject: [options.useExisting || options.useClass],
        };
    }
    onModuleInit() {
        const { strategies } = this.explorerService.explore();
        this.strategyRegistry.register(strategies);
    }
};
Oauth2CoreModule = Oauth2CoreModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({}),
    __param(0, common_1.Inject(oauth2_constants_1.OAUTH2_SERVER_OPTIONS)),
    __metadata("design:paramtypes", [Object, domain_1.StrategyExplorer,
        domain_1.Oauth2GrantStrategyRegistry])
], Oauth2CoreModule);
exports.Oauth2CoreModule = Oauth2CoreModule;
//# sourceMappingURL=oauth2-core.module.js.map