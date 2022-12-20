export interface Day {
    year: number;
    month: number;
    date: number;
    events: any; // to be specified
}

export default function DayinMonth({ data }: { data: Day }) {
    return <div>{data.date}</div>;
}
