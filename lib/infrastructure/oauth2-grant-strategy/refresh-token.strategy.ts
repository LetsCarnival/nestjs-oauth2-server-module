import {Oauth2GrantStrategy, Oauth2GrantStrategyInterface} from "../../domain/strategy";
import {OAuth2Request, OAuth2Response} from "../../ui/dto";
import {Inject, UnauthorizedException} from "@nestjs/common";
import {AccessTokenEntity, AccessTokenRepositoryInterface, ClientEntity, ClientRepositoryInterface} from "../../domain";
import {CreateAccessTokenCommand} from "../../app/command";
import {CommandBus} from "@nestjs/cqrs";

@Oauth2GrantStrategy('refresh_token')
export class RefreshTokenStrategy implements Oauth2GrantStrategyInterface {

    /**
     * Constructor
     *
     * @param clientRepository
     * @param accessTokenRepository
     * @param commandBus
     */
    constructor(
        @Inject('ClientRepositoryInterface')
        private readonly clientRepository: ClientRepositoryInterface,
        @Inject('AccessTokenRepositoryInterface')
        private readonly accessTokenRepository: AccessTokenRepositoryInterface,
        private readonly commandBus: CommandBus,
    ) {
    }

    async validate(request: OAuth2Request, client: ClientEntity): Promise<boolean> {
        if (
            (client.clientSecret && client.clientSecret !== request.client_secret) ||
            client.deletedAt !== null ||
            !client.grants.includes(request.grant_type)) {
            return false;
        }

        return true;
    }

    async getOauth2Response(request: OAuth2Request, client: ClientEntity): Promise<OAuth2Response> {
        const expiredToken = await this.accessTokenRepository.findByRefreshToken(request.refresh_token);
        if (expiredToken.refreshTokenExpiresAt < new Date(Date.now()) || expiredToken.client.clientId !== client.clientId) {
            throw new UnauthorizedException("You are not allowed to access the given resource");
        }

        // Create a new AccessToken
        const exp = (Date.now() + expiredToken.client.accessTokenLifetime * 1000) / 1000;
        const iat = Date.now() / 1000;
        const accessToken: AccessTokenEntity = await this.commandBus.execute(new CreateAccessTokenCommand(
            expiredToken.client.id,
            expiredToken.scope,
            exp,
            iat,
            {
                client_id: expiredToken.client.clientId,
                client_secret: expiredToken.client.clientSecret,
                exp,
                iat,
                scopes: JSON.parse(expiredToken.scope),
            } as OAuth2Request,
            (expiredToken.userId !== null) ? expiredToken.userId : undefined
        ));

        return new OAuth2Response(
            accessToken.accessToken,
            accessToken.refreshToken,
            ~~((accessToken.accessTokenExpiresAt.getTime() - Date.now()) / 1000),
            ~~((accessToken.refreshTokenExpiresAt.getTime() - Date.now()) / 1000),
        );
    }
}
