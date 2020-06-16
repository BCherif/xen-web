export enum HttpProgressState {
    start,
    end
}

export interface IHttpState {
    url: string;
    state: HttpProgressState;
}