class EntryResponse {
    entry;
    matchingEntry;
    sideNodes;

    constructor(entry, matchingEntry, sideNodes) {
        this.entry = entry
        this.matchingEntry = matchingEntry
        this.sideNodes = sideNodes
    }
}

class Proof extends EntryResponse {
    root;
    membership;

    constructor(entry, matchingEntry, sideNodes, root, membership) {
        super(entry, matchingEntry, sideNodes)
        this.root = root
        this.membership = membership
    }
}

exports.EntryResponse = EntryResponse
exports.Proof = Proof
