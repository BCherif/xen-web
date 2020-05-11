import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {Request} from '../../../data/models/request.model';

@Injectable({
    providedIn: 'root'
})
export class RequestService implements Resolve<any>
{
    routeParams: any;
    request: Request;
    onRequestChanged: BehaviorSubject<any>;
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
        this.onRequestChanged = new BehaviorSubject({});
        this.serviceURL = environment.serviceUrl + '/requests';
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
                this.getRequest()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get request
     *
     * @returns {Promise<any>}
     */
    getRequest(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onRequestChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                    .subscribe((response: any) => {
                        this.request = response['response'];
                        this.onRequestChanged.next(this.request);
                        resolve(response['response']);
                    }, reject);
            }
        });
    }


    getById(id: number){
        return this._httpClient.get(this.serviceURL + '/' + id);
    }

    create(request: Request) {
        return this._httpClient.post(this.serviceURL, request);
    }
    update(request: Request) {
        return this._httpClient.put(this.serviceURL, request);
    }
}
