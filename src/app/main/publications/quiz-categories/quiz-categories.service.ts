import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {QuizCategory} from '../../../data/models/quiz.category.model';
import {XensaUtils} from '../../../utils/xensa-utils';

@Injectable({
    providedIn: 'root'
})
export class QuizCategoriesService implements Resolve<any> {
    quizCategories: QuizCategory[];
    onQuizCategoriesChanged: BehaviorSubject<any>;
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
        this.serviceURL = environment.serviceUrl + '/quiz-categories';
        // Set the defaults
        this.onQuizCategoriesChanged = new BehaviorSubject({});
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
            this._httpClient.get(this.serviceURL, this.httpOptions)
                .subscribe((res: any) => {
                    if (res['status'] === 'OK') {
                        this.quizCategories = res['response'];
                        this.onQuizCategoriesChanged.next(this.quizCategories);
                        resolve(res['response']);
                    } else {
                        // console.log('error : ' + res['status']);
                    }
                }, reject);
        });
    }

    getAll() {
        return this._httpClient.get(this.serviceURL, this.httpOptions);
    }

    getById(id: number) {
        return this._httpClient.get(this.serviceURL + '/' + id, this.httpOptions);
    }

    create(quizCategory: QuizCategory) {
        return this._httpClient.post(this.serviceURL, quizCategory, this.httpOptions);
    }

    update(quizCategory: QuizCategory) {
        return this._httpClient.put(this.serviceURL, quizCategory, this.httpOptions);
    }
}
