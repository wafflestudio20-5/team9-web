// the same as UserDataForSearch interface in `UserTypes.ts`
export interface Participant {
    pk: number;
    username: string;
    email: string;
}

export interface Schedule {
    readonly id?: number;
    title: string;
    start_at: string;
    end_at: string;
    protection_level: number;
    show_content: boolean;
    description: string | null;
    participants: { pk: number }[];
    is_recurring: boolean;
    cron_expr?: string | null;
    recurring_end_at?: string | null;
    readonly recurring_schedule_group?: number;
}

export interface FullSchedule extends Readonly<Omit<Schedule, 'participants'>> {
    id: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    participants: Participant[];
    recurring_schedule_group: number;
    layer?: number;
}

export enum ProtectionLevel {
    pulbic = 1,
    follwer,
    private,
}

export const ProtectionLevelText: { [key: number]: string } = {
    [ProtectionLevel.pulbic]: '전체공개',
    [ProtectionLevel.follwer]: '친구공개',
    [ProtectionLevel.private]: '비공개',
};

export interface Recurrence {
    isRecurring: boolean;
    cronExpr?: string | null;
    endDate?: string | null;
}

export enum Repeat {
    none,
    daily,
    weekly,
    monthly,
    yearly,
}

export type Period = Exclude<Repeat, Repeat.none>;

export const PeriodText: { [key: number]: string } = {
    [Repeat.daily]: '일',
    [Repeat.weekly]: '주',
    [Repeat.monthly]: '개월',
    [Repeat.yearly]: '년',
};

export type DateOption = 'specific' | 'last' | 'ordinal';

export type StopCondition = 'never' | 'until' | 'count';

export interface RecurrenceRule {
    repeat: Repeat;
    interval: number;
    dateOption?: DateOption;
    days?: number[];
    ordinal?: number;
    stopCondition: StopCondition;
    until?: Date;
    count?: number;
}

export interface LayeredEvents {
    date: Date;
    events: { across: FullSchedule[]; within: FullSchedule[] };
}
