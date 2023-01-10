import React, { useState, useEffect } from 'react';

export default function useLocalStorage<T>(key: string, defaultValue: T) {
    const [stored, setStored] = useState<T>();
    useEffect(() => {
        const attempt = localStorage.getItem(key);
        setStored(attempt ? JSON.parse(attempt) : defaultValue);
    }, [key, defaultValue]);
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(stored));
    }, [key, stored]);

    return { stored, setStored } as const;
}
