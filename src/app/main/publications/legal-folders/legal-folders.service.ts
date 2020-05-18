import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {LegalFolder} from '../../../data/models/legal.folder.model';

@Injectable({
    providedIn: 'root'
})
export class LegalFoldersService implements Resolve<any>
{
    legalFolders: LegalFolder[];
    onLegalFoldersChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/legal-folders';
        // Set the defaults
        this.onLegalFoldersChanged = new BehaviorSubject({});
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
     * Get legal folder
     *
     * @returns {Promise<any>}
     */
    getLegalFolder(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.legalFolders = res['response'];
                        this.onLegalFoldersChanged.next(this.legalFolders);
                        resolve(res['response']);
                    }
                }, reject);
        });
    }

}
