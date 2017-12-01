import { Client } from './client';
import { EVENT, CONNECTION_STATE } from './constants';
import * as C from '../binary-protocol/src/message-constants';
declare const _default: ((url: string, options?: any) => Client) & {
    CONNECTION_STATE: typeof CONNECTION_STATE;
    C: typeof C;
    EVENT: typeof EVENT;
    deepstream: (url: string, options?: any) => Client;
};
export = _default;
