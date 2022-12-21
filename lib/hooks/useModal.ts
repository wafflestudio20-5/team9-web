import { useModalSetterContext } from '../../contexts/ModalContext';

// use this to open and close modals
export function useModal() {
    const { setModalState } = useModalSetterContext();

    // pass modal name and props you need in the modal (props is optional)
    // modal names list is at ModalContainer.tsx
    const openModal = (name: string, props?: object) => {
        setModalState({ name: name, props: props ?? null });
    };

    // reset modal state in modalContext
    const closeModal = () => {
        setModalState({ name: null, props: null });
    };

    return { openModal, closeModal };
}
