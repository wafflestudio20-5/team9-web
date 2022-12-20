import Image from 'next/image';
import Sidebar from '../components/Sidebar';
import { useSidebarContext } from '../contexts/SidebarContext';
import styles from './month.module.scss';
import expand_icon from '../public/images/expand_icon.svg';
import hide_icon from '../public/images/hide_icon.svg';
import { useState } from 'react';

export default function MonthPage() {
    const { isOpen } = useSidebarContext();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    return (
        <div className={styles.wrapper}>
            {isOpen && <Sidebar />}
            <div>
                <div className={styles.UpperHalf}>
                    <div className={styles.left}>
                        <div>GMT+09</div>
                        <button onClick={() => setIsExpanded(!isExpanded)}>
                            {isExpanded ? (
                                <Image src={hide_icon} alt="hide" height={24} />
                            ) : (
                                <Image
                                    src={expand_icon}
                                    alt="expand"
                                    height={24}
                                />
                            )}
                        </button>
                    </div>
                    <div>Upper Right</div>
                </div>
                <div>Lower Half</div>
            </div>
        </div>
    );
}
