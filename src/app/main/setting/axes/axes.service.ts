import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {Axis} from '../../../data/models/axis.model';

@Injectable({
    providedIn: 'root'
})
export class AxesService implements Resolve<any>
{
    axes: Axis[];
    onAxiesChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/axis';
        // Set the defaults
        this.onAxiesChanged = new BehaviorSubject({});
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
                this.getAxies()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get axis
     *
     * @returns {Promise<any>}
     */
    getAxies(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.axes = res['response'];
                        this.onAxiesChanged.next(this.axes);
                        resolve(res['response']);
                    }
                }, reject);
        });
    }

    getAll() {
        return this._httpClient.get(this.serviceURL);
    }

    getById(id: number){
        return this._httpClient.get(this.serviceURL + '/' + id);
    }

    create(axis: Axis) {
        return this._httpClient.post(this.serviceURL, axis);
    }
    update(axis: Axis) {
        return this._httpClient.put(this.serviceURL, axis);
    }
}
