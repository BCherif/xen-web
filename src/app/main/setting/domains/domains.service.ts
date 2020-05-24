import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {Domain} from '../../../data/models/domain.model';
import {XensaUtils} from '../../../utils/xensa-utils';

@Injectable({
    providedIn: 'root'
})
export class DomainsService implements Resolve<any>
{
    domains: Domain[];
    onDomainsChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/domains';
        // Set the defaults
        this.onDomainsChanged = new BehaviorSubject({});
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
                this.getDomains()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get domains
     *
     * @returns {Promise<any>}
     */
    getDomains(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL,this.httpOptions)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.domains = res['response'];
                        this.onDomainsChanged.next(this.domains);
                        resolve(res['response']);
                    }
                }, reject);
        });
    }

    getAll() {
        return this._httpClient.get(this.serviceURL,this.httpOptions);
    }

    getById(id: number) {
        return this._httpClient.get(this.serviceURL + '/' + id,this.httpOptions);
    }

    create(domain: Domain) {
        return this._httpClient.post(this.serviceURL, domain,this.httpOptions);
    }
    update(domain: Domain) {
        return this._httpClient.put(this.serviceURL, domain,this.httpOptions);
    }
}
