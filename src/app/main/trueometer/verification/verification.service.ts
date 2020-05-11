import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {Verification} from "../../../data/models/verification.model";
import {environment} from "../../../../environments/environment";
import {VerificationSaveEntity} from '../../../data/wrapper/verification.save.entity.model';

@Injectable({
    providedIn: 'root'
})
export class VerificationService implements Resolve<any>
{
    routeParams: any;
    verification: Verification;
    onVerificationChanged: BehaviorSubject<any>;
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
        this.onVerificationChanged = new BehaviorSubject({});
        this.serviceURL = environment.serviceUrl + '/verifications';
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
                this.getVerification()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get verification
     *
     * @returns {Promise<any>}
     */
    getVerification(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onVerificationChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                    .subscribe((response: any) => {
                        this.verification = response['response'];
                        this.onVerificationChanged.next(this.verification);
                        resolve(response['response']);
                    }, reject);
            }
        });
    }


    getById(id: number){
        return this._httpClient.get(this.serviceURL + '/' + id);
    }

    create(verificationSaveEntity: VerificationSaveEntity) {
        return this._httpClient.post(this.serviceURL, verificationSaveEntity);
    }
    update(verificationSaveEntity: VerificationSaveEntity) {
        return this._httpClient.put(this.serviceURL, verificationSaveEntity);
    }
}
