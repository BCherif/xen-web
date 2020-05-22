import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {Response} from '../../../data/models/response.model';
import {ResponseSaveEntity} from '../../../data/wrapper/response.save.entity.model';

@Injectable({
    providedIn: 'root'
})
export class ResponseService implements Resolve<any>
{
    routeParams: any;
    response: Response;
    onResponseChanged: BehaviorSubject<any>;
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
        this.onResponseChanged = new BehaviorSubject({});
        this.serviceURL = environment.serviceUrl + '/responses';
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
                this.getResponse()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get response
     *
     * @returns {Promise<any>}
     */
    getResponse(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onResponseChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                    .subscribe((response: any) => {
                        this.response = response['response'];
                        this.onResponseChanged.next(this.response);
                        resolve(response['response']);
                    }, reject);
            }
        });
    }


    getById(id: number){
        return this._httpClient.get(this.serviceURL + '/' + id);
    }

    create(responseSaveEntity: ResponseSaveEntity) {
        return this._httpClient.post(this.serviceURL, responseSaveEntity);
    }
}
