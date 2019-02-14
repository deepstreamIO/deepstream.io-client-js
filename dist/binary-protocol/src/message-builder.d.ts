/**
 * Functions for handling (de)serialization of the deepstream binary realtime protocol.
 *
 * In brief, a message is a variable length binary blob with the following structure:
 *
 *  0                   1                   2                   3
 *  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 * +-+-------------+-+-------------+-------------------------------+
 * |F|  Message    |A|  Message    |             Meta              |
 * |I|   Topic     |C|  Action     |            Length             |
 * |N|    (7)      |K|   (7)       |             (24)              |
 * +-+-------------+-+-------------+-------------------------------+
 * | Meta Cont.    |              Payload Length (24)              |
 * +---------------+-----------------------------------------------+
 * :                     Meta Data (Meta Length * 8)               :
 * + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
 * |                  Payload Data (Payload Length * 8)            :
 * +---------------------------------------------------------------+
 *
 * The first 6 bytes of the message are the header, and the rest of the message is the payload.
 *
 * CONT (1 bit): The continuation bit. If this is set, the following payload of the following
 *                message must be appended to this one. If this is not set, parsing may finish
 *                after the payload is read.
 * RSV{0..3} (1 bit): Reserved for extension.
 * Meta Length (24 bits, unsigned big-endian): The total length of Meta Data in bytes.
 *                If Meta Data can be no longer than 16 MB.
 * Payload Length (24 bits, unsigned big-endian): The total length of Payload in bytes.
 *                If Payload is longer than 16 MB, it must be split into chunks of
 *                less than 2^24 bytes with identical topic and action, setting the CONT bit
 *                in all but the final chunk.
 *
 */
/// <reference types="node" />
import { Message } from './message-constants';
export declare function getMessage(msg: Message, isAck: boolean): Buffer;
