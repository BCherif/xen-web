import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {Cutting} from "../../../data/models/cutting.model";
import {XensaUtils} from '../../../utils/xensa-utils';

@Injectable({
    providedIn: 'root'
})
export class CuttingsService implements Resolve<any>
{
    cuttings: Cutting[];
    onCuttingsChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/cuttings';
        // Set the defaults
        this.onCuttingsChanged = new BehaviorSubject({});
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
                this.getCuttings()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get cutting
     *
     * @returns {Promise<any>}
     */
    getCuttings(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL,this.httpOptions)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.cuttings = res['response'];
                        this.onCuttingsChanged.next(this.cuttings);
                        resolve(res['response']);
                    } else {
                        // console.log('error : ' + res['status']);
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

    create(cutting: Cutting) {
        return this._httpClient.post(this.serviceURL, cutting,this.httpOptions);
    }
    update(cutting: Cutting) {
        return this._httpClient.put(this.serviceURL, cutting,this.httpOptions);
    }
}
