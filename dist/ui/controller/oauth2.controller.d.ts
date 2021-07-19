import { OAuth2Request, OAuth2Response } from "../dto";
import { Oauth2GrantStrategyRegistry } from "../../domain/strategy";
import { ClientRepositoryInterface } from "../../domain/repository";
export declare class Oauth2Controller {
    private readonly clientRepository;
    private readonly strategyRegistry;
    /**
     * Constructor
     *
     * @param clientRepository
     * @param strategyRegistry
     */
    constructor(clientRepository: ClientRepositoryInterface, strategyRegistry: Oauth2GrantStrategyRegistry);
    token(request: OAuth2Request): Promise<OAuth2Response>;
}
