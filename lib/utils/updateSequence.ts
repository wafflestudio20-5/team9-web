interface UpdateSequenceProps<T> {
    sequence: T[] | null | undefined;
    getUniqueKey: (item: T) => string | number;
    itemToAdd: T;
    sorted?: boolean;
    maxLength?: number;
}

export default function updateSequence<T>({
    sequence,
    getUniqueKey,
    itemToAdd,
    sorted,
    maxLength,
}: UpdateSequenceProps<T>) {
    if (sequence) {
        const filtered = sequence.filter(item => {
            return getUniqueKey(item) !== getUniqueKey(itemToAdd);
        });
        if (sorted == true || sorted == undefined) {
            filtered.push(itemToAdd);
        } else {
            if (filtered.length === sequence.length) {
                filtered.push(itemToAdd);
            } else return sequence.slice(maxLength ? -maxLength : undefined);
        }
        return filtered.slice(maxLength ? -maxLength : undefined);
    } else return [itemToAdd];
}
