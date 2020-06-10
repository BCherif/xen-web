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
import {XensaUtils} from '../../../utils/xensa-utils';
import {User} from '../../../data/models/user.model';
import {Petition} from '../../../data/models/petition.model';
import {PetitionSaveEntity} from '../../../data/wrapper/petition.save.entity.model';
import {PetitionService} from './petition.service';

@Component({
    selector: 'participation-petition',
    templateUrl: './petition.component.html',
    styleUrls: ['./petition.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PetitionComponent implements OnInit, OnDestroy {
    petition: Petition;
    article: Article;
    petitionSaveEntity: PetitionSaveEntity;
    pageType: string;
    petitionForm: FormGroup;
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
     * @param _petitionService
     * @param _localitiesService
     * @param _domainsService
     * @param _router
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _petitionService: PetitionService,
        private _localitiesService: LocalitiesService,
        private _domainsService: DomainsService,
        private _router: Router
    ) {
        // Set the default
        this.article = new Article();
        this.petition = new Petition();

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
        this.createPetitionForm();
        this.getLocalities();
        this.getDomains();
        // Subscribe to update interpellation on changes
        this._petitionService.onPetitionChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(petition => {

                if (petition) {
                    this.getLocalityById(petition.article.locality.id);
                    this.getDomainById(petition.article.domain.id);
                    this.petitionForm.get('id').setValue(petition.id);
                    this.petitionForm.get('title').setValue(petition.article.title);
                    this.petitionForm.get('content').setValue(petition.article.content);
                    this.petitionForm.get('decisionMaker').setValue(petition.decisionMaker);
                    this.petitionForm.get('article').setValue(petition.article.id);
                    this.petitionForm.get('domain').setValue(petition.article.domain.id);
                    this.petitionForm.get('locality').setValue(petition.article.locality.id);
                    this.petition = new Petition(petition);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.petition = new Petition();
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
     * Create petition form
     *
     * @returns {FormGroup}
     */
    createPetitionForm() {
        this.petitionForm = this._formBuilder.group({
            id: new FormControl(''),
            title: new FormControl('', Validators.required),
            content: new FormControl('', Validators.required),
            decisionMaker: new FormControl('', Validators.required),
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
        this.article = new Article();
        this.petition = new Petition();
        this.petitionSaveEntity = new PetitionSaveEntity();
        this.article.id = this.petitionForm.get('article').value;
        this.article.title = this.petitionForm.get('title').value;
        this.article.content = this.petitionForm.get('content').value;
        this.article.category = this.categories[2];
        this.article.subCategory = this.subCategories[6];
        this.article.locality = this.locality;
        this.article.domain = this.domain;
        this.petition.id = this.petitionForm.get('id').value;
        this.petition.decisionMaker = this.petitionForm.get('decisionMaker').value;
        this.petition.petitionDate = new Date();
        this.petition.user = this.currentUser;
        this.petitionSaveEntity.article= this.article;
        this.petitionSaveEntity.petition = this.petition;
        if (!this.petition.id) {
            this._petitionService.create(this.petitionSaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/participation/petitions');
                } else {
                    this._toastr.error(data['message']);
                }
            });
        }else {
            this.petitionSaveEntity.petition.updateDate = new Date();
            this._petitionService.update(this.petitionSaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/participation/petitions');
                } else {
                    this._toastr.error(data['message']);
                }
            });
        }
    }

}
