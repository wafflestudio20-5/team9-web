import Image from 'next/image';
import { useState, useMemo } from 'react';
import { useDateContext } from '../contexts/DateContext';
import before_icon from '../public/images/before_icon.svg';
import next_icon from '../public/images/next_icon.svg';

export default function MiniCalendar() {
    const { yearNow, monthNow, dateNow, dayNow } = useDateContext();
    const [yearToShow, setYearToShow] = useState(yearNow);
    const [monthToShow, setMonthToShow] = useState(monthNow);
    const monthData = useMemo(() => {}, [yearToShow, monthToShow]);
    return (
        <div>
            <div>{`${yearNow}년 ${monthNow}월`}</div>
            <div>
                <button
                    onClick={() => {
                        if (monthToShow == 1) {
                            setMonthToShow(12);
                            setYearToShow(yearToShow - 1);
                        } else {
                            setMonthToShow(monthToShow - 1);
                        }
                    }}
                >
                    <Image
                        src={before_icon}
                        alt="이전"
                        width={24}
                        height={24}
                    />
                </button>
                <button
                    onClick={() => {
                        if (monthToShow == 12) {
                            setYearToShow(yearToShow + 1);
                            setMonthToShow(1);
                        } else {
                            setMonthToShow(monthToShow + 1);
                        }
                    }}
                >
                    <Image src={next_icon} alt="이후" width={24} height={24} />
                </button>
            </div>
            <div></div>
        </div>
    );
}
