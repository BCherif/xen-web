import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {Article} from '../../../data/models/article.model';
import {SaveArticleEntity} from '../../../data/wrapper/save.article.entity.model';
import {XensaUtils} from '../../../utils/xensa-utils';

@Injectable({
    providedIn: 'root'
})
export class ArticleService implements Resolve<any>
{
    routeParams: any;
    article: Article;
    onArticleChanged: BehaviorSubject<any>;
    readonly httpOptions: any;
    readonly serviceURL: string;
    readonly crudServiceURL: string;

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
        this.onArticleChanged = new BehaviorSubject({});
        this.serviceURL = environment.serviceUrl + '/articles';
        this.crudServiceURL = environment.serviceUrl + '/publications';
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
                this.getArticle()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get article
     *
     * @returns {Promise<any>}
     */
    getArticle(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onArticleChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                    .subscribe((response: any) => {
                        this.article = response['response'];
                        this.onArticleChanged.next(this.article);
                        resolve(response['response']);
                    }, reject);
            }
        });
    }

    create(saveArticleEntity: SaveArticleEntity) {
        return this._httpClient.post(this.crudServiceURL, saveArticleEntity,this.httpOptions);
    }
}
