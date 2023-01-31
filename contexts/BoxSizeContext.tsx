import { useRouter } from 'next/router';
import React, {
    Dispatch,
    SetStateAction,
    useContext,
    createContext,
    PropsWithChildren,
    useState,
    useEffect,
    useMemo,
} from 'react';

import { getCalendarDates } from '@utils/calculateDate';
import useWindowSize from '@hooks/useWindowSize';

interface BoxSizeContextData {
    totalWidth: number;
    setTotalWidth: Dispatch<SetStateAction<number>>;
    totalHeight: number;
    setTotalHeight: Dispatch<SetStateAction<number>>;
    boxWidth: number;
    setBoxWidth: Dispatch<SetStateAction<number>>;
    boxHeight: number;
    setBoxHeight: Dispatch<SetStateAction<number>>;
    leftMargin: number;
    setLeftMargin: Dispatch<SetStateAction<number>>;
}

const BoxSizeContext = createContext<BoxSizeContextData>({
    totalWidth: 0,
    setTotalWidth() {
        throw new Error('BoxSizeContext not provided');
    },
    totalHeight: 0,
    setTotalHeight() {
        throw new Error('BoxSizeContext not provided');
    },
    boxWidth: 0,
    setBoxWidth() {
        throw new Error('BoxSizeContext not provided');
    },
    boxHeight: 0,
    setBoxHeight() {
        throw new Error('BoxSizeContext not provided');
    },
    leftMargin: 0,
    setLeftMargin() {
        throw new Error('BoxSizecontext Not provided');
    },
});

export const useBoxSizeContext = () => useContext(BoxSizeContext);

export default function BoxSizeProvider({ children }: PropsWithChildren) {
    const router = useRouter();
    const { year, month, date } = router.query;
    const [totalWidth, setTotalWidth] = useState(0);
    const [totalHeight, setTotalHeight] = useState(0);
    const [boxWidth, setBoxWidth] = useState(0);
    const [boxHeight, setBoxHeight] = useState(0);
    const [leftMargin, setLeftMargin] = useState(0);
    const windowSize = useWindowSize();

    const monthDates = useMemo(() => {
        return getCalendarDates({
            dateObj: year
                ? new Date(Number(year), Number(month) - 1, Number(date))
                : new Date(),
        });
    }, [year, month, date]);

    useEffect(() => {
        const datesCount = monthDates.length;
        setTotalHeight(windowSize.height - 66);
        const width = (windowSize.width - 88) / 7;
        console.log(width);
        const height = (windowSize.height - 66 - 12 * (datesCount / 7 - 1)) / 7;
        setBoxWidth(width);
        setBoxHeight(height);
        const longWidth = width * 7 + 12 * 6;
        const longHeight = height * 7 + 12 * (datesCount / 7 - 1);
        setLeftMargin(windowSize.width - longWidth - 1);
        setTotalWidth(longWidth + 1);
    }, [windowSize, monthDates]);

    const value = useMemo(
        () => ({
            totalHeight,
            totalWidth,
            boxWidth,
            boxHeight,
            leftMargin,
            setTotalWidth,
            setTotalHeight,
            setBoxHeight,
            setBoxWidth,
            setLeftMargin,
        }),
        [totalHeight, totalWidth, boxWidth, boxHeight, leftMargin],
    );

    return (
        <BoxSizeContext.Provider value={value}>
            {children}
        </BoxSizeContext.Provider>
    );
}
