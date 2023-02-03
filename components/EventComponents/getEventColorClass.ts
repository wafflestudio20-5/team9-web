export default function getEventColorClass(creatorPk: number) {
    switch (creatorPk % 3) {
        case 0:
            return 'chocolateEvent';
        case 1:
            return 'honeyEvent';
        case 2:
            return 'strawberryEvent';
        default:
            return 'chocolateEvent';
    }
}
