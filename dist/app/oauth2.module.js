"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var OAuth2Module_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2Module = void 0;
const common_1 = require("@nestjs/common");
const oauth2_core_module_1 = require("./oauth2-core.module");
let OAuth2Module = OAuth2Module_1 = class OAuth2Module {
    static forRoot(options) {
        return {
            module: OAuth2Module_1,
            imports: [
                /** Modules **/
                oauth2_core_module_1.Oauth2CoreModule.forRoot(options),
            ],
        };
    }
    static forRootAsync(options) {
        return {
            module: OAuth2Module_1,
            imports: [
                /** Modules **/
                oauth2_core_module_1.Oauth2CoreModule.forRootAsync(options),
            ],
        };
    }
};
OAuth2Module = OAuth2Module_1 = __decorate([
    common_1.Module({})
], OAuth2Module);
exports.OAuth2Module = OAuth2Module;
//# sourceMappingURL=oauth2.module.js.map