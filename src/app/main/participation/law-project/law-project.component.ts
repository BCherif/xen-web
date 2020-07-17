import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {CATEGORY, INITIATOR, STATE_LAW_PROJECT, SUB_CATEGORY} from '../../../data/enums/enums';
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
import {MatDatepicker} from '@angular/material/datepicker';
import {NgxSpinnerService} from 'ngx-spinner';

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
    initiators: any;
    initiator = INITIATOR;

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
     * @param _spinnerService
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
        private _router: Router,
        private _spinnerService: NgxSpinnerService
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
        this.initiators = Object.keys(this.initiator);
        this.createLawProjectForm();
        this.getLocalities();
        this.getDomains();
        // Subscribe to update interpellation on changes
        this._lawProjectService.onLawProjectChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(lawProject => {

                if (lawProject) {
                    this.getLocalityById(lawProject?.article?.level?.id);
                    this.getDomainById(lawProject?.article?.domain?.id);
                    this.lawProjectForm.get('id').setValue(lawProject.id);
                    this.lawProjectForm.get('title').setValue(lawProject?.article?.title);
                    this.lawProjectForm.get('projectContent').setValue(lawProject?.article?.content);
                    this.lawProjectForm.get('year').setValue(lawProject.year);
                    this.lawProjectForm.get('stateLawProject').setValue(lawProject.stateLawProject);
                    this.lawProjectForm.get('article').setValue(lawProject.article.id);
                    this.lawProjectForm.get('domain').setValue(lawProject?.article?.domain?.id);
                    this.lawProjectForm.get('initiator').setValue(lawProject.initiator);
                    this.lawProjectForm.get('locality').setValue(lawProject?.article?.level?.id);
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
            projectContent: new FormControl('', Validators.required),
            year: new FormControl(new Date(), Validators.required),
            stateLawProject: new FormControl('', Validators.required),
            initiator: new FormControl('', Validators.required),
            locality: new FormControl('', Validators.required),
            domain: new FormControl('', Validators.required),
            article: new FormControl('')
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
        this._spinnerService.show();
        this.article = new Article();
        this.lawProject = new LawProject();
        this.lawProjectSaveEntity = new LawProjectSaveEntity();
        this.article.id = this.lawProjectForm.get('article').value;
        this.article.title = this.lawProjectForm.get('title').value;
        this.article.content = this.lawProjectForm.get('projectContent').value;
        this.article.category = this.categories[2];
        this.article.subCategory = this.subCategories[4];
        this.article.level = this.locality;
        this.article.ischeck = true;
        this.article.domain = this.domain;
        this.lawProject.id = this.lawProjectForm.get('id').value;
        this.lawProject.year = this.lawProjectForm.get('year').value;
        this.lawProject.initiator = this.lawProjectForm.get('initiator').value;
        this.lawProject.stateLawProject = this.lawProjectForm.get('stateLawProject').value;
        this.lawProject.ischeck = true;
        this.lawProjectSaveEntity.article = this.article;
        this.lawProjectSaveEntity.lawProject = this.lawProject;
        if (!this.lawProject.id) {
            this._lawProjectService.create(this.lawProjectSaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/participation/law-projects');
                    this._spinnerService.hide();
                } else {
                    this._toastr.error(data['message']);
                }
            });
        } else {
            this.lawProjectSaveEntity.lawProject.updateDate = new Date();
            this._lawProjectService.update(this.lawProjectSaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/participation/law-projects');
                    this._spinnerService.hide();
                } else {
                    this._toastr.error(data['message']);
                }
            });

        }
    }

}
