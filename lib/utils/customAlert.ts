import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 2000,
});

export const successToast = (message: string) =>
    Toast.fire({
        icon: 'success',
        title: message,
    });

export const errorToast = (message: string) =>
    Toast.fire({
        icon: 'error',
        title: message,
    });

export const warningModal = (warningContent: {
    title: string;
    text: string;
    confirmButtonText?: string;
}) =>
    Swal.fire({
        title: warningContent.title,
        text: warningContent.text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: warningContent.confirmButtonText ?? '확인',
        // confirmButtonColor: '#color', // to be modified
        cancelButtonText: '취소',
        // cancelButtonColor: '#color', // to be modified
    });

export const radioRecurringModal = (title: string) =>
    Swal.fire({
        title: `반복 일정 ${title}`,
        input: 'radio',
        inputOptions: { only: '이 일정', all: '연관된 모든 일정' },
        inputValidator: value => {
            if (value) return null;
            return `${title} 옵션을 선택해주세요.`;
        },
        showCancelButton: true,
        confirmButtonText: `${title}`,
        cancelButtonText: '취소',
    });
