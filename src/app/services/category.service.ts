import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {XensaUtils} from '../utils/xensa-utils';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    readonly httpOptions: any;
    readonly serviceURL: string;

    constructor(private _httpClient: HttpClient) {
        let xensaUtils = new XensaUtils();
        this.httpOptions = xensaUtils.httpHeaders();
        this.serviceURL = environment.serviceUrl + '/categories';
    }

    findAll() {
        return this._httpClient.get(this.serviceURL, this.httpOptions);
    }


}
