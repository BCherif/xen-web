import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {XensaUtils} from '../../../utils/xensa-utils';
import {Petition} from '../../../data/models/petition.model';
import {PetitionSaveEntity} from '../../../data/wrapper/petition.save.entity.model';
import {Interpellation} from '../../../data/models/interpellation.model';

@Injectable({
    providedIn: 'root'
})
export class PetitionService implements Resolve<any> {
    routeParams: any;
    petition: Petition;
    onPetitionChanged: BehaviorSubject<any>;
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
        this.onPetitionChanged = new BehaviorSubject({});
        this.serviceURL = environment.serviceUrl + '/petitions';
        this.httpOptions = new XensaUtils().httpHeaders();
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
                this.getPetition()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get petition
     *
     * @returns {Promise<any>}
     */
    getPetition(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.onPetitionChanged.next(false);
                resolve(false);
            } else {
                this._httpClient.get(this.serviceURL + '/' + this.routeParams.id, this.httpOptions)
                    .subscribe((response: any) => {
                        this.petition = response['response'];
                        this.onPetitionChanged.next(this.petition);
                        resolve(response['response']);
                    }, reject);
            }
        });
    }

    create(petitionSaveEntity: PetitionSaveEntity) {
        return this._httpClient.post(this.serviceURL, petitionSaveEntity, this.httpOptions);
    }

    update(petitionSaveEntity: PetitionSaveEntity) {
        return this._httpClient.put(this.serviceURL, petitionSaveEntity, this.httpOptions);
    }
}
