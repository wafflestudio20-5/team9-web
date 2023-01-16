import { useState, useEffect } from 'react';

export default function useLocalStorage<T>(key: string, defaultValue: T) {
    const [stored, setStored] = useState<T>();
    useEffect(() => {
        const attempt = localStorage.getItem(key);
        setStored(
            attempt && attempt !== 'undefined'
                ? JSON.parse(attempt)
                : defaultValue,
        );
    }, [key, defaultValue]);
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(stored));
    }, [key, stored]);

    // if localStorage key-value pair for given key doesn't exist yet,
    // 1st UseEffect: setStored(defaultValue) -> stored changed -> 2nd UseEffect: create key-value pair
    // if localStorage key-value pair for given key already exists,
    // 2nd UseEffect updates the value whenever 'stored' changes.
    // key must be unique to avoid value overlap

    return { stored, setStored } as const;
}
