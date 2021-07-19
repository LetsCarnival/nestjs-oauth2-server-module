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
exports.CreateClientHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const create_client_command_1 = require("./create-client.command");
const domain_1 = require("../../domain");
const uuid = require("uuid/v4");
const crypto = require("crypto");
const selfsigned = require("selfsigned");
const event_1 = require("../event");
let CreateClientHandler = class CreateClientHandler {
    constructor(clientRepository, eventBus) {
        this.clientRepository = clientRepository;
        this.eventBus = eventBus;
    }
    /**
     * Execute the create Client Command
     *
     * @param command
     */
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new domain_1.ClientEntity();
            client.name = command.name;
            client.clientId = command.clientId || uuid();
            if (!command.noSecret) {
                client.clientSecret = crypto.randomBytes(32).toString('hex');
            }
            client.scope = command.scope;
            client.accessTokenLifetime = command.accessTokenLifetime || 3600;
            client.refreshTokenLifetime = command.refreshTokenLifetime || 7200;
            client.grants = command.grants || ['client_credentials', 'refresh_token'];
            // generate keys
            const attrs = [{ name: 'commonName', value: command.name }];
            const pem = selfsigned.generate(attrs, { days: 365 });
            client.privateKey = pem.private;
            client.publicKey = pem.public;
            client.cert = pem.cert;
            const exp = new Date();
            exp.setDate(exp.getDate() + 365);
            client.certExpiresAt = exp;
            const createdClient = yield this.clientRepository.create(client);
            // emit an access token created event
            this.eventBus.publish(new event_1.ClientCreatedEvent(createdClient.id, createdClient.name, createdClient.clientId, createdClient.certExpiresAt));
            return createdClient;
        });
    }
};
CreateClientHandler = __decorate([
    cqrs_1.CommandHandler(create_client_command_1.CreateClientCommand),
    __param(0, common_1.Inject('ClientRepositoryInterface')),
    __metadata("design:paramtypes", [Object, cqrs_1.EventBus])
], CreateClientHandler);
exports.CreateClientHandler = CreateClientHandler;
//# sourceMappingURL=create-client.handler.js.map