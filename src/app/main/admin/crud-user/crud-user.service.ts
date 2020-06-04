import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {User} from "../../../data/models/user.model";
import {XensaUtils} from '../../../utils/xensa-utils';

@Injectable({
    providedIn: 'root'
})
export class AdminCrudUserService implements Resolve<any>
{
    routeParams: any;
    user: User;
    readonly httpOptions: any;
    readonly serviceURL: string;
    onUserChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onUserChanged = new BehaviorSubject({});
        this.httpOptions = new XensaUtils().httpHeaders();
        this.serviceURL = environment.serviceUrl + '/users';
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getUser()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get user
     *
     * @returns {Promise<any>}
     */
    getUser(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if ( this.routeParams.id=== 'new' )
            {
                this.onUserChanged.next(false);
                resolve(false);
            }
            else
            {
                this._httpClient.get(this.serviceURL + '/' + this.routeParams.id +'/getUser', this.httpOptions)
                    .subscribe((response: any) => {
                        this.user = response['response'];
                        this.onUserChanged.next(this.user);
                        resolve(response['response']);
                    }, reject);
            }
        });
    }

    public save(user: User) {
        return this._httpClient.post(this.serviceURL, user, this.httpOptions);
    }

    public update(user: User) {
        return this._httpClient.put(this.serviceURL, user, this.httpOptions);
    }


}
