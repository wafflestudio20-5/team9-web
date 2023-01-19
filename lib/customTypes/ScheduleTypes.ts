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

export enum RecurType {
    none,
    day,
    week,
    ordinal,
    month,
    year,
    custom,
}

export interface Recurrence {
    isRecurrent: boolean;
    cronjob: string;
    endDate: string;
    type: RecurType;
    content: string;
}
