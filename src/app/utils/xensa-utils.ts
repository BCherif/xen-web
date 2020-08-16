import {Injectable} from '@angular/core';
import {User} from '../data/models/user.model';
import {AuthBody} from './auth-body';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class XensaUtils {

    constructor() {
    }

    httpHeaders() {
        const token: string = this.getToken();
        let headers = new HttpHeaders();

        if (token) { // token is present
            headers = headers.set('authorization', 'Bearer ' + token);
        }
        const httpOptions = {
            headers: headers
        };
        return httpOptions;
    }

    getToken(): string {
        let authBody: AuthBody = this.getAuthBody();
        if (authBody) {
            return authBody.token;
        } else {
            return null;
        }
    }

    getAppUser(): User {
        let authBody: AuthBody = this.getAuthBody();
        if (authBody) {
            return authBody.user;
        } else {
            return null;
        }
    }

    getAuthBody(): AuthBody {
        if (!localStorage.getItem('app-token')) {
            return null;
        } else {
            return JSON.parse(atob(localStorage.getItem('app-token')));
        }
    }


}