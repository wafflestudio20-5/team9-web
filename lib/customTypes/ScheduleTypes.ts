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
    description?: string;
    participants?: { pk: number }[];
    // repetition_type?: will be added later using cronjob
}

export interface FullSchedule extends Readonly<Omit<Schedule, 'participants'>> {
    id: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    participants?: Participant[];
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

export enum Repeat {
    none, // no repeat
    daily, // 매일, 며칠마다
    weekly, // 매주 무슨 요일, 몇 주마다 무슨 요일(커스텀)
    monthly, // 매월 며칠, 매월 몇 번째 무슨 요일, 몇 달마다 며칠, 몇 달마다 몇 번째 무슨 요일
    yearly, // 매년 몇월 며칠, 매년 몇월 몇 번째 무슨 요일, 몇 년마다 몇월 며칠, 몇 년마다 몇월 몇 번째 무슨 요일
}

export interface RecurrenceRule {
    repeat: Repeat;
    interval: number; // e.g. every '3' days
    month?: number; // e.g. on 'february' 3rd every year
    date?: number; // e.g. on '15'th of every month
    days?: number[]; // e.g. every 'monday' and 'tuesday'
    ordinal?: number; // e.g. '3'rd Wednesday of every month
    until?: string; // e.g. until 2023-02-08
    count?: number; // e.g. repeat '3' times
    never?: boolean;
    last?: boolean;
}

export interface Recurrence {
    isRecurring: boolean;
    cronjob: string;
    endDate: string;
    repeat: Repeat; // no need?
    text: string;
}

export type Period = Exclude<Repeat, Repeat.none>;

export const PeriodText: { [key: number]: string } = {
    [Repeat.daily]: '일',
    [Repeat.weekly]: '주',
    [Repeat.monthly]: '개월',
    [Repeat.yearly]: '년',
};
