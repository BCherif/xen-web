import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Locality} from '../../../data/models/locality.model';
import {XensaUtils} from '../../../utils/xensa-utils';

@Injectable({
    providedIn: 'root'
})
export class LocalitiesService implements Resolve<any> {
    localities: Locality[];
    onLocalitiesChanged: BehaviorSubject<any>;
    readonly httpOptions: any;
    readonly serviceURL: string;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        this.httpOptions = new XensaUtils().httpHeaders();
        this.serviceURL = environment.serviceUrl + '/localities';
        // Set the defaults
        this.onLocalitiesChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getLocalities()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get localities
     *
     * @returns {Promise<any>}
     */
    getLocalities(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL, this.httpOptions)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.localities = res['response'];
                        this.onLocalitiesChanged.next(this.localities);
                        resolve(res['response']);
                    } else {
                        // console.log('error : ' + res['status']);
                    }
                }, reject);
        });
    }

    getAll() {
        return this._httpClient.get(this.serviceURL, this.httpOptions);
    }

    getById(id: number) {
        return this._httpClient.get(this.serviceURL + '/' + id, this.httpOptions);
    }

    findByCuttingId(id: number) {
        return this._httpClient.get(this.serviceURL + '/' + id + '/cutting', this.httpOptions);
    }

    create(locality: Locality) {
        return this._httpClient.post(this.serviceURL, locality, this.httpOptions);
    }

    update(locality: Locality) {
        return this._httpClient.put(this.serviceURL, locality, this.httpOptions);
    }
}
