import { USER_TABLE } from "../config/dbconnect";
import { Subtract } from "utility-types";
export type UserNewRequest = Subtract<USER_TABLE, {
    userId: number;
    joinDate: Date;
    type: string;
}>;