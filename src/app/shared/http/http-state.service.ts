import {Injectable} from '@angular/core';
import {IHttpState} from './http-progress-state';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HttpStateService {

    public state = new BehaviorSubject<IHttpState>({} as IHttpState);

    constructor() { }
}