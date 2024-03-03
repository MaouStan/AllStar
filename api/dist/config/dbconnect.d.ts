export declare const conn: import("mysql2/typings/mysql/lib/Connection").Connection;
export declare const queryAsync: (sql: string, values?: any) => Promise<unknown>;
export interface USER_TABLE {
    userId: number;
    username: string;
    password: string;
    image: string;
    note: string | null;
    type: 'admin' | 'user';
    joinDate: Date;
}
export interface IMAGE_TABLE {
    id: number;
    userId: number;
    imageURL: string;
    score: number;
    name: string;
    series_name: string;
    description: string | null;
}
export interface VOTE_TABLE {
    vid: number;
    userId: number;
    imageId: number;
    score: number;
    timestamp: string;
}
