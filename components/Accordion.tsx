import React, { useState } from 'react';

import styles from './Accordion.module.scss';

import AddIcon from '@images/add_icon.svg';
import CollapseIcon from '@images/collapse_icon.svg';
import ExpandIcon from '@images/expand_icon.svg';

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
                        <AddIcon className="icon" height="25px" />
                    </button>
                )}
                <button onClick={isOpen ? closeAccordion : openAccordion}>
                    {isOpen ? (
                        <CollapseIcon className="icon" height="25px" />
                    ) : (
                        <ExpandIcon className="icon" height="25px" />
                    )}
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
