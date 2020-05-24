import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {Program} from '../../../data/models/program.model';
import {XensaUtils} from '../../../utils/xensa-utils';

@Injectable({
    providedIn: 'root'
})
export class ProgramsService implements Resolve<any>
{
    programs: Program[];
    onProgramsChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/programs';
        // Set the defaults
        this.onProgramsChanged = new BehaviorSubject({});
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
                this.getPrograms()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get programs
     *
     * @returns {Promise<any>}
     */
    getPrograms(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL,this.httpOptions)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.programs = res['response'];
                        this.onProgramsChanged.next(this.programs);
                        resolve(res['response']);
                    }
                }, reject);
        });
    }

    getAll() {
        return this._httpClient.get(this.serviceURL,this.httpOptions);
    }

    getById(id: number) {
        return this._httpClient.get(this.serviceURL + '/' + id,this.httpOptions);
    }

    create(program: Program) {
        return this._httpClient.post(this.serviceURL, program,this.httpOptions);
    }
    update(program: Program) {
        return this._httpClient.put(this.serviceURL, program,this.httpOptions);
    }
}
