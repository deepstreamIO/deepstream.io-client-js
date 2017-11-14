"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonPath = require("../../src/record/json-path");
const chai_1 = require("chai");
describe('objects are created from paths and their value is set correctly', () => {
    it('sets simple values', () => {
        const record = {};
        jsonPath.setValue(record, 'firstname', 'Wolfram');
        chai_1.expect(record).to.deep.equal({ firstname: 'Wolfram' });
    });
    it('sets values for nested objects', () => {
        const record = {};
        jsonPath.setValue(record, 'address.street', 'someStreet');
        chai_1.expect(record).to.deep.equal({
            address: {
                street: 'someStreet'
            }
        });
    });
    it('sets values for nested objects with numeric field names', () => {
        const record = {};
        jsonPath.setValue(record, 'address.street.1', 'someStreet');
        chai_1.expect(record).to.deep.equal({
            address: {
                street: {
                    1: 'someStreet'
                }
            }
        });
    });
    it('sets values for nested objects with multiple numeric field names', () => {
        const record = {};
        jsonPath.setValue(record, 'address.99.street.1', 'someStreet');
        chai_1.expect(record).to.deep.equal({
            address: {
                99: {
                    street: {
                        1: 'someStreet'
                    }
                }
            }
        });
    });
    it('sets values for nested objects with multiple mixed array and numeric field names', () => {
        const record = {};
        jsonPath.setValue(record, 'address[2].99.street[2].1', 'someStreet');
        chai_1.expect(record).to.deep.equal({
            address: [
                undefined,
                undefined,
                {
                    99: {
                        street: [
                            undefined,
                            undefined,
                            {
                                1: 'someStreet'
                            }
                        ]
                    }
                }
            ]
        });
    });
    it('sets first value of array', () => {
        const record = {};
        jsonPath.setValue(record, 'items[0]', 51);
        chai_1.expect(record).to.deep.equal({
            items: [
                51
            ]
        });
    });
    it('sets numeric obj member name of 0 (zero)', () => {
        const record = {};
        jsonPath.setValue(record, 'items.0', 51);
        chai_1.expect(record).to.deep.equal({
            items: {
                0: 51
            }
        });
    });
    it('sets values for arrays', () => {
        const record = {};
        jsonPath.setValue(record, 'pastAddresses[1].street', 'someStreet');
        chai_1.expect(record).to.deep.equal({
            pastAddresses: [
                undefined,
                {
                    street: 'someStreet'
                }
            ]
        });
    });
    it('sets value AS arrays of arrays', () => {
        const record = {
            addresses: undefined
        };
        const arrOfArr = [
            undefined,
            [
                'new-Street1', 'road1', 'blvd1'
            ],
            [
                'street2', 'road2', 'blvd2'
            ]
        ];
        jsonPath.setValue(record, 'addresses', arrOfArr);
        chai_1.expect(record).to.deep.equal({
            addresses: [
                undefined,
                [
                    'new-Street1', 'road1', 'blvd1'
                ],
                [
                    'street2', 'road2', 'blvd2'
                ]
            ]
        });
    });
    it('sets value IN arrays of arrays', () => {
        const record = {
            addresses: [
                undefined,
                [
                    'street1', 'road1', 'blvd1'
                ],
                [
                    'street2', 'road2', 'blvd2'
                ]
            ]
        };
        jsonPath.setValue(record, 'addresses[1][0]', 'new-Street1');
        chai_1.expect(record).to.deep.equal({
            addresses: [
                undefined,
                [
                    'new-Street1', 'road1', 'blvd1'
                ],
                [
                    'street2', 'road2', 'blvd2'
                ]
            ]
        });
    });
    it('sets value IN deeper nested multi-dimensional arrays of arrays', () => {
        const record = {
            obj: {
                101: {
                    addresses: [
                        [
                            undefined,
                            [
                                undefined,
                                ['street1', 'road1', 'blvd1'],
                                ['street2', 'road2', 'blvd2']
                            ],
                            [
                                undefined,
                                { a: 'street1', b: 'road1', c: 'blvd1' },
                                { 1: 'street2', 2: 'road2', 3: 'blvd2' }
                            ]
                        ],
                        undefined,
                        [[0, 1, 2, 3], [9, 8, 7, 6], [2, 4, 6, 8]]
                    ]
                }
            }
        };
        jsonPath.setValue(record, 'obj.101.addresses[0][1][1][0]', 'new-Street1');
        chai_1.expect(record).to.deep.equal({
            obj: {
                101: {
                    addresses: [
                        [
                            undefined,
                            [
                                undefined,
                                ['new-Street1', 'road1', 'blvd1'],
                                ['street2', 'road2', 'blvd2']
                            ],
                            [
                                undefined,
                                { a: 'street1', b: 'road1', c: 'blvd1' },
                                { 1: 'street2', 2: 'road2', 3: 'blvd2' }
                            ]
                        ],
                        undefined,
                        [[0, 1, 2, 3], [9, 8, 7, 6], [2, 4, 6, 8]]
                    ]
                }
            }
        });
    });
    it('extends existing objects', () => {
        const record = { firstname: 'Wolfram' };
        jsonPath.setValue(record, 'lastname', 'Hempel');
        chai_1.expect(record).to.deep.equal({
            firstname: 'Wolfram',
            lastname: 'Hempel'
        });
    });
    it('extends existing arrays', () => {
        const record = {
            firstname: 'Wolfram',
            animals: ['Bear', 'Cow', 'Ostrich']
        };
        jsonPath.setValue(record, 'animals[ 1 ]', 'Emu');
        chai_1.expect(record).to.deep.equal({
            firstname: 'Wolfram',
            animals: ['Bear', 'Emu', 'Ostrich']
        });
    });
    it('extends existing arrays with empty slot assigned a primitive', () => {
        const record = {
            firstname: 'Wolfram',
            animals: [undefined, 'Cow', 'Ostrich']
        };
        jsonPath.setValue(record, 'animals[0]', 'Emu');
        chai_1.expect(record).to.deep.equal({
            firstname: 'Wolfram',
            animals: ['Emu', 'Cow', 'Ostrich']
        });
    });
    it('extends existing arrays with objects', () => {
        const record = {
            firstname: 'Wolfram',
            animals: [undefined, 'Cow', 'Ostrich']
        };
        jsonPath.setValue(record, 'animals[0].xxx', 'Emu');
        chai_1.expect(record).to.deep.equal({
            firstname: 'Wolfram',
            animals: [{ xxx: 'Emu' }, 'Cow', 'Ostrich']
        });
    });
    it('treats numbers with the path such as .0. as a key value', () => {
        const record = {};
        jsonPath.setValue(record, 'animals.0.name', 'Emu');
        chai_1.expect(record).to.deep.equal({
            animals: {
                0: {
                    name: 'Emu'
                }
            }
        });
    });
    it('treats numbers with the path such as [0] as an index value', () => {
        const record = {};
        jsonPath.setValue(record, 'animals[0].name', 'Emu');
        chai_1.expect(record).to.deep.equal({
            animals: [{
                    name: 'Emu'
                }]
        });
    });
    it('handles .xyz paths into non-objects', () => {
        const record = { animals: 3 };
        jsonPath.setValue(record, 'animals.name', 'Emu');
        chai_1.expect(record).to.deep.equal({
            animals: {
                name: 'Emu'
            }
        });
    });
    it('handles .xyz paths through non-objects', () => {
        const record = { animals: 3 };
        jsonPath.setValue(record, 'animals.name.length', 7);
        chai_1.expect(record).to.deep.equal({
            animals: {
                name: {
                    length: 7
                }
            }
        });
    });
    it('handles [0] paths into non-objects', () => {
        const record = { animals: 3 };
        jsonPath.setValue(record, 'animals[0]', 7);
        chai_1.expect(record).to.deep.equal({
            animals: [7]
        });
    });
});
//# sourceMappingURL=json-pathSpec.js.map