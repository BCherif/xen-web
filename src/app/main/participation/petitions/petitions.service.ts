import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Petition} from '../../../data/models/petition.model';
import {XensaUtils} from '../../../utils/xensa-utils';

@Injectable({
    providedIn: 'root'
})
export class PetitionsService implements Resolve<any> {
    petitions: Petition[];
    onPetitionsChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/petitions';
        // Set the defaults
        this.onPetitionsChanged = new BehaviorSubject({});
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
                this.getPetitions()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get petitions
     *
     * @returns {Promise<any>}
     */
    getPetitions(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL + '/frontend', this.httpOptions)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.petitions = res['response'];
                        this.onPetitionsChanged.next(this.petitions);
                        resolve(res['response']);
                    }
                }, reject);
        });
    }

    publish(petition1: Petition) {
        return this._httpClient.post(this.serviceURL + '/publish', petition1, this.httpOptions);
    }
}
