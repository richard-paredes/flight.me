/**
 * Helper type that converts the values of properties in an object to string types
 */
export type Stringified<T extends object> = {
    [K in keyof T]: string;
}