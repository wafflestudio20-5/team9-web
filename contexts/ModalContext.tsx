import React, {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';

import { MODAL_NAMES } from '../components/ModalContainer';

type ModalState = 'open' | 'closing' | 'closed';

interface ModalValues {
    props: object | null;
    state: ModalState;
}

interface Modals {
    [name: string]: ModalValues;
}

interface ModalStateContextData {
    [name: string]: ModalValues;
}

interface ModalSetterContextData {
    updateModalInfo(
        name: MODAL_NAMES,
        values: { props?: object | null; state: ModalState },
    ): void;
}

const ModalStateContext = createContext<ModalStateContextData>({});
const ModalSetterContext = createContext<ModalSetterContextData>({
    updateModalInfo() {
        throw new Error('ModalContext not provided');
    },
});

export const useModalStateContext = () => useContext(ModalStateContext);
export const useModalSetterContext = () => useContext(ModalSetterContext);

const initModals: Modals = {
    [MODAL_NAMES.user]: { props: null, state: 'closed' },
    [MODAL_NAMES.calendar]: { props: null, state: 'closed' },
};

export default function ModalProvider({ children }: PropsWithChildren) {
    const [modals, setModals] = useState<Modals>(initModals);

    const updateModalInfo = useCallback(
        (
            name: MODAL_NAMES,
            values: { props?: object | null; state: ModalState },
        ) => {
            const currValues = modals[name];
            setModals(prev => ({
                ...prev,
                [name]: { ...currValues, ...values },
            }));
        },
        [modals],
    );

    const value = useMemo(() => modals, [modals]);

    const setter = useMemo(
        () => ({
            updateModalInfo,
        }),
        [updateModalInfo],
    );

    return (
        <ModalSetterContext.Provider value={setter}>
            <ModalStateContext.Provider value={value}>
                {children}
            </ModalStateContext.Provider>
        </ModalSetterContext.Provider>
    );
}
