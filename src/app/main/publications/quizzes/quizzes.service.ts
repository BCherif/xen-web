import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Quiz} from '../../../data/models/quiz.model';
import {XensaUtils} from '../../../utils/xensa-utils';

@Injectable({
    providedIn: 'root'
})
export class QuizzesService implements Resolve<any> {
    quizzes: Quiz[];
    onQuizzesChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/quizzes';
        // Set the defaults
        this.onQuizzesChanged = new BehaviorSubject({});
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
                this.getQuizzes()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get quizzes
     *
     * @returns {Promise<any>}
     */
    getQuizzes(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.serviceURL, this.httpOptions)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.quizzes = res['response'];
                        this.onQuizzesChanged.next(this.quizzes);
                        resolve(res['response']);
                    }
                }, reject);
        });
    }

    create(quiz: Quiz) {
        return this._httpClient.post(this.serviceURL, quiz, this.httpOptions);
    }

    update(quiz: Quiz) {
        return this._httpClient.put(this.serviceURL, quiz, this.httpOptions);
    }

    getAll() {
        return this._httpClient.get(this.serviceURL, this.httpOptions);
    }

    getById(id: number) {
        return this._httpClient.get(this.serviceURL + '/' + id);
    }

}
