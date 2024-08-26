function isEqual(a: any, b: any): boolean {
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
        return a === b;
    }

    const aIsArray = Array.isArray(a);
    const bIsArray = Array.isArray(b);

    if (aIsArray !== bIsArray) {
        return false;
    }

    if (aIsArray && bIsArray) {
        if ((a as any[]).length !== (b as any[]).length) {
            return false;
        }
    } else {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);

        if (aKeys.length !== bKeys.length) {
            return false;
        }
    }

    for (const key in a) {
        if (Object.prototype.hasOwnProperty.call(a, key)) {
            if (!Object.prototype.hasOwnProperty.call(b, key)) {
                return false;
            }

            const aValue = (a as Record<string, unknown>)[key];
            const bValue = (b as Record<string, unknown>)[key];

            if (typeof aValue === 'object' && aValue !== null) {
                if (typeof bValue !== 'object' || bValue === null) {
                    return false;
                }
                if (!isEqual(aValue as object, bValue as object)) {
                    return false;
                }
            } else if (aValue !== bValue) {
                return false;
            }
        }
    }

    return true;
}

export default isEqual;
