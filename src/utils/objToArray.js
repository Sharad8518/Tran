export const objToArray = obj => {
    const keys = Object.keys(obj || {});
    const arr = keys.map(key => ({
        ...obj[key],
        key
    }));
    return arr;
};