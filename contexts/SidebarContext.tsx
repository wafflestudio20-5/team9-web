import {
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
}

const SidebarContext = createContext<SidebarContextData>({
    isOpen: false,
    openSidebar() {
        throw new Error('SidebarContext not provided');
    },
    closeSidebar() {
        throw new Error('SidebarContext not provided');
    },
});

export const useSidebarContext = () => useContext(SidebarContext);

function SidebarProvider({ children }: PropsWithChildren) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isOpening, setIsOpening] = useState<boolean>(false);
    const [isClosing, setIsClosing] = useState<boolean>(false);

    const openSidebar = () => {
        // TO BE MODIFIED: function for opening sidebar
        // gradual animatino for sidebar & main page width
        // + change "Create" button style
        setIsOpen(true);
    };
    const closeSidebar = () => {
        // TO BE MODIFIED: function for opening sidebar
        // gradual animatino for sidebar & main page width
        // + change "Create" button style
        setIsOpen(false);
    };

    const value = useMemo(
        () => ({ isOpen, openSidebar, closeSidebar }),
        [isOpen],
    );

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
}

export default SidebarProvider;
