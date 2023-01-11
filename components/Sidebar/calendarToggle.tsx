interface CalendarDataForToggle {
    pk: number;
    name: string;
}

export default function CalendarToggle({ name }: { name: string }) {
    return <div>{name}</div>;
}

export const mapCalendarToggle = (data: CalendarDataForToggle) => {
    return <CalendarToggle key={data.pk} name={data.name} />;
};
