import {DynamicModule, Module} from "@nestjs/common";
import {Oauth2CoreModule} from "./oauth2-core.module";
import {Oauth2AsyncOptionsInterface, OAuth2Options} from "./interfaces";

@Module({})
export class OAuth2Module {
    public static forRoot(options?: OAuth2Options): DynamicModule {
        return {
            module: OAuth2Module,
            imports: [
                /** Modules **/
                Oauth2CoreModule.forRoot(options),
            ],
        };
    }

    public static forRootAsync(options: Oauth2AsyncOptionsInterface): DynamicModule {
        return {
            module: OAuth2Module,
            imports: [
                /** Modules **/
                Oauth2CoreModule.forRootAsync(options),
            ],
        };
    }
}
