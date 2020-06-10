import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {XensaUtils} from '../../../utils/xensa-utils';
import {LegalFolder} from '../../../data/models/legal.folder.model';
import {LegalFolderSaveEntity} from '../../../data/wrapper/legal.folder.save.entity.model';

@Injectable({
    providedIn: 'root'
})
export class LegalFolderService implements Resolve<any>
{
    routeParams: any;
    legalFolder: LegalFolder;
    onLegalFolderChanged: BehaviorSubject<any>;
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
        this.onLegalFolderChanged = new BehaviorSubject({});
        this.serviceURL = environment.serviceUrl + '/legal-folders';
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
                this.getLegalFolder()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get legalFolder
     *
     * @returns {Promise<any>}
     */
    getLegalFolder(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onLegalFolderChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                    .subscribe((response: any) => {
                        this.legalFolder = response['response'];
                        this.onLegalFolderChanged.next(this.legalFolder);
                        resolve(response['response']);
                    }, reject);
            }
        });
    }

    create(legalFolderSaveEntity: LegalFolderSaveEntity) {
        return this._httpClient.post(this.serviceURL, legalFolderSaveEntity,this.httpOptions);
    }

    update(legalFolderSaveEntity: LegalFolderSaveEntity) {
        return this._httpClient.put(this.serviceURL, legalFolderSaveEntity,this.httpOptions);
    }


}
