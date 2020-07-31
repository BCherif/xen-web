import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Form} from '../../../data/models/form.model';
import {XensaUtils} from '../../../utils/xensa-utils';

@Injectable({
    providedIn: 'root'
})
export class FormsService implements Resolve<any> {
    forms: Form[];
    onFormsChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/forms';
        // Set the defaults
        this.onFormsChanged = new BehaviorSubject({});
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
                this.getForms()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get forms
     *
     * @returns {Promise<any>}
     */
    getForms(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL, this.httpOptions)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.forms = res['response'];
                        this.onFormsChanged.next(this.forms);
                        resolve(res['response']);
                    }
                }, reject);
        });
    }

    create(form: Form) {
        return this._httpClient.post(this.serviceURL, form, this.httpOptions);
    }

    getById(id: number) {
        return this._httpClient.get(this.serviceURL + '/' + id, this.httpOptions);
    }

}
