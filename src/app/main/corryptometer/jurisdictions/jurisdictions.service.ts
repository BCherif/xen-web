import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {XensaUtils} from '../../../utils/xensa-utils';
import {Jurisdiction} from '../../../data/models/jurisdiction.model';

@Injectable({
    providedIn: 'root'
})
export class JurisdictionsService implements Resolve<any>
{
    jurisdictions: Jurisdiction[];
    onJurisdictionsChanged: BehaviorSubject<any>;
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
        this.httpOptions = new XensaUtils().httpHeaders();
        this.serviceURL = environment.serviceUrl + '/jurisdictions';
        // Set the defaults
        this.onJurisdictionsChanged = new BehaviorSubject({});
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
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getJurisdictions()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get jurisdictions
     *
     * @returns {Promise<any>}
     */
    getJurisdictions(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL,this.httpOptions)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.jurisdictions = res['response'];
                        this.onJurisdictionsChanged.next(this.jurisdictions);
                        resolve(res['response']);
                    }
                }, reject);
        });
    }

    getAll() {
        return this._httpClient.get(this.serviceURL,this.httpOptions);
    }

    getById(id: number){
        return this._httpClient.get(this.serviceURL + '/' + id,this.httpOptions);
    }

    create(jurisdiction: Jurisdiction) {
        return this._httpClient.post(this.serviceURL, jurisdiction,this.httpOptions);
    }
    update(jurisdiction: Jurisdiction) {
        return this._httpClient.put(this.serviceURL, jurisdiction,this.httpOptions);
    }
}
