import { ClientEntity } from "./client.entity";
export declare class AccessTokenEntity {
    id: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt: Date;
    client: ClientEntity;
    userId: string;
    /**
     * JSON List of api IDs granted with this token for the client
     */
    scope: string;
    createdAt: Date;
}
