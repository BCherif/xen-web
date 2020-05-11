import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {Interpellation} from '../../../data/models/interpellation.model';

@Injectable({
    providedIn: 'root'
})
export class InterpellationDetailsService implements Resolve<any>
{
    routeParams: any;
    interpellationDetails: Interpellation;
    onInterpellationDetailsChanged: BehaviorSubject<any>;
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
        this.onInterpellationDetailsChanged = new BehaviorSubject({});
        this.serviceURL = environment.serviceUrl + '/interpellations';
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
                this.getInterpellationDetails()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get InterpellationDetails
     *
     * @returns {Promise<any>}
     */
    getInterpellationDetails(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                .subscribe((response: any) => {
                    this.interpellationDetails = response['response'];
                    this.onInterpellationDetailsChanged.next(this.interpellationDetails);
                    resolve(response['response']);
                }, reject);
        });
    }
}
