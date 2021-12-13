export type Stringified<T extends object> = {
    [K in keyof T]: string;
}