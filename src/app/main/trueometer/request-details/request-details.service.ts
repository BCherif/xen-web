import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {Request} from '../../../data/models/request.model';

@Injectable({
    providedIn: 'root'
})
export class RequestDetailsService implements Resolve<any>
{
    routeParams: any;
    requestDetails: Request;
    onRequestDetailsChanged: BehaviorSubject<any>;
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
        this.onRequestDetailsChanged = new BehaviorSubject({});
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
                this.getRequestDetails()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get requestDetails
     *
     * @returns {Promise<any>}
     */
    getRequestDetails(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                .subscribe((response: any) => {
                    this.requestDetails = response['response'];
                    this.onRequestDetailsChanged.next(this.requestDetails);
                    resolve(response['response']);
                }, reject);
        });
    }
}
