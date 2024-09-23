declare module 'argon2-browser' {
    export enum ArgonType {
        Argon2d = 0,
        Argon2i = 1,
        Argon2id = 2
    }

    interface HashOptions {
        pass: string | Uint8Array;
        salt: string | Uint8Array;
        type?: ArgonType;
        timeCost?: number;
        memoryCost?: number;
        parallelism?: number;
        hashLen?: number;
    }

    interface VerifyOptions {
        pass: string | Uint8Array;
        encoded: string;
    }

    interface HashResult {
        hash: Uint8Array;
        encoded: string;
    }

    export function hash(options: HashOptions): Promise<HashResult>;
    export function verify(options: VerifyOptions): Promise<boolean>;
}