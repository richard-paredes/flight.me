export type ApiResponse<T> = {
    data?: T;
    errors?: Array<{ message: string }>
}