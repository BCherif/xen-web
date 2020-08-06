import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable, Subject} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {CS_JUDGMENT, DEGREE, STATE_FOLDER} from '../../../data/enums/enums';
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
import {ProvideOnFolderService} from './provide-on-folder.service';
import {LegalFolderService} from '../legal-folder/legal-folder.service';
import {Provide} from '../../../data/models/provide.model';
import {SearchLevelEntity} from '../../../utils/search-level-entity';

@Component({
    selector: 'corryptometer-provide-on-folder',
    templateUrl: './provide-on-folder.component.html',
    styleUrls: ['./provide-on-folder.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ProvideOnFolderComponent implements OnInit, OnDestroy {
    legalFolder: LegalFolder;
    provide: Provide;
    stateTabActive = false;
    dateTabActive = false;
    pageType: string;
    provideForm: FormGroup;
    judment = CS_JUDGMENT;
    judments: any[];
    statefolder = STATE_FOLDER;
    judmentChoice: any;
    statefolders: any[];
    degree = DEGREE;
    stateSelected: any;
    degrees: any[];
    domains: Domain[];
    domain: Domain;
    localities: Locality[];
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
     * @param _provideOnFolderService
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
        private _provideOnFolderService: ProvideOnFolderService,
        private _legalFolderService: LegalFolderService,
        private _localitiesService: LocalitiesService,
        private _jurisdictionsService: JurisdictionsService,
        private _domainsService: DomainsService,
        private _router: Router,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the default
        this.provide = new Provide();
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
        this.statefolders = Object.keys(this.statefolder);
        this.degrees = Object.keys(this.degree);
        this.judments = Object.keys(this.judment);
        this.createProvideForm();
        this.getLocalities();
        this.getJurisdictions();
        this.getDomains();
        /* this.filteredOptions = this.provideForm.get('level').valueChanges
             .pipe(
                 startWith(''),
                 map(value => typeof value === 'string' ? value : value.name),
                 map(name => name ? this._filter(name) : this.localities.slice())
             );*/
        // Subscribe to update interpellation on changes
        this._provideOnFolderService.onLegalFolderChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(legalFolder => {

                if (legalFolder) {
                    this.legalFolder = legalFolder;
                    this.getJurisdictionById(legalFolder?.jurisdiction?.id);
                    this.getDomainById(legalFolder?.article?.domain?.id);
                    this.getLocalityById(legalFolder?.article?.level?.id);
                    this.provideForm.get('id').setValue('');
                    this.provideForm.get('degree').setValue(this.degrees[0]);
                    this.provideForm.get('nameOfAccused').setValue(legalFolder?.nameOfAccused);
                    this.provideForm.get('title').setValue(legalFolder?.article?.title);
                    this.provideForm.get('decisionOfJurisdiction').setValue('');
                    this.provideForm.get('amountAtStake').setValue('');
                    this.provideForm.get('motivation').setValue('');
                    this.provideForm.get('stateFolder').setValue('');
                    this.provideForm.get('dateProvide').setValue('');
                    this.provideForm.get('dateOfJudment').setValue('');
                    this.provideForm.get('jurisdiction').setValue('');
                    this.provideForm.get('judgment').setValue('');
                    // this.provideForm.get('level').setValue(legalFolder?.article?.level?.id);
                    this.provideForm.get('domain').setValue(legalFolder?.article?.domain?.id);
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
     * Create provide form
     *
     * @returns {FormGroup}
     */
    createProvideForm() {
        this.provideForm = this._formBuilder.group({
            id: new FormControl(''),
            title: new FormControl('', Validators.required),
            degree: new FormControl('', Validators.required),
            nameOfAccused: new FormControl('', Validators.required),
            judgment: new FormControl('', Validators.required),
            jurisdiction: new FormControl('', Validators.required),
            decisionOfJurisdiction: new FormControl('', Validators.required),
            amountAtStake: new FormControl('', Validators.required),
            motivation: new FormControl('', Validators.required),
            stateFolder: new FormControl('', Validators.required),
            // level: new FormControl('', Validators.required),
            dateProvide: new FormControl('', Validators.required),
            dateOfJudment: new FormControl('', Validators.required),
            domain: new FormControl('', Validators.required)
        });
    }

    getJurisdictions() {
        this._jurisdictionsService.findAllByForProvide().subscribe(value => {
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
            this.provideForm.get('judgment').setValue(this.judments[0]);
        } else {
            this.provideForm.get('judgment').setValue('');
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
        this.provide = new Provide();
        this.provide = this.provideForm.getRawValue();
        this.provide.legalFolder = this.legalFolder;
        this.provide.level = this.locality;
        this.provide.domain = this.domain;
        this.provide.jurisdiction = this.jurisdiction;
        this._provideOnFolderService.create(this.provide).subscribe(data => {
            if (data['status'] === 'OK') {
                this._toastr.success(data['message']);
                this._router.navigateByUrl('/main/corryptometer/provides').then(r => {
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
