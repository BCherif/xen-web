import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable, Subject} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {InterpellationService} from './interpellation.service';
import {ElectedsService} from '../../trueometer/electeds/electeds.service';
import {CALL_AS, CATEGORY, ORGAN_CALL, SUB_CATEGORY} from '../../../data/enums/enums';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Interpellation} from '../../../data/models/interpellation.model';
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
import {SearchLevelEntity} from '../../../utils/search-level-entity';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';

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

    members: any = [];
    allMembers: any[] = [];

    organs: any = [];
    allOrgans: any[] = [];

    filteredMembers: Observable<any[]>;
    filteredOrgans: Observable<any[]>;

    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = false;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    @ViewChild('electedInput') electedInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    @ViewChild('organInput') organInput: ElementRef<HTMLInputElement>;


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

        this.filteredMembers = this.interpellationForm.get('electeds').valueChanges.pipe(
            startWith(''),
            map((value: any | null) => value ? this._filterElected(value) : this.allMembers.slice()));

        this.filteredOrgans = this.interpellationForm.get('organs').valueChanges.pipe(
            startWith(''),
            map((value: any | null) => value ? this._filterOrgan(value) : this.allOrgans.slice()));

        // Subscribe to update interpellation on changes
        this._interpellationService.onInterpellationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(interpellation => {

                if (interpellation) {
                    this.organCallSelected = interpellation.organCall;
                    if (interpellation.organCall === 'ELECTED') {
                        this.getElecteds(interpellation?.article?.level?.id);
                        this.interpellationForm.get('electeds').setValue(interpellation.electeds);
                        this.members = interpellation.electeds;
                    } else {
                        this.interpellationForm.get('organs').setValue(interpellation.organs);
                        this.organs = interpellation.organs;
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
                    this.interpellationForm.get('region').setValue(interpellation?.article?.level?.id);
                    this.interpellationForm.get('circle').setValue(interpellation?.article?.level?.id);
                    this.interpellationForm.get('town').setValue(interpellation?.article?.level?.id);
                    this.interpellationForm.get('vfq').setValue(interpellation?.article?.level?.id);
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
            description: new FormControl('', Validators.required),
            callAs: new FormControl('', Validators.required),
            electeds: new FormControl(''),
            organs: new FormControl(''),
            region: new FormControl(''),
            circle: new FormControl(''),
            town: new FormControl(''),
            vfq: new FormControl(''),
            domain: new FormControl('', Validators.required),
            article: new FormControl('')
        });
    }

    getElecteds(id: number) {
        this._electedsService.findAllByLevelId(id).subscribe(value => {
            this.allMembers = value['response'];
        }, error => console.log(error));
    }

    addElected(event: MatChipInputEvent): void {
        debugger
        const input = event.input;
        const value = event.value;
        // Add our elected
        if ((value || '').trim()) {
            this.members.push({
                id: null,
                fullName: value.trim()
            });
        }
        // Reset the input value
        if (input) {
            input.value = '';
        }
        this.interpellationForm.get('electeds').setValue(null);
    }

    remove(elected, index): void {
        this.members.splice(index, 1);
    }

    selectedEledted(event: MatAutocompleteSelectedEvent): void {
        this.members.push(event.option.value);
        this.electedInput.nativeElement.value = '';
        this.interpellationForm.get('electeds').setValue(null);
    }

    private _filterElected(value: any): any[] {
        return this.allMembers.filter(elected => elected.fullName.includes(value));
    }

    getOrgans() {
        this._organsService.getAll().subscribe(value => {
            this.allOrgans = value['response'];
        }, error => console.log(error));
    }

    addOrgan(event: MatChipInputEvent): void {
        debugger
        const input = event.input;
        const value = event.value;
        // Add our elected
        if ((value || '').trim()) {
            this.organs.push({
                id: null,
                name: value.trim()
            });
        }
        // Reset the input value
        if (input) {
            input.value = '';
        }
        this.interpellationForm.get('organs').setValue(null);
    }

    removeOrgan(organ, index): void {
        this.organs.splice(index, 1);
    }

    selectedOrgan(event: MatAutocompleteSelectedEvent): void {
        this.organs.push(event.option.value);
        this.organInput.nativeElement.value = '';
        this.interpellationForm.get('organs').setValue(null);
    }

    private _filterOrgan(value: any): any[] {
        return this.allOrgans.filter(organ => organ.name.includes(value));
    }

    getLocalities() {
        this._localitiesService.getAll().subscribe(value => {
            this.localities = value['response'];
            this.regions = this.localities.filter(value1 => value1.levelSup === null);
        }, error => console.log(error));
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
        this.findByLocalitySelected(value);
        this.getCircles(value);

    }

    onCircleChange(event) {
        this.circleId = event;
        this.findByLocalitySelected(event);
        this.getTows(event);
    }

    onTownChange(event) {
        this.towId = event;
        this.findByLocalitySelected(event);
        this.getVfqs(event);
    }

    onVFQChange(event) {
        this.findByLocalitySelected(event);
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
            this.interpellation.electeds = this.members;
            this.interpellation.organs = [];
        } else {
            this.interpellation.organs = this.organs;
            this.interpellation.electeds = [];
        }
        this.interpellation.organCall = this.interpellationForm.get('organCall').value;
        this.article.user = this.currentUser;
        this.article.title = this.interpellationForm.get('title').value;
        this.article.id = this.interpellationForm.get('article').value;
        this.article.description = this.interpellationForm.get('description').value;
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
                    this._spinnerService.hide();
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
                    this._spinnerService.hide();
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
