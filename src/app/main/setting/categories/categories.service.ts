import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {Category} from "../../../data/models/category.model";
import {environment} from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CategoriesService implements Resolve<any>
{
    categories: Category[];
    onCategoriesChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/categories';
        // Set the defaults
        this.onCategoriesChanged = new BehaviorSubject({});
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
                this.getCategories()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get category
     *
     * @returns {Promise<any>}
     */
    getCategories(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.categories = res['response'];
                        console.log(this.categories);
                        this.onCategoriesChanged.next(this.categories);
                        resolve(res['response']);
                    } else {
                        // console.log('error : ' + res['status']);
                    }
                }, reject);
        });
    }

    getAll() {
        return this._httpClient.get(this.serviceURL);
    }

    getById(id: number){
        return this._httpClient.get(this.serviceURL + '/' + id);
    }

    create(category: Category) {
        return this._httpClient.post(this.serviceURL, category);
    }
    update(category: Category) {
        return this._httpClient.put(this.serviceURL, category);
    }
}
