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
import {Article} from '../../../data/models/article.model';
import {Domain} from '../../../data/models/domain.model';
import {Locality} from '../../../data/models/locality.model';
import {LocalitiesService} from '../../setting/localities/localities.service';
import {DomainsService} from '../../setting/domains/domains.service';
import {Denunciation} from '../../../data/models/denunciation.model';
import {DenunciationSaveEntity} from '../../../data/wrapper/denunciation.save.entity.model';
import {DenunciationService} from './denunciation.service';
import {XensaUtils} from '../../../utils/xensa-utils';
import {User} from '../../../data/models/user.model';

@Component({
    selector: 'participation-denunciation',
    templateUrl: './denunciation.component.html',
    styleUrls: ['./denunciation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DenunciationComponent implements OnInit, OnDestroy {
    denunciation: Denunciation;
    article: Article;
    denunciationSaveEntity: DenunciationSaveEntity;
    pageType: string;
    denunciationForm: FormGroup;
    category = CATEGORY;
    categories: any[];
    subCategory = SUB_CATEGORY;
    subCategories: any[];
    domains: Domain[];
    domain: Domain;
    localities: Locality[];
    locality: Locality;

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
     * @param _denunciationService
     * @param _localitiesService
     * @param _domainsService
     * @param _router
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _denunciationService: DenunciationService,
        private _localitiesService: LocalitiesService,
        private _domainsService: DomainsService,
        private _router: Router
    ) {
        // Set the default
        this.article = new Article();
        this.denunciation = new Denunciation();

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
        this.createDenunciationForm();
        this.getLocalities();
        this.getDomains();
        // Subscribe to update interpellation on changes
        this._denunciationService.onDenunciationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(denunciation => {

                if (denunciation) {
                    this.getLocalityById(denunciation.article.locality.id);
                    this.getDomainById(denunciation.article.domain.id);
                    this.denunciationForm.get('id').setValue(denunciation.id);
                    this.denunciationForm.get('title').setValue(denunciation.article.title);
                    this.denunciationForm.get('content').setValue(denunciation.article.content);
                    this.denunciationForm.get('entity').setValue(denunciation.entity);
                    this.denunciationForm.get('justification').setValue(denunciation.justification);
                    this.denunciationForm.get('article').setValue(denunciation.article.id);
                    this.denunciationForm.get('domain').setValue(denunciation.article.domain.id);
                    this.denunciationForm.get('locality').setValue(denunciation.article.locality.id);
                    this.denunciation = new Denunciation(denunciation);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.denunciation = new Denunciation();
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
     * Create Denunciation form
     *
     * @returns {FormGroup}
     */
    createDenunciationForm() {
        this.denunciationForm = this._formBuilder.group({
            id: new FormControl(''),
            title: new FormControl('', Validators.required),
            content: new FormControl('', Validators.required),
            entity: new FormControl('', Validators.required),
            justification: new FormControl('', Validators.required),
            locality: new FormControl('', Validators.required),
            domain: new FormControl('', Validators.required),
            article: new FormControl(''),
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
        this.denunciation = new Denunciation();
        this.denunciationSaveEntity = new DenunciationSaveEntity();
        this.article.id = this.denunciationForm.get('article').value;
        this.article.title = this.denunciationForm.get('title').value;
        this.article.content = this.denunciationForm.get('content').value;
        this.article.category = this.categories[2];
        this.article.subCategory = this.subCategories[5];
        this.article.locality = this.locality;
        this.article.domain = this.domain;
        this.denunciation.id = this.denunciationForm.get('id').value;
        this.denunciation.entity = this.denunciationForm.get('entity').value;
        this.denunciation.justification = this.denunciationForm.get('justification').value;
        this.denunciation.denunciationDate = new Date();
        this.denunciation.user = this.currentUser;
        this.denunciationSaveEntity.article= this.article;
        this.denunciationSaveEntity.denunciation = this.denunciation;
        if (!this.denunciation.id) {
            this._denunciationService.create(this.denunciationSaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/participation/denunciations');
                } else {
                    this._toastr.error(data['message']);
                }
            });
        }else {
            this.denunciationSaveEntity.denunciation.updateDate = new Date();
            this._denunciationService.update(this.denunciationSaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/participation/denunciations');
                } else {
                    this._toastr.error(data['message']);
                }
            });
        }
    }

}
