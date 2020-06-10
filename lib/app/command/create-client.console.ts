import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {Command, Positional} from 'nestjs-command';
import {CreateClientCommand} from './create-client.command';
@Injectable()
export class CreateClientConsole {
    constructor(private readonly commandBus: CommandBus) {}
    @Command({
        command:
            'client:create <client_id> <client_secret> <grant_type> <scopes>',
        autoExit: true,
    })
    async create(
        @Positional({
            name: 'client_id',
            type: 'string',
        }) clientId: string,
        @Positional({
            name: 'client_secret',
            type: 'string',
            demandOption: false,
            default: '',
        }) clientSecret: string,
        @Positional({
            name: 'grant_type',
            type: 'string',
            array: true,
            default: ['password', 'refresh_token'],
        }) grantType: string[],
        @Positional({
            name: 'scopes',
            type: 'string',
            array: true,
            default: [],
        }) scopes: string[],
    ) {
        const command = new CreateClientCommand(
            clientId,
            scopes.join(' '),
            clientId,
            grantType,
            !clientSecret,
        );
        const res = await this.commandBus.execute(command);
        // tslint:disable-next-line:no-console
        console.debug(res);
    }
}