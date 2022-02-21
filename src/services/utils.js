function hexToBin(n) {
    let bin = Number(`0x${n[0]}`).toString(2)

    for (let i = 1; i < n.length; i++) {
        bin += Number(`0x${n[i]}`).toString(2).padStart(4, "0")
    }

    return bin
}

exports.byteArrayToHex = function (array) {
    return Array.from(array, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

exports.keyToPath = function (key) {
    const bits = hexToBin(key)

    return bits.padStart(256, "0").split("").reverse().map(Number)
}

exports.getIndexOfLastNonZeroElement = function (array) {
    for (let i = array.length - 1; i >= 0; i--) {
        if (Number(`0x${array[i]}`) !== 0) {
            return i
        }
    }

    return -1
}

exports.getFirstCommonElements = function (array1, array2) {
    const minArray = array1.length < array2.length ? array1 : array2

    for (let i = 0; i < minArray.length; i++) {
        if (array1[i] !== array2[i]) {
            return minArray.slice(0, i)
        }
    }

    return minArray.slice()
}