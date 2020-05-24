import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {Project} from '../../../data/models/project.model';
import {XensaUtils} from '../../../utils/xensa-utils';

@Injectable({
    providedIn: 'root'
})
export class ProjectsService implements Resolve<any>
{
    projects : Project[];
    onProjectsChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/projects';
        // Set the defaults
        this.onProjectsChanged = new BehaviorSubject({});
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
                this.getProjects()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get projects
     *
     * @returns {Promise<any>}
     */
    getProjects(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL,this.httpOptions)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.projects = res['response'];
                        this.onProjectsChanged.next(this.projects);
                        resolve(res['response']);
                    }
                }, reject);
        });
    }

    getById(id: number){
        return this._httpClient.get(this.serviceURL + '/' + id,this.httpOptions);
    }

    create(project: Project) {
        return this._httpClient.post(this.serviceURL, project,this.httpOptions);
    }

    update(project: Project) {
        return this._httpClient.put(this.serviceURL, project,this.httpOptions);
    }
}
