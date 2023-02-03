import { useEffect, useState, useCallback } from 'react';

export default function useInfiniteScroll(
    onObservation: (
        entry: IntersectionObserverEntry,
        observer: IntersectionObserver,
    ) => void,
    options?: IntersectionObserverInit,
) {
    const [target, setTarget] = useState<Element | null>(null);

    const handleIntersect = useCallback(
        (
            [entry]: IntersectionObserverEntry[],
            observer: IntersectionObserver,
        ) => {
            onObservation(entry, observer);
        },
        [onObservation],
    );

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersect, options);
        target && observer.observe(target);
        return () => {
            observer.disconnect();
        };
    }, [handleIntersect, target, options]);

    return [setTarget];
}
