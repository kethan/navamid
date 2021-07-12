declare module 'navamid' {
    type Promisable<T> = T | Promise<T>;
    export type Params = Record<string, any>;
    export type UnknownHandler<T extends Req> = (uri: string, req?: T, res?: Res) => void;
    export type NextHandler = (err?: string | Error) => Promisable<void>;
    export type ErrorHandler<T extends Req> = (err: string | Error | null, req: T, res: Res) => Promisable<void>;
    export type Middleware<T extends Req = Req> = (req: T, res: Res, next: NextHandler) => Promisable<void>;
    export type OnMiddleware<P = Params, T extends Req = Req<P>> = (req: T & Req<P>, res: Res, next: NextHandler) => Promisable<void>;

    export interface Req<P = Params> {
        url: string;
        params: P;
    }

    export interface Res {
        redirect: (uri: string, replace?: boolean) => void;
    }

    export interface Router<T extends Req = Req> {
        format(uri: string): string | false;
        route(uri: string, replace?: boolean): void;
        on<P = Params, T extends Req = Req<P>>(pattern: string, ...handlers: OnMiddleware<P, T>[]): Router;
        run(uri?: string): Router;
        use(...handlers: Middleware<T>[]): Router;
        listen(uri?: string): Router;
        unlisten?: VoidFunction;
    }

    export default function <T extends Req = Req>(base?: string, on404?: UnknownHandler<T>, onErr?: ErrorHandler<T>): Router<T>;
}