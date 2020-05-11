import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {Interpellation} from '../../../data/models/interpellation.model';

@Injectable({
    providedIn: 'root'
})
export class InterpellationService implements Resolve<any>
{
    routeParams: any;
    interpellation: Interpellation;
    onInterpellationChanged: BehaviorSubject<any>;
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
        this.onInterpellationChanged = new BehaviorSubject({});
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
                this.getInterpellation()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get Interpellation
     *
     * @returns {Promise<any>}
     */
    getInterpellation(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onInterpellationChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                    .subscribe((response: any) => {
                        this.interpellation = response['response'];
                        this.onInterpellationChanged.next(this.interpellation);
                        resolve(response['response']);
                    }, reject);
            }
        });
    }


    getById(id: number){
        return this._httpClient.get(this.serviceURL + '/' + id);
    }

    create(interpellation: Interpellation) {
        return this._httpClient.post(this.serviceURL, interpellation);
    }
    update(interpellation: Interpellation) {
        return this._httpClient.put(this.serviceURL, interpellation);
    }
}
