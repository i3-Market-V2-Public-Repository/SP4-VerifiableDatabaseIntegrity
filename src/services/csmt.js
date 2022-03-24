const HASH = require("crypto-js/sha256");
const CryptoJS = require("crypto-js");
const {getFirstCommonElements, getIndexOfLastNonZeroElement, byteArrayToHex, keyToPath} = require("./utils");
const {Proof, EntryResponse} = require("../models/models");

class CSMT {
    root;
    nodes;
    zeroNode;
    entryMark;

    _debug = false;

    constructor(debug) {
        this.zeroNode = "0"
        this.entryMark = "1"
        this.nodes = new Map()
        this.root = this.zeroNode
        this._debug = !!debug
    }

    print() {
        console.log(Array.from(this.nodes).map((d, e) => {return {hash: this._hash(d[0]), value: d[1].length === 3 ? d[1] : {left: this._hash(d[1][0]), right: this._hash(d[1][1])}}}))
    }

    insert(data) {
        this._validate(data)
        data.forEach(e => this.add(e.id, e.value))
        if (this._debug) {
            this.print()
        }
    }

    add(key, value) {
        const hexKey = byteArrayToHex(key)
        const hashedValue = this._hash(value)
        const path = keyToPath(hexKey)

        const { entry, matchingEntry, sideNodes } = this._retrieveEntry(hexKey)

        if (entry[1] !== undefined) {
            throw new Error(`Key "${hexKey}" already exists`)
        }

        const node = matchingEntry ? this._hash(matchingEntry.join()) : this.zeroNode

        if (sideNodes.length > 0) {
            this._deleteOldNodes(node, path, sideNodes)
        }

        if (matchingEntry) {
            const matchingPath = keyToPath(matchingEntry[0])

            for (let i = sideNodes.length; matchingPath[i] === path[i]; i++) {
                sideNodes.push(this.zeroNode)
            }

            sideNodes.push(node)
        }

        const newNode = this._hash([hexKey, hashedValue, this.entryMark].join())
        this.nodes.set(newNode, [hexKey, hashedValue, this.entryMark])
        this.root = this._addNewNodes(newNode, path, sideNodes)
    }

    get(key) {
        const hexKey = byteArrayToHex(key)
        const { entry } = this._retrieveEntry(hexKey)

        return entry[1]
    }

    delete(key) {
        const hexKey = byteArrayToHex(key)
        const { entry, sideNodes } = this._retrieveEntry(hexKey)

        if (entry[1] === undefined) {
            throw new Error(`Key "${hexKey}" does not exist`)
        }

        const path = keyToPath(hexKey)

        const node = this._hash(entry.join())
        this.nodes.delete(node)

        this.root = this.zeroNode

        if (sideNodes.length > 0) {
            this._deleteOldNodes(node, path, sideNodes)

            if (!this._isLeaf(sideNodes[sideNodes.length - 1])) {
                this.root = this._addNewNodes(this.zeroNode, path, sideNodes)
            } else {
                const firstSideNode = sideNodes.pop()
                const i = getIndexOfLastNonZeroElement(sideNodes)

                this.root = this._addNewNodes(firstSideNode, path, sideNodes, i)
            }
        }
    }

    createProof(key) {
        const hexKey = byteArrayToHex(key)

        const { entry, matchingEntry, sideNodes } = this._retrieveEntry(hexKey)

        return new Proof(
            entry,
            matchingEntry,
            sideNodes,
            this.root,
            !!entry[1])
    }

    verifyProof(proof) {
        if (!proof.matchingEntry) {
            const path = keyToPath(proof.entry[0])
            const node = proof.entry[1] !== undefined ? this._hash(proof.entry.join()) : this.zeroNode
            const root = this._calculateRoot(node, path, proof.sideNodes)

            return root === proof.root
        } else {
            const matchingPath = keyToPath(proof.matchingEntry[0])
            const node = this._hash(proof.matchingEntry.join())
            const root = this._calculateRoot(node, matchingPath, proof.sideNodes)

            if (root === proof.root) {
                const path = keyToPath(proof.entry[0])
                const firstMatchingBits = getFirstCommonElements(path, matchingPath)
                return proof.sideNodes.length <= firstMatchingBits.length
            }

            return false
        }
    }

    _addNewNodes(node, path, sideNodes) {
        for (let i = sideNodes.length - 1; i >= 0; i--) {
            const childNodes = path[i] ? [sideNodes[i], node] : [node, sideNodes[i]]
            node = this._hash(childNodes.join())

            this.nodes.set(node, childNodes)
        }

        return node
    }

    _deleteOldNodes(node, path, sideNodes) {
        for (let i = sideNodes.length - 1; i >= 0; i--) {
            const childNodes = path[i] ? [sideNodes[i], node] : [node, sideNodes[i]]
            node = this._hash(childNodes.join())

            this.nodes.delete(node)
        }
    }

    _retrieveEntry(key) {
        const path = keyToPath(key)
        const sideNodes = []

        for (let i = 0, node = this.root; node !== this.zeroNode; i++) {
            const childNodes = this.nodes.get(node)
            const direction = path[i]

            if (childNodes[2]) {
                if (childNodes[0] === key) {
                    return new EntryResponse(childNodes, null, sideNodes)
                }
                return new EntryResponse([key], childNodes, sideNodes)
            }

            node = childNodes[direction]
            sideNodes.push(childNodes[Number(!direction)])
        }

        return new EntryResponse( [key], null, sideNodes)
    }

    _calculateRoot(node, path, sideNodes) {
        for (let i = sideNodes.length - 1; i >= 0; i--) {
            const childNodes = path[i] ? [sideNodes[i], node] : [node, sideNodes[i]]
            node = this._hash(childNodes.join())
        }

        return node
    }

    _hash(data) {
        return HASH(data).toString(CryptoJS.enc.Hex)
    }

    _isLeaf(node) {
        const childNodes = this.nodes.get(node)

        return !!(childNodes && childNodes[2])
    }

    _validate(array) {
        if (!Array.isArray(array)) {
            throw new TypeError("Parameter must be an array")
        }
        array.forEach(e => {
            if (!e.hasOwnProperty("id") || !e.hasOwnProperty("value")) {
                throw new TypeError("Parameter elements must have 'id' and 'value' properties")
            }
            if (!Array.isArray(e.id)) {
                throw new TypeError("Element 'id' must be an array")
            }
        })
    }
}

exports.CSMT = CSMT