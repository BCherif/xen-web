import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {CATEGORY, STATE_FOLDER, SUB_CATEGORY} from '../../../data/enums/enums';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Article} from '../../../data/models/article.model';
import {LegalFolder} from '../../../data/models/legal.folder.model';
import {LegalFolderService} from './legal-folder.service';
import {LegalFolderSaveEntity} from '../../../data/wrapper/legal.folder.save.entity.model';
import {Domain} from '../../../data/models/domain.model';
import {Locality} from '../../../data/models/locality.model';
import {LocalitiesService} from '../../setting/localities/localities.service';
import {DomainsService} from '../../setting/domains/domains.service';

@Component({
    selector: 'corryptometer-denunciation',
    templateUrl: './legal-folder.component.html',
    styleUrls: ['./legal-folder.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LegalFolderComponent implements OnInit, OnDestroy {
    legalFolder: LegalFolder;
    article: Article;
    legalFolderSaveEntity: LegalFolderSaveEntity;
    pageType: string;
    legalFolderForm: FormGroup;
    category = CATEGORY;
    categories: any[];
    subCategory = SUB_CATEGORY;
    subCategories: any[];
    statefolder = STATE_FOLDER;
    statefolders: any[];
    domains: Domain[];
    domain: Domain;
    localities: Locality[];
    locality: Locality;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param _toastr
     * @param _legalFolderService
     * @param _localitiesService
     * @param _domainsService
     * @param _router
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _legalFolderService: LegalFolderService,
        private _localitiesService: LocalitiesService,
        private _domainsService: DomainsService,
        private _router: Router
    ) {
        // Set the default
        this.article = new Article();
        this.legalFolder = new LegalFolder();

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
        this.statefolders = Object.keys(this.statefolder);
        this.createLegalFolderForm();
        this.getLocalities();
        this.getDomains();
        // Subscribe to update interpellation on changes
        this._legalFolderService.onLegalFolderChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(legalFolder => {

                if (legalFolder) {
                    this.legalFolder = new LegalFolder(legalFolder);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.legalFolder = new LegalFolder();
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
     * Create legalFolder form
     *
     * @returns {FormGroup}
     */
    createLegalFolderForm() {
        this.legalFolderForm = this._formBuilder.group({
            id: new FormControl(''),
            title: new FormControl('', Validators.required),
            content: new FormControl('', Validators.required),
            stateFolder: new FormControl('', Validators.required),
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
        this.legalFolder = new LegalFolder();
        this.legalFolderSaveEntity = new LegalFolderSaveEntity();
        this.article.title = this.legalFolderForm.get('title').value;
        this.article.content = this.legalFolderForm.get('content').value;
        this.legalFolder.stateFolder = this.legalFolderForm.get('stateFolder').value;
        this.article.category = this.categories[0];
        this.article.subCategory = this.subCategories[8];
        this.article.locality = this.locality;
        this.article.domain = this.domain;
        this.legalFolderSaveEntity.article= this.article;
        this.legalFolderSaveEntity.legalFolder = this.legalFolder;
        this._legalFolderService.create(this.legalFolderSaveEntity).subscribe(data => {
            if (data['status'] === 'OK') {
                this._toastr.success(data['message']);
                this._router.navigateByUrl('/main/corryptometer/legal-folders');
            } else {
                this._toastr.error(data['message']);
            }
        });
    }

}
