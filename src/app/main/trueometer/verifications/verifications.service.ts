import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {Verification} from "../../../data/models/verification.model";

@Injectable({
    providedIn: 'root'
})
export class VerificationsService implements Resolve<any>
{
    verifications: Verification[];
    onVerificationsChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/verifications';
        // Set the defaults
        this.onVerificationsChanged = new BehaviorSubject({});
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
                this.getVerifications()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get verifications
     *
     * @returns {Promise<any>}
     */
    getVerifications(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.verifications = res['response'];
                        this.onVerificationsChanged.next(this.verifications);
                        resolve(res['response']);
                    }
                }, reject);
        });
    }

    getById(id: number){
        return this._httpClient.get(this.serviceURL + '/' + id);
    }

    create(verification: Verification) {
        return this._httpClient.post(this.serviceURL, verification);
    }
    update(verification: Verification) {
        return this._httpClient.put(this.serviceURL, verification);
    }
}
