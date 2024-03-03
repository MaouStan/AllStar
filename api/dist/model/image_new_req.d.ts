import { IMAGE_TABLE } from "../config/dbconnect";
import { Subtract } from "utility-types";
export type ImageNewRequest = Subtract<IMAGE_TABLE, {
    id: number;
    score: number;
}>;
