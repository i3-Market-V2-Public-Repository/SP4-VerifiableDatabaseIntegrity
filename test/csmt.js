const assert = require('assert');
const HASH = require("crypto-js/sha256");
const CryptoJS = require("crypto-js");
const CSMT = require("../src/services/csmt");

describe('CSMT basic tests', function () {
    const  sampleData = [
        {'id': [25, 35, 239], 'value': 'abc'},
        {'id': [26, 18, 220], 'value': 'xyz'},
        {'id': [35, 7, 170], 'value': 'rst'},
    ]
    const rootHash = "d1078e34f362c7cd8b656139ffb5d73f83001c651d856b46264d621c7190b397"

    describe('#constructor()', function () {
        it('should not throw errors on initialization', function () {
            assert.doesNotThrow(() => new CSMT.CSMT())
        })
    })

    describe('#add()', function () {
        it('data should be inserted', function () {
            let tree = new CSMT.CSMT()
            tree.add([25, 35, 239], 'abc')
            let expected = HASH('abc').toString(CryptoJS.enc.Hex)
            assert.strictEqual(tree.get([25, 35, 239]), expected)
        })
    })

    describe('#get()', function () {
        it('items should be retrievable', function () {
            let tree = new CSMT.CSMT()
            tree.insert(sampleData)
            let expected = HASH(sampleData[0].value).toString(CryptoJS.enc.Hex)
            assert.strictEqual(tree.get(sampleData[0].id), expected)
        })
    })

    describe('#delete()', function () {
        it('items should be deletable', function () {
            let tree = new CSMT.CSMT()
            tree.insert(sampleData)
            tree.delete(sampleData[1].id)
            assert.strictEqual(tree.get(sampleData[1].id), undefined)
        })
    })

    describe('#insert()', function () {
        it('data should be inserted and root hash should match', function () {
            let tree = new CSMT.CSMT()
            tree.insert(sampleData)
            assert.strictEqual(tree.root, rootHash)
        })
    })

    describe('#createProof()', function () {
        it('proof of membership should be obtainable', function () {
            let tree = new CSMT.CSMT()
            tree.insert(sampleData)
            let proof = tree.createProof(sampleData[2].id)
            assert.strictEqual(proof.root, rootHash)
            assert.strictEqual(proof.membership, true)
        })
    })

    describe('#createProof()_2', function () {
        it('proof of non-membership should be obtainable', function () {
            let tree = new CSMT.CSMT()
            tree.insert(sampleData)
            let proof = tree.createProof([0, 0, 0])
            assert.strictEqual(proof.root, rootHash)
            assert.strictEqual(proof.membership, false)
        })
    })

    describe('#verifyProof()', function () {
        it('proof of membership should be verifiable', function () {
            let tree = new CSMT.CSMT()
            tree.insert(sampleData)
            let proof = tree.createProof(sampleData[2].id)
            assert.strictEqual(tree.verifyProof(proof), true)
        })
    })

    describe('#verifyProof()_2', function () {
        it('proof of non-membership should be verifiable', function () {
            let tree = new CSMT.CSMT()
            tree.insert(sampleData)
            let proof = tree.createProof([0, 0, 0])
            assert.strictEqual(tree.verifyProof(proof), true)
        })
    })

    describe('#verifyProof()_3', function () {
        it('tampered proof of membership should not be verifiable', function () {
            let tree = new CSMT.CSMT()
            tree.insert(sampleData)
            let proof = tree.createProof(sampleData[2].id)
            proof.sideNodes.pop()
            assert.strictEqual(tree.verifyProof(proof), false)
        })
    })
})

describe('CSMT advanced tests', function () {
    const  sampleData = [
        {'id': [25, 89, 254, 193, 294, 228, 161, 267, 159, 16, 201, 282, 236, 206, 78, 141, 289, 116, 65, 54, 236, 182, 176, 52,
                178, 125, 55, 79, 131, 183, 11, 32, 217, 154, 130, 173, 160, 289, 217, 83, 89, 104, 255, 151, 174, 232, 188, 231, 261, 125],
            'value': '<menu id="file" value="File"><popup><menuitem value="New" onclick="CreateNewDoc()" /><menuitem value="Open" onclick="OpenDoc()" /><menuitem value="Close" onclick="CloseDoc()" /></popup></menu>'},
        {'id': [134, 238, 161, 132, 263, 183, 123, 50, 177, 34, 252, 29, 248, 222, 132, 253, 99, 63, 174, 124, 197, 214, 123, 232,
                256, 39, 282, 78, 67, 104, 134, 261, 184, 63, 175, 122, 3, 123, 54, 64, 128, 59, 6, 279, 214, 214, 248, 35, 34, 21],
            'value': '{"glossary":{"title":"example glossary","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"ID":"SGML","SortAs":"SGML","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}}'},
        {'id': [295, 247, 204, 203, 76, 164, 59, 195, 195, 98, 17, 48, 258, 59, 224, 272, 292, 184, 231, 258, 246, 49, 208, 108,
                185, 252, 1, 160, 44, 11, 3, 10, 275, 121, 264, 164, 236, 299, 140, 184, 258, 86, 159, 231, 46, 71, 179, 76, 207, 191],
            'value': 'cff2c05da1239ad2790317c53bdd9fd05b2ecd2ac5f954fa150e159af3ddd58a'},
        {'id': [227, 202, 254, 224, 292, 149, 97, 266, 178, 233, 194, 72, 62, 266, 49, 192, 26, 136, 77, 222, 20, 23, 44, 172, 63,
                89, 222, 209, 108, 150, 93, 193, 292, 45, 228, 248, 8, 249, 52, 70, 134, 14, 78, 104, 110, 144, 18, 292, 15, 24],
            'value': null}
    ]
    const rootHash = "a9c29f7d9c0e5ea17dd2b4672124bfee808e0284182be00744a214a8a9176fa0"

    describe('build tree and verify', function () {
        it('complete workflow test', function () {
            // Build tree with basic data and in debug mode
            let tree = new CSMT.CSMT(true)
            tree.insert(sampleData)
            assert.strictEqual(tree.root, rootHash)


            // Update tree with new data and verify that root hash is updated
            let newKey = [132, 185, 286, 218, 271, 179, 43, 172, 239, 182, 138, 1, 62, 70, 125, 140, 42, 179, 146, 1, 108, 145, 258,
                126, 232, 285, 165, 30, 299, 249, 66, 275, 163, 121, 214, 76, 186, 259, 158, 194, 164, 222, 255, 63, 260, 234, 294, 10, 86, 57]
            let newValue = "29346192640128739127391827402164"
            let newRootHash = "539860244d6eb17a37e95dc34db56a77f333faf04def130217987916d497d358"
            tree.add(newKey, newValue)
            assert.strictEqual(tree.root, newRootHash)


            // Delete new data and verify that original root hash still matches
            tree.delete(newKey)
            assert.strictEqual(tree.root, rootHash)


            // Create proofs of membership and non-membership
            let membershipProof = tree.createProof(sampleData[0].id)
            let nonMembershipProof = tree.createProof(newKey)
            assert.strictEqual(membershipProof.membership, true)
            assert.strictEqual(nonMembershipProof.membership, false)


            // Verify both proofs
            assert.strictEqual(tree.verifyProof(membershipProof), true)
            assert.strictEqual(tree.verifyProof(nonMembershipProof), true)
        })
    })

})