import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {Elected} from "../../../data/models/elected.model";
import {XensaUtils} from '../../../utils/xensa-utils';

@Injectable({
    providedIn: 'root'
})
export class ElectedsService implements Resolve<any>
{
    electeds: Elected[];
    onElectedsChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/electeds';
        // Set the defaults
        this.onElectedsChanged = new BehaviorSubject({});
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
                this.getElecteds()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get elected
     *
     * @returns {Promise<any>}
     */
    getElecteds(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL,this.httpOptions)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.electeds = res['response'];
                        this.onElectedsChanged.next(this.electeds);
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

    create(elected: Elected) {
        return this._httpClient.post(this.serviceURL, elected,this.httpOptions);
    }
    update(elected: Elected) {
        return this._httpClient.put(this.serviceURL, elected,this.httpOptions);
    }
}
