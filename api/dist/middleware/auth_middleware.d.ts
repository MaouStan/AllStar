/// <reference types="qs" />
/// <reference types="express" />
export declare const jwtAuthen: {
    (req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: import("express").Response<any, Record<string, any>>, next: import("express").NextFunction): Promise<void>;
    unless: typeof import("express-unless").unless;
};
