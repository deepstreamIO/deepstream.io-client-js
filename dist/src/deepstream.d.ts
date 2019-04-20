import { Client } from './client';
import { EVENT, CONNECTION_STATE } from './constants';
import * as C from '../binary-protocol/src/message-constants';
import { Options } from './client-options';
declare const _default: ((url: string, options?: Partial<Options> | undefined) => Client) & {
    CONNECTION_STATE: typeof CONNECTION_STATE;
    C: typeof C;
    EVENT: typeof EVENT;
    deepstream: (url: string, options?: Partial<Options> | undefined) => Client;
};
export = _default;
