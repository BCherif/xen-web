import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {CATEGORY, SUB_CATEGORY} from '../../../data/enums/enums';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {ArticleService} from './article.service';
import {Article} from '../../../data/models/article.model';
import {Locality} from '../../../data/models/locality.model';
import {Domain} from '../../../data/models/domain.model';
import {LocalitiesService} from '../../setting/localities/localities.service';
import {DomainsService} from '../../setting/domains/domains.service';

@Component({
    selector: 'governometer-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ArticleComponent implements OnInit, OnDestroy {
    article: Article;
    domains: Domain[];
    domain: Domain;
    localities: Locality[];
    locality: Locality;
    pageType: string;
    articleForm: FormGroup;
    category = CATEGORY;
    categories: any[];
    subCategory = SUB_CATEGORY;
    subCategories: any[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param _toastr
     * @param _articleService
     * @param _localitiesService
     * @param _domainsService
     * @param _router
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _articleService: ArticleService,
        private _localitiesService: LocalitiesService,
        private _domainsService: DomainsService,
        private _router: Router
    ) {
        // Set the default
        this.article = new Article();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.subCategories = Object.keys(this.subCategory);
        this.categories = Object.keys(this.category);
        this.createArticleForm();
        this.getLocalities();
        this.getDomains();
        // Subscribe to update interpellation on changes
        this._articleService.onArticleChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(article => {

                if (article) {
                    this.getDomainById(article.domain.id);
                    this.getLocalityById(article.locality.id);
                    this.articleForm.get('id').setValue(article.id);
                    this.articleForm.get('title').setValue(article.title);
                    this.articleForm.get('content').setValue(article.content);
                    this.articleForm.get('subCategory').setValue(article.subCategory);
                    this.articleForm.get('category').setValue(article.category);
                    this.articleForm.get('domain').setValue(article.domain.id);
                    this.articleForm.get('locality').setValue(article.locality.id);
                    this.article = new Article(article);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.article = new Article();
                }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create article form
     *
     * @returns {FormGroup}
     */
    createArticleForm() {
        this.articleForm = this._formBuilder.group({
            id: new FormControl(''),
            title: new FormControl('', Validators.required),
            content: new FormControl('', Validators.required),
            subCategory: new FormControl('', Validators.required),
            locality: new FormControl('', Validators.required),
            domain: new FormControl('', Validators.required),
            category: new FormControl('', Validators.required)
        });
    }

    getLocalities() {
        this._localitiesService.getAll().subscribe(value => {
            this.localities = value['response'];
        }, error => console.log(error));
    }

    getDomains() {
        this._domainsService.getAll().subscribe(value => {
            this.domains = value['response'];
        }, error => console.log(error));
    }

    getLocalityById(id: number) {
        this._localitiesService.getById(id).subscribe(value => {
            this.locality = value['response'];
        }, error => console.log(error));
    }

    getDomainById(id: number) {
        this._domainsService.getById(id).subscribe(value => {
            this.domain = value['response'];
        }, error => console.log(error));
    }

    findByLocalitySelected(value) {
        this.getLocalityById(value);
    }

    findDomainSelected(value) {
        this.getDomainById(value);
    }

    save() {
        this.article = new Article();
        this.article = this.articleForm.getRawValue();
        this.article.locality = this.locality;
        this.article.domain = this.domain;
        if (!this.article.id) {
            this._articleService.create(this.article).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/governometer/articles');
                } else {
                    this._toastr.error(data['message']);
                }
            });
        } else {
            this.article.updateDate = new Date();
            this._articleService.update(this.article).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/governometer/articles');
                } else {
                    this._toastr.error(data['message']);
                }
            });

        }

    }

}
