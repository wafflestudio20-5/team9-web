import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useMemo,
    useState,
} from 'react';

type ModalState = 'open' | 'closing' | 'closed';

interface Modal {
    name: string | null;
    props: object | null;
    state: ModalState;
}

interface ModalContextData {
    name: string | null;
    props: object | null;
    state: ModalState;
    setModalInfo: Dispatch<SetStateAction<Modal>>;
}

const ModalContext = createContext<ModalContextData>({
    name: null,
    props: null,
    state: 'open',
    setModalInfo() {
        throw new Error('ModalContext not provided');
    },
});

export const useModalContext = () => useContext(ModalContext);

export default function ModalProvider({ children }: PropsWithChildren) {
    const [modalInfo, setModalInfo] = useState<Modal>({
        name: null,
        props: null,
        state: 'open',
    });

    const value = useMemo(
        () => ({
            name: modalInfo.name,
            props: modalInfo.props,
            state: modalInfo.state,
            setModalInfo,
        }),
        [modalInfo],
    );

    return (
        <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
    );
}
