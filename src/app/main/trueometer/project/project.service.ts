import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Project} from '../../../data/models/project.model';
import {XensaUtils} from '../../../utils/xensa-utils';

@Injectable({
    providedIn: 'root'
})
export class ProjectService implements Resolve<any> {
    routeParams: any;
    project: Project;
    onProjectChanged: BehaviorSubject<any>;
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
        // Set the defaults
        this.httpOptions = new XensaUtils().httpHeaders();
        this.onProjectChanged = new BehaviorSubject({});
        this.serviceURL = environment.serviceUrl + '/projects';
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getProject()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get project
     *
     * @returns {Promise<any>}
     */
    getProject(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onProjectChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                    .subscribe((response: any) => {
                        this.project = response['response'];
                        this.onProjectChanged.next(this.project);
                        resolve(response['response']);
                    }, reject);
            }
        });
    }


    getById(id: number) {
        return this._httpClient.get(this.serviceURL + '/' + id, this.httpOptions);
    }

    create(project: Project) {
        return this._httpClient.post(this.serviceURL, project, this.httpOptions);
    }

    update(project: Project) {
        return this._httpClient.put(this.serviceURL, project, this.httpOptions);
    }
}
