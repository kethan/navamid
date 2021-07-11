declare module 'navamid' {
    type Promisable<T> = T | Promise<T>;
    export type Params = Record<string, any>;
    export type UnknownHandler = (uri: string) => void;
    export type NextHandler = (err?: string | Error) => Promisable<void>;
    export type ErrorHandler<T extends Req> = (err: string | Error | null, req: T, res: Res) => Promisable<void>;
    export type Middleware<T extends Req, P = Params> = (req: T & Req<P>, res: Res, next: NextHandler) => Promisable<void>;

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
        on<P = Params>(pattern: string, ...handlers: Middleware<T, P>[]): Router;
        run(uri?: string): Router;
        use(...handlers: Middleware<T>[]): Router;
        listen(uri?: string, onErr?: ErrorHandler<T>): Router;
        unlisten?: VoidFunction;
    }

    export default function (base?: string, on404?: UnknownHandler): Router;
}