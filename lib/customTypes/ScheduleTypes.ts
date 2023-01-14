export interface Schedule {
    title: string;
    start_at: string;
    end_at: string;
    description: string; // will be changed to optional field
    protection_level?: number; // will be changed to required field
    show_content?: boolean; // will be changed to required field
    participants?: { pk: number }[];
}
