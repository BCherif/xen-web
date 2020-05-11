import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {LawArticle} from '../../../data/models/law.article.model';

@Injectable({
    providedIn: 'root'
})
export class LawArticleService implements Resolve<any>
{
    routeParams: any;
    lawArticle: LawArticle;
    onLawArticleChanged: BehaviorSubject<any>;
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
        this.onLawArticleChanged = new BehaviorSubject({});
        this.serviceURL = environment.serviceUrl + '/law-articles';
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
                this.getLawArticle()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get lawArticle
     *
     * @returns {Promise<any>}
     */
    getLawArticle(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onLawArticleChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                    .subscribe((response: any) => {
                        this.lawArticle = response['response'];
                        this.onLawArticleChanged.next(this.lawArticle);
                        resolve(response['response']);
                    }, reject);
            }
        });
    }

    getAll() {
        return this._httpClient.get(this.serviceURL);
    }

    getById(id: number){
        return this._httpClient.get(this.serviceURL + '/' + id);
    }

    create(lawArticle: LawArticle) {
        return this._httpClient.post(this.serviceURL, lawArticle);
    }
    update(lawArticle: LawArticle) {
        return this._httpClient.put(this.serviceURL, lawArticle);
    }
}
