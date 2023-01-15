export interface Schedule {
    title: string;
    start_at: string;
    end_at: string;
    description?: string;
    protection_level: number;
    show_content: boolean;
    participants?: { pk: number }[];
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
