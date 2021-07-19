import { DynamicModule } from "@nestjs/common";
import { Oauth2AsyncOptionsInterface, OAuth2Options } from "./interfaces";
export declare class OAuth2Module {
    static forRoot(options?: OAuth2Options): DynamicModule;
    static forRootAsync(options: Oauth2AsyncOptionsInterface): DynamicModule;
}
