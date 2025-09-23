const Functions = {
    exponentFromValue(value) {
        const exp = Math.log2(value);

        return Number.isInteger(exp) ? exp : value;
    },
    powersOf2(value) {
        return Math.pow(2, value);
    },
};

export const { exponentFromValue, powersOf2 } = Functions;
