import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {Organ} from "../../../data/models/organ.model";

@Injectable({
    providedIn: 'root'
})
export class OrgansService implements Resolve<any>
{
    organs: Organ[];
    onOrgansChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/organs';
        // Set the defaults
        this.onOrgansChanged = new BehaviorSubject({});
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
                this.getOrgans()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get organ
     *
     * @returns {Promise<any>}
     */
    getOrgans(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.organs = res['response'];
                        this.onOrgansChanged.next(this.organs);
                        resolve(res['response']);
                    } else {
                        // console.log('error : ' + res['status']);
                    }
                }, reject);
        });
    }

    getAll(){
        return this._httpClient.get(this.serviceURL);
    }

    getById(id: number){
        return this._httpClient.get(this.serviceURL + '/' + id);
    }

    create(organ: Organ) {
        return this._httpClient.post(this.serviceURL, organ);
    }
    update(organ: Organ) {
        return this._httpClient.put(this.serviceURL, organ);
    }
}
