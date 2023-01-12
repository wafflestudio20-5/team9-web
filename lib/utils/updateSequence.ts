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
            // Step1. get a copy of the sequence, excluding the item to add should it have been included previously
            return getUniqueKey(item) !== getUniqueKey(itemToAdd);
        });
        // Step2-1. (If sorted == true) simply add the item to the end of the sequence.
        //          this updates the position of the item if it was included previously
        //          default value of sorted is true, so sorted == undefined also results in same behavior
        if (sorted == true || sorted == undefined) {
            filtered.push(itemToAdd);
        } else {
            // Step2-2. (If sorted == false) only push item to the end if it wasn't already included
            if (filtered.length === sequence.length) {
                // check if item was already included by comparing the length of the original sequence and
                // the filtered sequence where the item is purposefully excluded
                filtered.push(itemToAdd);
            } else {
                // if item was already included and sorted == false, simply return the original sequence,
                // sliced to match the maximum length had maxLength been provided
                return sequence.slice(maxLength ? -maxLength : undefined);
            }
        }
        // in the remaining cases (where filtered !== sequence), return the sliced copy of filtered
        return filtered.slice(maxLength ? -maxLength : undefined);
    } else return [itemToAdd];
}
