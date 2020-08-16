import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {CATEGORY, DEGREE, JUDGMENT, STATE_FOLDER, SUB_CATEGORY} from '../../../data/enums/enums';
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
import {JurisdictionsService} from '../jurisdictions/jurisdictions.service';
import {Jurisdiction} from '../../../data/models/jurisdiction.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {SearchLevelEntity} from '../../../utils/search-level-entity';

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
    stateTabActive = false;
    dateTabActive = false;
    stateSelected: any;
    legalFolderSaveEntity: LegalFolderSaveEntity;
    pageType: string;
    legalFolderForm: FormGroup;
    category = CATEGORY;
    categories: any[];
    subCategory = SUB_CATEGORY;
    subCategories: any[];
    judment = JUDGMENT;
    judments: any[];
    statefolder = STATE_FOLDER;
    judmentChoice: any;
    statefolders: any[];
    degree = DEGREE;
    selectedDegree: any;
    degrees: any[];
    domains: Domain[];
    domain: Domain;
    localities: Locality[] = [];
    locality: Locality;
    jurisdictions: Jurisdiction[];
    jurisdiction: Jurisdiction;
    minDate: Date;

    regions: Locality[];
    circles: SearchLevelEntity[] = [];
    towns: SearchLevelEntity[] = [];
    vfqs: SearchLevelEntity[] = [];

    levelSelected: Locality;

    regionId: number;
    circleId: number;
    towId: number;
    vfqId: number;

    // Private
    private _unsubscribeAll: Subject<any>;

    filteredOptions: Observable<Locality[]>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param _toastr
     * @param _legalFolderService
     * @param _localitiesService
     * @param _jurisdictionsService
     * @param _domainsService
     * @param _router
     * @param _spinnerService
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _legalFolderService: LegalFolderService,
        private _localitiesService: LocalitiesService,
        private _jurisdictionsService: JurisdictionsService,
        private _domainsService: DomainsService,
        private _router: Router,
        private _spinnerService: NgxSpinnerService
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
        this.judments = Object.keys(this.judment);
        this.subCategories = Object.keys(this.subCategory);
        this.statefolders = Object.keys(this.statefolder);
        this.degrees = Object.keys(this.degree);
        this.createLegalFolderForm();
        this.getDomains();
        this.getLocalities();


        // Subscribe to update interpellation on changes
        this._legalFolderService.onLegalFolderChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(legalFolder => {

                if (legalFolder) {
                    this.getJurisdictionById(legalFolder?.jurisdiction?.id);
                    this.getDomainById(legalFolder?.article?.domain?.id);
                    this.getLocalityById(legalFolder?.article?.level?.id);
                    this.legalFolderForm.get('id').setValue(legalFolder?.id);
                    this.legalFolderForm.get('degree').setValue(legalFolder?.degree);
                    this.getJurisdictions(legalFolder.degree);
                    this.legalFolderForm.get('title').setValue(legalFolder?.article?.title);
                    this.legalFolderForm.get('content').setValue(legalFolder?.article?.content);
                    this.legalFolderForm.get('description').setValue(legalFolder?.article?.description);
                    this.legalFolderForm.get('nameOfAccused').setValue(legalFolder?.nameOfAccused);
                    this.legalFolderForm.get('decisionOfJurisdiction').setValue(legalFolder?.decisionOfJurisdiction);
                    this.legalFolderForm.get('amountAtStake').setValue(legalFolder?.amountAtStake);
                    this.legalFolderForm.get('motivation').setValue(legalFolder?.motivation);
                    this.legalFolderForm.get('stateFolder').setValue(legalFolder?.stateFolder);
                    this.legalFolderForm.get('dateOfCharge').setValue(new Date(legalFolder?.dateOfCharge));
                    this.legalFolderForm.get('dateOfJudment').setValue(new Date(legalFolder?.dateOfJudment));
                    this.legalFolderForm.get('judgment').setValue(legalFolder?.judgment);
                    this.legalFolderForm.get('article').setValue(legalFolder?.article?.id);
                    this.legalFolderForm.get('domain').setValue(legalFolder?.article?.domain?.id);
                    this.legalFolderForm.get('region').setValue(legalFolder?.article?.level?.id);
                    this.legalFolderForm.get('circle').setValue(legalFolder?.article?.level?.id);
                    this.legalFolderForm.get('town').setValue(legalFolder?.article?.level?.id);
                    this.legalFolderForm.get('vfq').setValue(legalFolder?.article?.level?.id);
                    this.legalFolderForm.get('jurisdiction').setValue(legalFolder?.jurisdiction?.id);
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
            degree: new FormControl('', Validators.required),
            title: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            nameOfAccused: new FormControl('', Validators.required),
            judgment: new FormControl('', Validators.required),
            jurisdiction: new FormControl('', Validators.required),
            decisionOfJurisdiction: new FormControl(''),
            amountAtStake: new FormControl(''),
            motivation: new FormControl(''),
            content: new FormControl('', Validators.required),
            stateFolder: new FormControl('', Validators.required),
            region: new FormControl(''),
            circle: new FormControl(''),
            town: new FormControl(''),
            vfq: new FormControl(''),
            dateOfCharge: new FormControl('', Validators.required),
            dateOfJudment: new FormControl(''),
            domain: new FormControl('', Validators.required),
            article: new FormControl('')
        });
    }

    getJurisdictions(degree: DEGREE) {
        this._jurisdictionsService.findByDegree(degree).subscribe(value => {
            this.jurisdictions = value['response'];
        }, error => console.log(error));
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

    getLocalityById(id: number) {
        this._localitiesService.getById(id).subscribe(value => {
            this.locality = value['response'];
        }, error => console.log(error));
    }

    getJurisdictionById(id: number) {
        this._jurisdictionsService.getById(id).subscribe(value => {
            this.jurisdiction = value['response'];
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

    findByJurisdictionSelected(value) {
        this.getJurisdictionById(value);
    }

    findDomainSelected(value) {
        this.getDomainById(value);
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

    save() {
        this._spinnerService.show();
        this.article = new Article();
        this.legalFolder = new LegalFolder();
        this.legalFolderSaveEntity = new LegalFolderSaveEntity();
        this.article.id = this.legalFolderForm.get('article').value;
        this.article.title = this.legalFolderForm.get('title').value;
        this.article.content = this.legalFolderForm.get('content').value;
        this.article.description = this.legalFolderForm.get('description').value;
        this.article.category = this.categories[0];
        this.article.subCategory = this.subCategories[8];
        this.article.level = this.locality;
        this.article.domain = this.domain;
        this.article.ischeck = true;
        this.legalFolder.id = this.legalFolderForm.get('id').value;
        this.legalFolder.stateFolder = this.legalFolderForm.get('stateFolder').value;
        this.legalFolder.judgment = this.legalFolderForm.get('judgment').value;
        this.legalFolder.degree = this.legalFolderForm.get('degree').value;
        this.legalFolder.nameOfAccused = this.legalFolderForm.get('nameOfAccused').value;
        this.legalFolder.decisionOfJurisdiction = this.legalFolderForm.get('decisionOfJurisdiction').value;
        this.legalFolder.motivation = this.legalFolderForm.get('motivation').value;
        this.legalFolder.amountAtStake = this.legalFolderForm.get('amountAtStake').value;
        this.legalFolder.dateOfCharge = this.legalFolderForm.get('dateOfCharge').value;
        this.legalFolder.dateOfJudment = this.legalFolderForm.get('dateOfJudment').value;
        this.legalFolder.ischeck = true;
        this.legalFolder.jurisdiction = this.jurisdiction;
        this.legalFolderSaveEntity.article = this.article;
        this.legalFolderSaveEntity.legalFolder = this.legalFolder;
        if (!this.legalFolder.id) {
            this._legalFolderService.create(this.legalFolderSaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/corryptometer/legal-folders').then(r => {
                        if (r) {
                            this._spinnerService.hide();
                        } else {
                            console.log('La navigation a échoué!');
                            this._spinnerService.hide();
                        }
                    });
                } else {
                    this._spinnerService.hide();
                    this._toastr.error(data['message']);
                }
            });
        } else {
            this.legalFolderSaveEntity.legalFolder.updateDate = new Date();
            this._legalFolderService.update(this.legalFolderSaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/corryptometer/legal-folders').then(e => {
                        if (e) {
                            this._spinnerService.hide();
                        } else {
                            console.log('La navigation a échoué!');
                            this._spinnerService.hide();
                        }
                    });
                } else {
                    this._spinnerService.hide();
                    this._toastr.error(data['message']);
                }
            });
        }
    }

    onChangeDate(e) {
        this.minDate = new Date(e.value);
    }

    enterChoice(value) {
        this.selectedDegree = value;
        this.getJurisdictions(value);
        this.stateTabActive = true;
    }

    choiceJudment(value) {
        this.judmentChoice = value;
    }

    choiceState(value) {
        this.stateSelected = value;
        this.dateTabActive = true;
        if (value === 'IN_PROGRESS') {
            this.legalFolderForm.get('judgment').setValue(this.judments[0]);
        }
    }
}
