import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {Law} from '../../../data/models/law.model';

@Injectable({
    providedIn: 'root'
})
export class LawService implements Resolve<any>
{
    routeParams: any;
    law: Law;
    onLawChanged: BehaviorSubject<any>;
    readonly httpOptions: any;
    readonly serviceURL: string;

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
        this.onLawChanged = new BehaviorSubject({});
        this.serviceURL = environment.serviceUrl + '/laws';
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
                this.getLaw()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get law
     *
     * @returns {Promise<any>}
     */
    getLaw(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onLawChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                    .subscribe((response: any) => {
                        this.law = response['response'];
                        this.onLawChanged.next(this.law);
                        resolve(response['response']);
                    }, reject);
            }
        });
    }

    getAll() {
        return this._httpClient.get(this.serviceURL);
    }

    getById(id: number){
        return this._httpClient.get(this.serviceURL + '/' + id);
    }

    create(law: Law) {
        return this._httpClient.post(this.serviceURL, law);
    }
    update(law: Law) {
        return this._httpClient.put(this.serviceURL, law);
    }
}
