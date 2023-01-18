import React, {
    createContext,
    SetStateAction,
    useContext,
    Dispatch,
    PropsWithChildren,
    useMemo,
    useEffect,
} from 'react';
import useLocalStorage from '@hooks/useLocalStorage';

interface ThemeContextData {
    theme: string | undefined;
    setTheme: Dispatch<SetStateAction<string | undefined>>;
}

const ThemeContext = createContext<ThemeContextData>({
    theme: undefined,
    setTheme: () => {
        throw new Error('ThemeContext not provided');
    },
});

export const useThemeContext = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: PropsWithChildren) {
    const { stored: theme, setStored: setTheme } = useLocalStorage<string>(
        'theme',
        'light',
    );

    useEffect(() => {
        const d = document.documentElement;
        if (theme === 'light' || theme === 'dark' || theme === 'waffle') {
            d.setAttribute('data-theme', theme);
        }
    }, [theme]);

    const value = useMemo(() => ({ theme, setTheme }), [theme]);
    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}
