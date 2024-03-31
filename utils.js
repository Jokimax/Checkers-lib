function deepCopyArray(arr) {
    let copy = []
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            copy[i] = deepCopyArray(arr[i]);
        } else {
            copy[i] = arr[i];
        }
    }
    return copy
}

module.exports = { deepCopyArray }