import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {XensaUtils} from '../utils/xensa-utils';

@Injectable({
    providedIn: 'root'
})
export class PrivilegeService {

    readonly serviceURL: string;
    readonly httpOptions: any;

    constructor(private http: HttpClient) {
        let xensaUtils = new XensaUtils();
        this.serviceURL = environment.serviceUrl + '/privileges';
        this.httpOptions = xensaUtils.httpHeaders();
    }

    findAll(): Observable<any> {
        return this.http.get(this.serviceURL, this.httpOptions)
    }



}
