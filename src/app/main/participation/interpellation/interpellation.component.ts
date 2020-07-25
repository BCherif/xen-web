import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable, Subject} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {InterpellationService} from './interpellation.service';
import {ElectedsService} from '../../trueometer/electeds/electeds.service';
import {Elected} from '../../../data/models/elected.model';
import {CALL_AS, CATEGORY, ORGAN_CALL, SUB_CATEGORY} from '../../../data/enums/enums';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Interpellation} from '../../../data/models/interpellation.model';
import {Organ} from '../../../data/models/organ.model';
import {OrgansService} from '../../trueometer/organs/organs.service';
import {Article} from '../../../data/models/article.model';
import {Domain} from '../../../data/models/domain.model';
import {Locality} from '../../../data/models/locality.model';
import {XensaUtils} from '../../../utils/xensa-utils';
import {User} from '../../../data/models/user.model';
import {LocalitiesService} from '../../setting/localities/localities.service';
import {DomainsService} from '../../setting/domains/domains.service';
import {InterpellationSaveEntity} from '../../../data/wrapper/interpellation.save.entity.model';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'participation-interpellation',
    templateUrl: './interpellation.component.html',
    styleUrls: ['./interpellation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class InterpellationComponent implements OnInit, OnDestroy {
    interpellation: Interpellation;
    interpellationSaveEntity: InterpellationSaveEntity;
    article: Article;
    elected: Elected;
    electeds: Elected[];
    organ: Organ;
    organs: Organ[];
    pageType: string;
    interpellationForm: FormGroup;
    asCalls: any[];
    callAs = CALL_AS;
    organCalls: any[];
    organCall = ORGAN_CALL;
    organCallSelected: any;
    asCallSelected: any;
    category = CATEGORY;
    categories: any[];
    subCategory = SUB_CATEGORY;
    subCategories: any[];
    domains: Domain[];
    domain: Domain;
    localities: Locality[] = [];
    locality: Locality;

    xensaUtils = new XensaUtils();
    currentUser: User = this.xensaUtils.getAppUser();

    filteredOptions: Observable<Locality[]>;


    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {InterpellationService} _interpellationService
     * @param _electedsService
     * @param _organsService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param _toastr
     * @param _domainsService
     * @param _localitiesService
     * @param _router
     * @param _spinnerService
     */
    constructor(
        private _interpellationService: InterpellationService,
        private _electedsService: ElectedsService,
        private _organsService: OrgansService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _domainsService: DomainsService,
        private _localitiesService: LocalitiesService,
        private _router: Router,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the default
        this.interpellation = new Interpellation();
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
        this.asCalls = Object.keys(this.callAs);
        this.organCalls = Object.keys(this.organCall);
        this.categories = Object.keys(this.category);
        this.subCategories = Object.keys(this.subCategory);
        this.createInterpellationForm();
        this.getOrgans();
        this.getLocalities();
        this.getDomains();

        this.filteredOptions = this.interpellationForm.get('level').valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.name),
                map(name => name ? this._filter(name) : this.localities.slice())
            );
        // Subscribe to update interpellation on changes
        this._interpellationService.onInterpellationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(interpellation => {

                if (interpellation) {
                    this.organCallSelected = interpellation.organCall;
                    if (interpellation.organCall === 'ELECTED') {
                        this.getElecteds(interpellation?.article?.level?.id);
                        this.interpellationForm.get('electeds').setValue(interpellation.electeds);
                    } else {
                        this.interpellationForm.get('organs').setValue(interpellation.organs);
                    }
                    this.getDomainById(interpellation?.article?.domain?.id);
                    this.getLocalityById(interpellation?.article?.level?.id);
                    this.interpellationForm.get('id').setValue(interpellation.id);
                    this.interpellationForm.get('title').setValue(interpellation?.article?.title);
                    this.interpellationForm.get('interContent').setValue(interpellation?.article?.content);
                    this.interpellationForm.get('organCall').setValue(interpellation.organCall);
                    this.interpellationForm.get('callAs').setValue(interpellation.callAs);
                    this.interpellationForm.get('author').setValue(interpellation.author);
                    this.interpellationForm.get('article').setValue(interpellation?.article.id);
                    this.interpellationForm.get('domain').setValue(interpellation?.article?.domain?.id);
                    this.interpellationForm.get('level').setValue(interpellation?.article?.level?.id);
                    this.interpellation = new Interpellation(interpellation);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.interpellation = new Interpellation();
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
     * Create interpellation form
     *
     * @returns {FormGroup}
     */
    createInterpellationForm() {
        this.interpellationForm = this._formBuilder.group({
            id: new FormControl(''),
            title: new FormControl(''),
            author: new FormControl(''),
            interContent: new FormControl('', Validators.required),
            organCall: new FormControl('', Validators.required),
            callAs: new FormControl('', Validators.required),
            electeds: new FormControl(''),
            organs: new FormControl(''),
            level: new FormControl('', Validators.required),
            domain: new FormControl('', Validators.required),
            article: new FormControl('')
        });
    }

    getElecteds(id: number) {
        this._electedsService.findAllByLevelId(id).subscribe(value => {
            this.electeds = value['response'];
            console.log(this.electeds);
        }, error => console.log(error));
    }

    getOrgans() {
        this._organsService.getAll().subscribe(value => {
            this.organs = value['response'];
        }, error => console.log(error));
    }

    /*  getElectedById(id: number) {
          this._electedsService.getById(id).subscribe(value => {
              this.elected = value['response'];
          }, error => console.log(error));
      }

      getOrganById(id: number) {
          this._organsService.getById(id).subscribe(value => {
              this.organ = value['response'];
          }, error => console.log(error));
      }

      findByElectedSelected(value) {
          this.getElectedById(value);
      }

      findOrganSelected(value) {
          this.getOrganById(value);
      }*/

    getLocalities() {
        this._localitiesService.getAll().subscribe(value => {
            this.localities = value['response'];
        }, error => console.log(error));
    }

    displayFn(locality: Locality): string {
        return locality && locality.name ? locality.name : '';
    }

    private _filter(name: string): Locality[] {
        const filterValue = name.toLowerCase();
        return this.localities.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    getLevel(value) {
        this.getLocalityById(value.id);
        this.getElecteds(value.id);
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
        this.getElecteds(value);
    }

    findDomainSelected(value) {
        this.getDomainById(value);
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.interpellation = new Interpellation();
        this.article = new Article();
        this.interpellationSaveEntity = new InterpellationSaveEntity();
        this.interpellation.interpelDate = new Date();
        this.interpellation.id = this.interpellationForm.get('id').value;
        this.interpellation.callAs = this.interpellationForm.get('callAs').value;
        this.interpellation.author = this.interpellationForm.get('author').value;
        if (this.organCallSelected === 'ELECTED') {
            this.interpellation.electeds = this.interpellationForm.get('electeds').value;
            this.interpellation.organs = [];
        } else {
            this.interpellation.organs = this.interpellationForm.get('organs').value;
            this.interpellation.electeds = [];
        }
        this.interpellation.organCall = this.interpellationForm.get('organCall').value;
        this.article.user = this.currentUser;
        this.article.title = this.interpellationForm.get('title').value;
        this.article.id = this.interpellationForm.get('article').value;
        this.article.content = this.interpellationForm.get('interContent').value;
        this.article.category = this.categories[2];
        this.article.subCategory = this.subCategories[7];
        this.article.level = this.locality;
        this.article.domain = this.domain;
        this.interpellationSaveEntity.article = this.article;
        this.interpellationSaveEntity.interpellation = this.interpellation;
        if (!this.interpellation.id) {
            this._interpellationService.create(this.interpellationSaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/participation/interpellations');
                    this._spinnerService.hide();
                } else {
                    this._toastr.error(data['message']);
                }
            });
        } else {
            this._interpellationService.update(this.interpellationSaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/participation/interpellations');
                    this._spinnerService.hide();
                } else {
                    this._toastr.error(data['message']);
                }
            });
        }
    }

    getOrganChoice(value) {
        this.organCallSelected = value;
    }

    getasCallChoice(value) {
        this.asCallSelected = value;
    }
}
