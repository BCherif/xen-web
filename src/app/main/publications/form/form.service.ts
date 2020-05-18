import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {Form} from '../../../data/models/form.model';
import {FormSaveEntity} from '../../../data/wrapper/form.save.entity.model';

@Injectable({
    providedIn: 'root'
})
export class FormService implements Resolve<any>
{
    routeParams: any;
    form: Form;
    onFormChanged: BehaviorSubject<any>;
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
        this.onFormChanged = new BehaviorSubject({});
        this.serviceURL = environment.serviceUrl + '/forms';
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
                this.getForm()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get form
     *
     * @returns {Promise<any>}
     */
    getForm(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onFormChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                    .subscribe((response: any) => {
                        this.form = response['response'];
                        this.onFormChanged.next(this.form);
                        resolve(response['response']);
                    }, reject);
            }
        });
    }


    getById(id: number){
        return this._httpClient.get(this.serviceURL + '/' + id);
    }

    create(formSaveEntity: FormSaveEntity) {
        return this._httpClient.post(this.serviceURL, formSaveEntity);
    }
    update(formSaveEntity: FormSaveEntity) {
        return this._httpClient.put(this.serviceURL, formSaveEntity);
    }
}
