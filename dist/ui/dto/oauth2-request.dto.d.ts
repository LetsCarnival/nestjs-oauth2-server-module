/**
 * Main object used to transport data
 */
export declare class OAuth2Request {
    grant_type: string;
    client_id: string;
    client_secret: string;
    exp?: number;
    iat?: number;
    scopes?: string | string[];
    refresh_token?: string;
    username?: string;
    password?: string;
}
