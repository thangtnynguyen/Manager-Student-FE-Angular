export interface ApiResult<T> {
    status: boolean | null;
    message: string | '';
    data: T | null;
}
