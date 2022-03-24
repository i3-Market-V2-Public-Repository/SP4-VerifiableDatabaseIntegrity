const assert = require('assert');
const {getFirstCommonElements, getIndexOfLastNonZeroElement, byteArrayToHex, keyToPath} = require("../src/services/utils");

describe('utils', function () {
    const hexValue = "1334460c226508d54d9b540d3088cfb41a2c79e3265e6d513f"
    const byteArray = [19, 52, 70, 12, 34, 101, 8, 213, 77, 155, 84, 13, 48, 136, 207, 180, 26, 44, 121, 227, 38, 94, 109, 81, 63]
    const binValue = [  0,  0,  0,  1,  0,  0,  0,  1,  0,  0,  0,  0,  1,  1,  0,  0,  1,  0,  1,  1,  0,  0,  0,  0,  0,  0,  1,
        0,  1,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
    const binValueCopy = [  0,  0,  0,  1,  0,  0,  0,  1,  0,  0,  0,  0,  1,  1,  0,  0,  0,  0,  1,  1,  0,  0,  0,  0,  0,  0,
        0,  1,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]

    describe('#byteArrayToHex()', function () {
        it('should convert byte array to hex string', function () {
            let actual = byteArrayToHex(byteArray)
            assert.strictEqual(actual, hexValue)
        })
    })

    describe('#keyToPath()', function () {
        it('should convert hex string to binary array', function () {
            let actual = keyToPath("540d3088")
            assert.deepStrictEqual(actual, binValue)
        })
    })

    describe('#getIndexOfLastNonZeroElement()', function () {
        it('should obtain index from binary array', function () {
            let actual = getIndexOfLastNonZeroElement(binValue)
            let expectedIndex = 30
            assert.strictEqual(actual, expectedIndex)
        })
    })

    describe('#getFirstCommonElements()', function () {
        it('should obtain an array with the first common elements', function () {
            let actual = getFirstCommonElements(binValue, binValueCopy)
            let expectedCommonArray = [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0]
            assert.deepStrictEqual(actual, expectedCommonArray)
        })
    })

})
