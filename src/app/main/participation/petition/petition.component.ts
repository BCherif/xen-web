import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable, Subject} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
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
import {NgxSpinnerService} from 'ngx-spinner';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {DecisionMarkerService} from '../../../services/decision.marker.service';
import {MatChipInputEvent} from '@angular/material/chips';
import {SearchLevelEntity} from '../../../utils/search-level-entity';

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

    decisions: any = [];
    allDecisionMakers: any[] = [];
    filteredDecisionMakers: Observable<any[]>;
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = false;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    xensaUtils = new XensaUtils();
    currentUser: User = this.xensaUtils.getAppUser();

    @ViewChild('decisionInput') decisionInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

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
     * @param _spinnerService
     * @param _decisionMarkerService
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _petitionService: PetitionService,
        private _localitiesService: LocalitiesService,
        private _domainsService: DomainsService,
        private _router: Router,
        private _spinnerService: NgxSpinnerService,
        private _decisionMarkerService: DecisionMarkerService
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
        this.getDecisions();
        this.filteredDecisionMakers = this.petitionForm.get('decisionMakers').valueChanges.pipe(
            startWith(''),
            map((value: any | null) => value ? this._filter(value) : this.allDecisionMakers.slice()));

        this._petitionService.onPetitionChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(petition => {

                if (petition) {
                    this.getLocalityById(petition?.article?.level?.id);
                    this.getDomainById(petition?.article?.domain?.id);
                    this.decisions = petition?.decisionMakers;
                    this.petitionForm.get('id').setValue(petition.id);
                    this.petitionForm.get('title').setValue(petition?.article?.title);
                    this.petitionForm.get('objective').setValue(petition?.objective);
                    this.petitionForm.get('petitionContent').setValue(petition?.article?.content);
                    this.petitionForm.get('decisionMakers').setValue(petition?.decisionMakers);
                    this.petitionForm.get('description').setValue(petition?.article?.description);
                    this.petitionForm.get('article').setValue(petition?.article?.id);
                    this.petitionForm.get('domain').setValue(petition?.article?.domain?.id);
                    this.petitionForm.get('region').setValue(petition?.article?.level?.id);
                    this.petitionForm.get('circle').setValue(petition?.article?.level?.id);
                    this.petitionForm.get('town').setValue(petition?.article?.level?.id);
                    this.petitionForm.get('vfq').setValue(petition?.article?.level?.id);
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
            petitionContent: new FormControl('', Validators.required),
            decisionMakers: new FormControl(''),
            region: new FormControl(''),
            circle: new FormControl(''),
            town: new FormControl(''),
            vfq: new FormControl(''),
            domain: new FormControl('', Validators.required),
            objective: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            article: new FormControl('')
        });
    }

    getDecisions() {
        this._decisionMarkerService.findAll().subscribe(value => {
            this.allDecisionMakers = value['response'];
        }, error => console.log(error));
    }

    add(event: MatChipInputEvent): void {
        debugger
        const input = event.input;
        const value = event.value;
        // Add our decisonMarker
        if ((value || '').trim()) {
            this.decisions.push({
                id: null,
                name: value.trim()
            });
        }
        // Reset the input value
        if (input) {
            input.value = '';
        }
        this.petitionForm.get('decisionMakers').setValue(null);
    }

    remove(fruit, indx): void {
        this.decisions.splice(indx, 1);
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.decisions.push(event.option.value);
        this.decisionInput.nativeElement.value = '';
        this.petitionForm.get('decisionMakers').setValue(null);
    }

    private _filter(value: any): any[] {
        return this.allDecisionMakers.filter(decision => decision.name.includes(value));
    }

    getLocalities() {
        this._localitiesService.getAll().subscribe(value => {
            this.localities = value['response'];
            this.regions = this.localities.filter(value1 => value1.levelSup === null);
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


    getLevel(value) {
        this.getLocalityById(value.id);
    }

    findByLocalitySelected(value) {
        this.getLocalityById(value);
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
        this.petition = new Petition();
        this.petitionSaveEntity = new PetitionSaveEntity();
        this.article.ischeck = true;
        this.article.id = this.petitionForm.get('article').value;
        this.article.title = this.petitionForm.get('title').value;
        this.article.content = this.petitionForm.get('petitionContent').value;
        this.article.description = this.petitionForm.get('description').value;
        this.article.category = this.categories[2];
        this.article.subCategory = this.subCategories[6];
        this.petition.decisionMakers = this.decisions;
        this.petition.objective = this.petitionForm.get('objective').value;
        this.article.level = this.locality;
        this.article.domain = this.domain;
        this.petition.id = this.petitionForm.get('id').value;
        this.petition.petitionDate = new Date();
        this.petition.user = this.currentUser;
        this.petitionSaveEntity.article = this.article;
        this.petitionSaveEntity.petition = this.petition;
        if (!this.petition.id) {
            this._petitionService.create(this.petitionSaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/participation/petitions');
                    this._spinnerService.hide();
                } else {
                    this._toastr.error(data['message']);
                    this._spinnerService.hide();
                }
            });
        } else {
            this.petitionSaveEntity.petition.updateDate = new Date();
            this._petitionService.update(this.petitionSaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/participation/petitions');
                    this._spinnerService.hide();
                } else {
                    this._toastr.error(data['message']);
                    this._spinnerService.hide();
                }
            });
        }
    }

}
