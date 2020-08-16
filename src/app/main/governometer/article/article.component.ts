import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';


import {fuseAnimations} from '@fuse/animations';
import {CATEGORY, GOUV_SUB_CAT} from '../../../data/enums/enums';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {ArticleService} from './article.service';
import {Article} from '../../../data/models/article.model';
import {Locality} from '../../../data/models/locality.model';
import {Domain} from '../../../data/models/domain.model';
import {LocalitiesService} from '../../setting/localities/localities.service';
import {DomainsService} from '../../setting/domains/domains.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {XensaUtils} from '../../../utils/xensa-utils';
import {User} from '../../../data/models/user.model';
import {SearchLevelEntity} from '../../../utils/search-level-entity';

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
    localities: Locality[] = [];
    locality: Locality;
    pageType: string;
    fileSelected: File;
    selectedFiles: FileList;
    currentFile: File;
    articleForm: FormGroup;
    category = CATEGORY;
    categories: any[];
    subCategory = GOUV_SUB_CAT;
    subCategories: any[];

    regions: Locality[];
    circles: SearchLevelEntity[] = [];
    towns: SearchLevelEntity[] = [];
    vfqs: SearchLevelEntity[] = [];

    levelSelected: Locality;

    regionId: number;
    circleId: number;
    towId: number;
    vfqId: number;

    xensaUtils = new XensaUtils();
    currentUser: User = this.xensaUtils.getAppUser();

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
     * @param _spinnerService
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _articleService: ArticleService,
        private _localitiesService: LocalitiesService,
        private _domainsService: DomainsService,
        private _router: Router,
        private _spinnerService: NgxSpinnerService
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
                    this.getDomainById(article?.domain?.id);
                    this.getLocalityById(article?.level?.id);
                    this.articleForm.get('id').setValue(article.id);
                    this.articleForm.get('title').setValue(article.title);
                    this.articleForm.get('content').setValue(article.content);
                    this.articleForm.get('subCategory').setValue(article.subCategory);
                    this.articleForm.get('domain').setValue(article?.domain?.id);
                    this.articleForm.get('description').setValue(article?.description);
                    this.articleForm.get('region').setValue(article?.level?.id);
                    this.articleForm.get('circle').setValue(article?.level?.id);
                    this.articleForm.get('town').setValue(article?.level?.id);
                    this.articleForm.get('vfq').setValue(article?.level?.id);
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
            description: new FormControl('', Validators.required),
            content: new FormControl('', Validators.required),
            domain: new FormControl('', Validators.required),
            /*  fileName: new FormControl(''),
            *  level: new FormControl('', Validators.required),*/
            region: new FormControl(''),
            circle: new FormControl(''),
            town: new FormControl(''),
            vfq: new FormControl(''),
            subCategory: new FormControl('', Validators.required)
        });
    }

    getLocalities() {
        this._localitiesService.getAll().subscribe(value => {
            this.localities = value['response'];
            this.regions = this.localities.filter(value1 => value1.levelSup === null);
        }, error => console.log(error));
    }

    getLevel(value) {
        this.getLocalityById(value.id);
    }

    getDomains() {
        this._domainsService.getAll().subscribe(value => {
            this.domains = value['response'];
        }, error => console.log(error));
    }

    getDomainById(id: number) {
        this._domainsService.getById(id).subscribe(value => {
            this.domain = value['response'];
        }, error => console.log(error));
    }

    getLocalityById(id: number) {
        this._localitiesService.getById(id).subscribe(value => {
            this.locality = value['response'];
        }, error => console.log(error));
    }

    findDomainSelected(value) {
        this.getDomainById(value);
    }

    onSelectFile(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.fileSelected = file;
        }
    }

    selectFile(event) {
        this.selectedFiles = event.target.files;
    }

    save() {
        this._spinnerService.show();
        this.article = new Article();
        this.article = this.articleForm.getRawValue();
        this.article.level = this.locality;
        this.article.category = this.categories[1];
        this.article.domain = this.domain;
        this.article.ischeck = true;
        this.article.user = this.currentUser;
        if (!this.article.id) {
            this._articleService.create(this.article).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/governometer/articles');
                    this._spinnerService.hide();
                } else {
                    this._toastr.error(data['message']);
                    this._spinnerService.hide();
                }
            });
        } else {
            this.article.updateDate = new Date();
            this._articleService.update(this.article).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/governometer/articles');
                    this._spinnerService.hide();
                } else {
                    this._toastr.error(data['message']);
                    this._spinnerService.hide();
                }
            });

        }

    }

    getCircles(id: number) {
        this._localitiesService.findAllByLevelSupId(id).subscribe(data => {
            this.circles = data['response'];
        }, error => console.log(error));
    }

    getTows(id: number) {
        this._localitiesService.findAllByLevelSupId(id).subscribe(data => {
            this.towns = data['response'];
        }, error => console.log(error));
    }

    getVfqs(id: number) {
        this._localitiesService.findAllByLevelSupId(id).subscribe(data => {
            this.vfqs = data['response'];
        }, error => console.log(error));
    }

    onRegionChange(value) {
        this.regionId = value;
        this.getLocalityById(value);
        this.getCircles(value);

    }

    onCircleChange(event) {
        this.circleId = event;
        this.getLocalityById(event);
        this.getTows(event);
    }

    onTownChange(event) {
        this.towId = event;
        this.getLocalityById(event);
        this.getVfqs(event);
    }

    onVFQChange(event) {
        this.getLocalityById(event);
    }

}

