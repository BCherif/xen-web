import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {XensaUtils} from '../../../utils/xensa-utils';
import {LawProject} from '../../../data/models/law.project.model';
import {LawProjectSaveEntity} from '../../../data/wrapper/law.project.save.entity.model';

@Injectable({
    providedIn: 'root'
})
export class LawProjectService implements Resolve<any>
{
    routeParams: any;
    lawProject: LawProject;
    onLawProjectChanged: BehaviorSubject<any>;
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
        this.onLawProjectChanged = new BehaviorSubject({});
        this.serviceURL = environment.serviceUrl + '/law-projects';
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
                this.getLawProject()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get lawProject
     *
     * @returns {Promise<any>}
     */
    getLawProject(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onLawProjectChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                    .subscribe((response: any) => {
                        this.lawProject = response['response'];
                        this.onLawProjectChanged.next(this.lawProject);
                        resolve(response['response']);
                    }, reject);
            }
        });
    }

    create(lawProjectSaveEntity: LawProjectSaveEntity) {
        return this._httpClient.post(this.serviceURL, lawProjectSaveEntity,this.httpOptions);
    }

    update(lawProjectSaveEntity: LawProjectSaveEntity) {
        return this._httpClient.put(this.serviceURL, lawProjectSaveEntity,this.httpOptions);
    }
}
