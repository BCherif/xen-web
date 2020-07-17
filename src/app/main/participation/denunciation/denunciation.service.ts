import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {XensaUtils} from '../../../utils/xensa-utils';
import {Denunciation} from '../../../data/models/denunciation.model';
import {DenunciationSaveEntity} from '../../../data/wrapper/denunciation.save.entity.model';
import {Article} from '../../../data/models/article.model';

@Injectable({
    providedIn: 'root'
})
export class DenunciationService implements Resolve<any>
{
    routeParams: any;
    denunciation: Denunciation;
    onDenunciationChanged: BehaviorSubject<any>;
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
        this.onDenunciationChanged = new BehaviorSubject({});
        this.serviceURL = environment.serviceUrl + '/denunciations';
        this.httpOptions = new XensaUtils().httpHeaders();
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
                this.getDenunciation()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get denunciation
     *
     * @returns {Promise<any>}
     */
    getDenunciation(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onDenunciationChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                    .subscribe((response: any) => {
                        this.denunciation = response['response'];
                        this.onDenunciationChanged.next(this.denunciation);
                        resolve(response['response']);
                    }, reject);
            }
        });
    }

    create(denunciationSaveEntity: DenunciationSaveEntity) {
        return this._httpClient.post(this.serviceURL, denunciationSaveEntity,this.httpOptions);
    }

    update(denunciationSaveEntity: DenunciationSaveEntity) {
        return this._httpClient.put(this.serviceURL, denunciationSaveEntity,this.httpOptions);
    }

}
