import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useMemo,
    useState,
} from 'react';

interface Modal {
    name: string | null;
    props: object | null;
}

interface ModalStateContextData {
    name: string | null;
    props: object | null;
}

interface ModalSetterContextData {
    setModalState: Dispatch<SetStateAction<Modal>>;
}

const ModalStateContext = createContext<ModalStateContextData>({
    name: null,
    props: null,
});

const ModalSetterConext = createContext<ModalSetterContextData>({
    setModalState() {
        throw new Error('ModalContext not provided');
    },
});

export const useModalStateContext = () => useContext(ModalStateContext);
export const useModalSetterContext = () => useContext(ModalSetterConext);

export default function ModalProvider({ children }: PropsWithChildren) {
    const [modalState, setModalState] = useState<Modal>({
        name: null,
        props: null,
    });

    const stateValue = useMemo(() => modalState, [modalState]);
    const setterValue = useMemo(() => ({ setModalState }), []);

    return (
        <ModalSetterConext.Provider value={setterValue}>
            <ModalStateContext.Provider value={stateValue}>
                {children}
            </ModalStateContext.Provider>
        </ModalSetterConext.Provider>
    );
}
