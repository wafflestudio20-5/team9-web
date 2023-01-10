export default function CalendarToggle({ name }: { name: string }) {
    return <div>{name}</div>;
}

export const mapCalendarToggle = (name: string) => {
    return <CalendarToggle name={name} />;
};
