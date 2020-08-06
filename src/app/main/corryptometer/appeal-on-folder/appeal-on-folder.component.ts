import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable, Subject} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {DEGREE, JUDGMENT, STATE_FOLDER} from '../../../data/enums/enums';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {LegalFolder} from '../../../data/models/legal.folder.model';
import {Domain} from '../../../data/models/domain.model';
import {Locality} from '../../../data/models/locality.model';
import {LocalitiesService} from '../../setting/localities/localities.service';
import {DomainsService} from '../../setting/domains/domains.service';
import {JurisdictionsService} from '../jurisdictions/jurisdictions.service';
import {Jurisdiction} from '../../../data/models/jurisdiction.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {AppealOnFolderService} from './appeal-on-folder.service';
import {Appeal} from '../../../data/models/appeal.model';
import {LegalFolderService} from '../legal-folder/legal-folder.service';
import {SearchLevelEntity} from '../../../utils/search-level-entity';

@Component({
    selector: 'corryptometer-appeal-on-folder',
    templateUrl: './appeal-on-folder.component.html',
    styleUrls: ['./appeal-on-folder.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AppealOnFolderComponent implements OnInit, OnDestroy {
    legalFolder: LegalFolder;
    appeal: Appeal;
    stateTabActive = false;
    dateTabActive = false;
    pageType: string;
    appealForm: FormGroup;
    judment = JUDGMENT;
    judments: any[];
    statefolder = STATE_FOLDER;
    judmentChoice: any;
    statefolders: any[];
    degree = DEGREE;
    stateSelected: any;
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

    filteredOptions: Observable<Locality[]>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param _toastr
     * @param _appealOnFolderService
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
        private _appealOnFolderService: AppealOnFolderService,
        private _legalFolderService: LegalFolderService,
        private _localitiesService: LocalitiesService,
        private _jurisdictionsService: JurisdictionsService,
        private _domainsService: DomainsService,
        private _router: Router,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the default
        this.appeal = new Appeal();
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
        this.judments = Object.keys(this.judment);
        this.statefolders = Object.keys(this.statefolder);
        this.degrees = Object.keys(this.degree);
        this.createAppelForm();
        this.getLocalities();
        this.getJurisdictions();
        this.getDomains();

        // this.filteredOptions = this.appealForm.get('level').valueChanges
        //     .pipe(
        //         startWith(''),
        //         map(value => typeof value === 'string' ? value : value.name),
        //         map(name => name ? this._filter(name) : this.localities.slice())
        //     );
        // Subscribe to update interpellation on changes
        this._appealOnFolderService.onLegalFolderChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(legalFolder => {

                if (legalFolder) {
                    this.legalFolder = legalFolder;
                    this.getJurisdictionById(legalFolder?.jurisdiction?.id);
                    this.getDomainById(legalFolder?.article?.domain?.id);
                    this.getLocalityById(legalFolder?.article?.level?.id);
                    this.appealForm.get('id').setValue('');
                    this.appealForm.get('degree').setValue(this.degrees[1]);
                    this.appealForm.get('title').setValue(legalFolder?.article?.title);
                    this.appealForm.get('content').setValue(legalFolder?.article?.content);
                    this.appealForm.get('nameOfAccused').setValue(legalFolder?.nameOfAccused);
                    this.appealForm.get('decisionOfJurisdiction').setValue('');
                    this.appealForm.get('amountAtStake').setValue('');
                    this.appealForm.get('motivation').setValue('');
                    this.appealForm.get('stateFolder').setValue('');
                    this.appealForm.get('dateAppeal').setValue('');
                    this.appealForm.get('dateOfJudment').setValue('');
                    this.appealForm.get('judgment').setValue('');
                    /*
                                        this.appealForm.get('level').setValue(legalFolder?.article?.level?.id);
                    */
                    this.appealForm.get('domain').setValue(legalFolder?.article?.domain?.id);
                    this.appealForm.get('jurisdiction').setValue(legalFolder?.jurisdiction?.id);
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
     * Create appel form
     *
     * @returns {FormGroup}
     */
    createAppelForm() {
        this.appealForm = this._formBuilder.group({
            id: new FormControl(''),
            title: new FormControl('', Validators.required),
            degree: new FormControl('', Validators.required),
            nameOfAccused: new FormControl('', Validators.required),
            judgment: new FormControl('', Validators.required),
            jurisdiction: new FormControl('', Validators.required),
            decisionOfJurisdiction: new FormControl('', Validators.required),
            amountAtStake: new FormControl('', Validators.required),
            motivation: new FormControl('', Validators.required),
            content: new FormControl('', Validators.required),
            stateFolder: new FormControl('', Validators.required),
            // level: new FormControl('', Validators.required),
            dateAppeal: new FormControl('', Validators.required),
            dateOfJudment: new FormControl('', Validators.required),
            domain: new FormControl('', Validators.required)
        });
    }

    getJurisdictions() {
        this._jurisdictionsService.findAllByForAppeal().subscribe(value => {
            this.jurisdictions = value['response'];
        }, error => console.log(error));
    }

    getLocalities() {
        this._localitiesService.getAll().subscribe(value => {
            this.localities = value['response'];
            this.regions = this.localities.filter(value1 => value1.levelSup === null);
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
        this.stateTabActive = true;
    }

    findDomainSelected(value) {
        this.getDomainById(value);
    }

    onChangeDate(e) {
        this.minDate = new Date(e.value);
    }

    choiceJudment(value) {
        this.judmentChoice = value;
    }

    choiceState(value) {
        this.stateSelected = value;
        this.dateTabActive = true;
        if (value === 'IN_PROGRESS') {
            this.appealForm.get('judgment').setValue(this.judments[0]);
        } else {
            this.appealForm.get('judgment').setValue('');
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

    save() {
        this._spinnerService.show();
        this.appeal = new Appeal();
        this.appeal = this.appealForm.getRawValue();
        this.appeal.legalFolder = this.legalFolder;
        this.appeal.level = this.locality;
        this.appeal.domain = this.domain;
        this.appeal.jurisdiction = this.jurisdiction;
        this._appealOnFolderService.create(this.appeal).subscribe(data => {
            if (data['status'] === 'OK') {
                this._toastr.success(data['message']);
                this._router.navigateByUrl('/main/corryptometer/appeals').then(r => {
                    if (r) {
                        this._spinnerService.hide();
                    } else {
                        console.log('La navigation a échoué!');
                    }
                });
            } else {
                this._spinnerService.hide();
                this._toastr.error(data['message']);
            }
        });
    }

}
