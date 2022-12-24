import React, {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import CalendarModal from '../components/Header/CalendarModal';
import SearchDetailsModal from '../components/Header/SearchDetailsModal';
import UserModal from '../components/Header/UserModal';

// Add modal name to MODAL_NAMES and add your modal component to MODAL_COMPONENTS
export const enum MODAL_NAMES {
    user = 'user',
    calendar = 'calendar',
    search = 'search',
}

const MODAL_COMPONENTS: { [key: string]: React.ElementType } = {
    [MODAL_NAMES.user]: UserModal,
    [MODAL_NAMES.calendar]: CalendarModal,
    [MODAL_NAMES.search]: SearchDetailsModal,
};

type ModalState = 'open' | 'closing' | 'closed';

interface Modals {
    [name: string]: { props: object | null; state: ModalState };
}

interface ModalSetterContextData {
    updateModalInfo(
        name: MODAL_NAMES,
        values: { props?: object | null; state: ModalState },
    ): void;
}

const ModalStateContext = createContext<Modals>({});
const ModalSetterContext = createContext<ModalSetterContextData>({
    updateModalInfo() {
        throw new Error('ModalContext not provided');
    },
});

const useModalStateContext = () => useContext(ModalStateContext);
const useModalSetterContext = () => useContext(ModalSetterContext);

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

export function ModalContainer() {
    const modals = useModalStateContext();

    return (
        <>
            {Object.keys(modals).map(name => {
                const modal = modals[name];
                if (modal.state !== 'closed') {
                    const Modal = MODAL_COMPONENTS[name];
                    return <Modal key={name} {...modal.props} />;
                }
            })}
        </>
    );
}

export function useModal() {
    const { updateModalInfo } = useModalSetterContext();
    const modals = useModalStateContext();
    let timeoutId: NodeJS.Timeout;

    // pass modal name and props you need in the modal (props is optional)
    // modal names list is at the top of this file(ModalContext.tsx)
    const openModal = (name: MODAL_NAMES, props?: object) => {
        updateModalInfo(name, { state: 'open', props: props ?? null });
    };

    // reset modal state in modalContext
    const closeModal = (name: MODAL_NAMES) => {
        updateModalInfo(name, { state: 'closing' });

        timeoutId = setTimeout(() => {
            updateModalInfo(name, { state: 'closed', props: null });
        }, 200);
    };

    const getState = useCallback(
        (name: MODAL_NAMES) => modals[name].state,
        [modals],
    );

    useEffect(() => {
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    return { getState, openModal, closeModal };
}
