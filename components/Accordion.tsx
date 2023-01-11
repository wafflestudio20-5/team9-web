import Image from 'next/image';
import expand_icon from '@images/expand_icon.svg';
import collapse_icon from '@images/collapse_icon.svg';
import add_icon from '@images/add_icon.svg';
import React, { useRef, useState, useEffect } from 'react';
import styles from './Accordion.module.scss';

interface AccordionProps {
    addAble?: boolean;
    title: string;
    sequence: any[];
    mapFunction: (value: any, index: number, array: any[]) => React.ReactNode;
}

export function Accordion({
    addAble,
    title,
    sequence,
    mapFunction,
}: AccordionProps) {
    // stages = ['initial', 'opening', 'opened', 'closing'];
    const [stage, setStage] = useState('initial');
    const [isOpen, setIsOpen] = useState(false);
    const bodyHolderRef = useRef<HTMLDivElement | null>(null);
    const openAccordion = () => {
        setStage('initial');
        setIsOpen(true);
        setStage('opening');
        setTimeout(() => {
            setStage('open');
        }, 1000);
    };
    const closeAccordion = () => {
        setStage('closing');
        setTimeout(() => {
            setStage('initial');
            setIsOpen(false);
        }, 300);
    };
    const getClassname = () => {
        switch (stage) {
            case 'initial':
                return `${styles.body} ${styles.initial}`;
            case 'opening':
                return `${styles.body} ${styles.opening}`;
            case 'open':
                return `${styles.body} ${styles.open}`;
            case 'closing':
                return `${styles.body} ${styles.closing}`;
            default:
                return `${styles.body} ${styles.closed}`;
        }
    };
    // useEffect(() => {
    //     setIsOpen(getOpenStatus());
    // }, [stage]);
    // const getOpenStatus = () => {
    //     switch (stage) {
    //         case 'initial':
    //             return true;
    //         case 'opening':
    //             return true;
    //         case 'open':
    //             return true;
    //         case 'closing':
    //             return false;
    //         default:
    //             return false;
    //     }
    // };
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <span>{title}</span>
                {addAble && (
                    <button>
                        <Image src={add_icon} alt="add" />
                    </button>
                )}
                <button onClick={isOpen ? closeAccordion : openAccordion}>
                    <Image
                        src={isOpen ? collapse_icon : expand_icon}
                        alt="toggle"
                    />
                </button>
            </div>
            {isOpen && (
                <div className={getClassname()}>
                    <div
                        style={{
                            height: bodyHolderRef.current?.clientHeight,
                        }}
                    >
                        <div className={styles.holder} ref={bodyHolderRef}>
                            {sequence.map(mapFunction)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
