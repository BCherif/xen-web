import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {CATEGORY, STATE_LAW_PROJECT, SUB_CATEGORY} from '../../../data/enums/enums';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Article} from '../../../data/models/article.model';
import {Domain} from '../../../data/models/domain.model';
import {Locality} from '../../../data/models/locality.model';
import {LocalitiesService} from '../../setting/localities/localities.service';
import {DomainsService} from '../../setting/domains/domains.service';
import {XensaUtils} from '../../../utils/xensa-utils';
import {User} from '../../../data/models/user.model';
import {LawProject} from '../../../data/models/law.project.model';
import {LawProjectSaveEntity} from '../../../data/wrapper/law.project.save.entity.model';
import {Elected} from '../../../data/models/elected.model';
import {LawProjectService} from './law-project.service';
import {ElectedsService} from '../../trueometer/electeds/electeds.service';

@Component({
    selector: 'participation-law-project',
    templateUrl: './law-project.component.html',
    styleUrls: ['./law-project.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LawProjectComponent implements OnInit, OnDestroy {
    lawProject: LawProject;
    article: Article;
    lawProjectSaveEntity: LawProjectSaveEntity;
    pageType: string;
    lawProjectForm: FormGroup;
    category = CATEGORY;
    categories: any[];
    subCategory = SUB_CATEGORY;
    subCategories: any[];
    statelawproject = STATE_LAW_PROJECT;
    stateProjects: any[];
    domains: Domain[];
    domain: Domain;
    localities: Locality[];
    locality: Locality;
    elected: Elected;
    electeds: Elected[];

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
     * @param _lawProjectService
     * @param _electedsService
     * @param _localitiesService
     * @param _domainsService
     * @param _router
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _lawProjectService: LawProjectService,
        private _electedsService: ElectedsService,
        private _localitiesService: LocalitiesService,
        private _domainsService: DomainsService,
        private _router: Router
    ) {
        // Set the default
        this.article = new Article();
        this.lawProject = new LawProject();

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
        this.categories = Object.keys(this.category);
        this.subCategories = Object.keys(this.subCategory);
        this.stateProjects = Object.keys(this.statelawproject);
        this.createLawProjectForm();
        this.getLocalities();
        this.getDomains();
        this.getElecteds();
        // Subscribe to update interpellation on changes
        this._lawProjectService.onLawProjectChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(lawProject => {

                if (lawProject) {
                    this.lawProject = new LawProject(lawProject);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.lawProject = new LawProject();
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
     * Create lawProject form
     *
     * @returns {FormGroup}
     */
    createLawProjectForm() {
        this.lawProjectForm = this._formBuilder.group({
            id: new FormControl(''),
            title: new FormControl('', Validators.required),
            content: new FormControl('', Validators.required),
            year: new FormControl('', Validators.required),
            stateLawProject: new FormControl('', Validators.required),
            elected: new FormControl('', Validators.required),
            locality: new FormControl('', Validators.required),
            domain: new FormControl('', Validators.required)
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

    getElecteds() {
        this._electedsService.getAll().subscribe(value => {
            this.electeds = value['response'];
        }, error => console.log(error));
    }

    getElectedById(id: number) {
        this._electedsService.getById(id).subscribe(value => {
            this.elected = value['response'];
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

    findByElectedSelected(value) {
        this.getElectedById(value);
    }

    save() {
        this.article = new Article();
        this.lawProject = new LawProject();
        this.lawProjectSaveEntity = new LawProjectSaveEntity();
        this.article.title = this.lawProjectForm.get('title').value;
        this.article.content = this.lawProjectForm.get('content').value;
        this.article.category = this.categories[2];
        this.article.subCategory = this.subCategories[4];
        this.article.locality = this.locality;
        this.article.domain = this.domain;
        this.lawProject.year = this.lawProjectForm.get('year').value;
        this.lawProject.elected = this.elected;
        this.lawProject.stateLawProject = this.lawProjectForm.get('stateLawProject').value;
        this.lawProjectSaveEntity.article= this.article;
        this.lawProjectSaveEntity.lawProject = this.lawProject;
        this._lawProjectService.create(this.lawProjectSaveEntity).subscribe(data => {
            if (data['status'] === 'OK') {
                this._toastr.success(data['message']);
                this._router.navigateByUrl('/main/participation/law-projects');
            } else {
                this._toastr.error(data['message']);
            }
        });
    }

}
