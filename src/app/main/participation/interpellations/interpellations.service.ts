import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Interpellation} from '../../../data/models/interpellation.model';
import {XensaUtils} from '../../../utils/xensa-utils';

@Injectable({
    providedIn: 'root'
})
export class InterpellationsService implements Resolve<any> {
    interpellations: Interpellation[];
    onInterpellationsChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/interpellations';
        // Set the defaults
        this.onInterpellationsChanged = new BehaviorSubject({});
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
                this.getinterpellations()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get requests
     *
     * @returns {Promise<any>}
     */
    getinterpellations(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL + '/frontend', this.httpOptions)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.interpellations = res['response'];
                        this.onInterpellationsChanged.next(this.interpellations);
                        resolve(res['response']);
                    }
                }, reject);
        });
    }

    getById(id: number) {
        return this._httpClient.get(this.serviceURL + '/' + id, this.httpOptions);
    }

    create(interpellation: Interpellation) {
        return this._httpClient.post(this.serviceURL, interpellation, this.httpOptions);
    }

    update(interpellation: Interpellation) {
        return this._httpClient.put(this.serviceURL, interpellation, this.httpOptions);
    }

    publish(interpellation1: Interpellation) {
        return this._httpClient.post(this.serviceURL + '/publish', interpellation1, this.httpOptions);
    }
}
