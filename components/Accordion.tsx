import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react';

import styles from './Accordion.module.scss';

import add_icon from '@images/add_icon.svg';
import collapse_icon from '@images/collapse_icon.svg';
import expand_icon from '@images/expand_icon.svg';

interface AccordionProps {
    addAble?: boolean;
    title: string;
    sequence: any[];
    mapFunction: (value: any, index: number, array: any[]) => React.ReactNode;
    style?: { wrapper?: React.CSSProperties; title?: React.CSSProperties };
}

export function Accordion({
    addAble, // can users add items directly to the accordion? (default : false)
    title, // title of the accordion, always displayed.
    sequence, // sequence of data
    mapFunction, // function returning an ReactNode for each item(datum) in sequence(data)
    style, // optional CSS Properties for more custom styling
}: AccordionProps) {
    const [isOpen, setIsOpen] = useState(false); // is the accordion closed?
    const [isClosing, setIsClosing] = useState(false); // is the accordion closing? (for animation purposes)
    const openAccordion = () => {
        setIsOpen(true);
    };
    const closeAccordion = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setIsOpen(false);
        }, 500);
    };
    const getClassname = () => {
        if (isClosing) {
            return `${styles.body} ${styles.closing}`;
        }
        if (isOpen) {
            return `${styles.body} ${styles.open}`;
        }
        return `${styles.body}`;
    };

    return (
        <div className={styles.wrapper} style={style?.wrapper}>
            <div
                className={styles.header}
                onClick={isOpen ? closeAccordion : openAccordion}
            >
                <span style={style?.title}>{title}</span>
                {addAble && ( // false by default
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
            {
                <div
                    className={getClassname()}
                    style={{
                        height: isOpen ? 'auto' : 0,
                    }}
                >
                    <div className={styles.holder}>
                        {sequence.map(mapFunction)}
                    </div>
                </div>
            }
        </div>
    );
}
