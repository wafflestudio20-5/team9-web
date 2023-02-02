// no longer in use
// left just in case
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
import { useSidebarContext } from './SidebarContext';

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
    clipBy: { horizontal: number; vertical: number };
    setClipBy: Dispatch<SetStateAction<BoxSizeContextData['clipBy']>>;
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
        throw new Error('BoxSizeContext Not provided');
    },
    clipBy: { horizontal: 0, vertical: 0 },
    setClipBy() {
        throw new Error('BoxSizeContext Not provided');
    },
});

export const useBoxSizeContext = () => useContext(BoxSizeContext);

export default function BoxSizeProvider({ children }: PropsWithChildren) {
    const { isOpen } = useSidebarContext();
    const router = useRouter();
    const { year, month, date } = router.query;
    const [totalWidth, setTotalWidth] = useState(0);
    const [totalHeight, setTotalHeight] = useState(0);
    const [boxWidth, setBoxWidth] = useState(0);
    const [boxHeight, setBoxHeight] = useState(0);
    const [leftMargin, setLeftMargin] = useState(0);
    const [clipBy, setClipBy] = useState({
        horizontal: 0,
        vertical: 0,
    });
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
        setTotalHeight(windowSize.height - 66 - clipBy.vertical);
        const sideBarWidth = isOpen ? 256 : 0;
        const width =
            (windowSize.width - 88 - clipBy.horizontal - sideBarWidth) / 7;
        const height =
            (windowSize.height -
                clipBy.vertical -
                66 -
                12 * (datesCount / 7 - 1)) /
            7;
        setBoxWidth(width);
        setBoxHeight(height);
        const longWidth = width * 7 + 12 * 6;
        const longHeight = height * 7 + 12 * (datesCount / 7 - 1);
        setLeftMargin(
            windowSize.width - clipBy.horizontal - sideBarWidth - longWidth - 1,
        );
        setTotalWidth(longWidth + 1);
    }, [windowSize, monthDates, clipBy, isOpen]);

    const value = useMemo(
        () => ({
            totalHeight,
            totalWidth,
            boxWidth,
            boxHeight,
            leftMargin,
            clipBy,
            setTotalWidth,
            setTotalHeight,
            setBoxHeight,
            setBoxWidth,
            setLeftMargin,
            setClipBy,
        }),
        [totalHeight, totalWidth, boxWidth, boxHeight, leftMargin, clipBy],
    );

    return (
        <BoxSizeContext.Provider value={value}>
            {children}
        </BoxSizeContext.Provider>
    );
}
