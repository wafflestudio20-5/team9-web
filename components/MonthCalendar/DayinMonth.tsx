import { useRouter } from 'next/router';
import React, { useRef, useState, useMemo } from 'react';

import styles from './DayinMonth.module.scss';

import {
    FullSchedule,
    LayerData,
    LayeredEvents,
} from '@customTypes/ScheduleTypes';
import getEventComponent from '@utils/getEventComponent';
import { useBoxSizeContext } from '@contexts/BoxSizeContext';

export default function DayinMonth({
    dateString,
    layerData,
}: {
    dateString: string;
    layerData: LayerData;
}) {
    const router = useRouter();
    const dayRef = useRef<HTMLDivElement>(null);
    const { boxHeight, boxWidth } = useBoxSizeContext();
    // const layers = useMemo(() => {
    //     return ?.across.length! + eventData?.within.length!;
    // }, [eventData]);

    const today = new Date();
    const dateToday = today.getDate();
    const monthToday = today.getMonth() + 1;
    const [year, month, date] = dateString.split('-').map(str => {
        return Number(str);
    });
    const dateHeader =
        date == 1 && (date != dateToday || month != monthToday)
            ? `${month}월 ${date}일`
            : `${date}`;
    const dateHeaderClass = () => {
        if (date == dateToday && month == monthToday) {
            return styles.today;
        }
        if (month == today.getMonth()) {
            return `${styles.currMonth} ${date === 1 && styles.textIncluded}`;
        }
        return `${styles.notCurrMonth} ${date === 1 && styles.textIncluded}`;
    };

    return (
        <div
            className={styles.wrapper}
            style={{ height: `${boxHeight}px`, width: `${boxWidth}px` }}
        >
            <div className={styles.buttonHolder}>
                <button
                    className={dateHeaderClass()}
                    onClick={() => {
                        router.push(`/day/${year}/${month}/${date}`);
                    }}
                >
                    <span>{dateHeader ? dateHeader : ''}</span>
                </button>
            </div>
            <div className={styles.eventsHolder}>
                {layerData[5]
                    ? Object.entries(layerData)
                          .slice(0, 5)
                          .map(([layer, data], index) => {
                              if (index === 4) {
                                  return (
                                      <div className={styles.seeMore}>{`${
                                          data.length - 4
                                      }개 더보기`}</div>
                                  );
                              }
                              return getEventComponent({
                                  dateString: dateString,
                                  data: data,
                                  index: index,
                              });
                          })
                    : Object.entries(layerData).map(([layer, data], index) => {
                          return getEventComponent({
                              dateString: dateString,
                              data: data,
                              index: index,
                          });
                      })}
            </div>
        </div>
    );
}
