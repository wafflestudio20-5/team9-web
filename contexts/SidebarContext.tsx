import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useState,
    useMemo,
} from 'react';

interface SidebarContextData {
    isOpen: boolean;
    openSidebar(): void;
    closeSidebar(): void;
    isClosing: boolean;
}

const SidebarContext = createContext<SidebarContextData>({
    isOpen: false,
    openSidebar() {
        throw new Error('SidebarContext not provided');
    },
    closeSidebar() {
        throw new Error('SidebarContext not provided');
    },
    isClosing: false,
});

export const useSidebarContext = () => useContext(SidebarContext);

function SidebarProvider({ children }: PropsWithChildren) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isClosing, setIsClosing] = useState<boolean>(false);

    const openSidebar = () => {
        setIsOpen(true);
    };
    const closeSidebar = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setIsOpen(false);
        }, 300);
    };

    const value = useMemo(
        () => ({ isOpen, isClosing, openSidebar, closeSidebar }),
        [isOpen, isClosing],
    );

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
}

export default SidebarProvider;
