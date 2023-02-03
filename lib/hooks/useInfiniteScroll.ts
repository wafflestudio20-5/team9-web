import { useEffect, useState, useCallback } from 'react';

export default function useInfiniteScroll(
    onIntersect: () => void,
    options?: IntersectionObserverInit,
) {
    const [target, setTarget] = useState<Element | null>(null);

    const handleIntersect = useCallback(
        ([entry]: IntersectionObserverEntry[]) => {
            if (entry.isIntersecting) {
                onIntersect();
            }
        },
        [onIntersect],
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
