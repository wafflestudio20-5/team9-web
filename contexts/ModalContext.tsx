import React, {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import MiniCalendarModal from '@components/Header/MiniCalendarModal';
import SearchDetailsModal from '@components/Header/SearchDetailsModal';
import UserModal from '@components/Header/UserModal';
import RegisterModal from '@components/RegisterModal';
import ScheduleEditorModal from '@components/ScheduleModal/ScheduleEditorModal';
import ScheduleViewModal from '@components/ScheduleModal/ScheduleViewModal';

// Add modal name to MODAL_NAMES (to prevent hard coding)
// key and value should be the same
export enum MODAL_NAMES {
    user = 'user',
    miniCalendar = 'miniCalendar',
    searchDetails = 'searchDetails',
    register = 'register',
    scheduleView = 'scheduleView',
    scheduleEditor = 'scheduleEditor',
}

// Add your modal component to MODAL_COMPONENTS
const MODAL_COMPONENTS: { [key: string]: React.ElementType } = {
    [MODAL_NAMES.user]: UserModal,
    [MODAL_NAMES.miniCalendar]: MiniCalendarModal,
    [MODAL_NAMES.searchDetails]: SearchDetailsModal,
    [MODAL_NAMES.register]: RegisterModal,
    [MODAL_NAMES.scheduleView]: ScheduleViewModal,
    [MODAL_NAMES.scheduleEditor]: ScheduleEditorModal,
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

const getInitModals = () => {
    const initModals: Modals = {};
    Object.values(MODAL_NAMES).forEach(modalName => {
        initModals[modalName] = { props: null, state: 'closed' };
    });
    return initModals;
};

export default function ModalProvider({ children }: PropsWithChildren) {
    const [modals, setModals] = useState<Modals>(getInitModals());

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
