import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {XensaUtils} from '../../../utils/xensa-utils';
import {TraceLegalFolder} from '../../../data/models/trace.legal.folder.model';

@Injectable({
    providedIn: 'root'
})
export class TracesFolderService implements Resolve<any> {
    traceLegalFolders: TraceLegalFolder[];
    onTraceLegalFoldersChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/traces';
        // Set the defaults
        this.onTraceLegalFoldersChanged = new BehaviorSubject({});
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
                this.getTraces()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get traces
     *
     * @returns {Promise<any>}
     */
    getTraces(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL, this.httpOptions)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.traceLegalFolders = res['response'];
                        this.onTraceLegalFoldersChanged.next(this.traceLegalFolders);
                        resolve(res['response']);
                    }
                }, reject);
        });
    }

}
