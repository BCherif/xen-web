import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {InterpellationDetailsService} from './interpellation-details.service';
import {ElectedsService} from '../electeds/electeds.service';
import {CategoriesService} from '../../setting/categories/categories.service';
import {Elected} from '../../../data/models/elected.model';
import {Category} from '../../../data/models/category.model';
import {CALL_AS, ORGAN_CALL} from '../../../data/enums/enums';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Interpellation} from '../../../data/models/interpellation.model';
import {Organ} from '../../../data/models/organ.model';
import {OrgansService} from '../organs/organs.service';

@Component({
    selector: 'trueometer-interpellation-details',
    templateUrl: './interpellation-details.component.html',
    styleUrls: ['./interpellation-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class InterpellationDetailsComponent implements OnInit, OnDestroy {
    interpellationDetails: Interpellation;
    elected: Elected;
    electeds: Elected[];
    category: Category;
    categories: Category[];
    organ: Organ;
    organs: Organ[];
    pageType: string;
    interpellationForm: FormGroup;
    asCalls: any[];
    callAs = CALL_AS;
    organCalls: any[];
    organCall = ORGAN_CALL;
    organCallSelected: any;


    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {InterpellationDetailsService} _interpellationDetailsService
     * @param _electedsService
     * @param _categoriesService
     * @param _organsService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param _toastr
     * @param _router
     */
    constructor(
        private _interpellationDetailsService: InterpellationDetailsService,
        private _electedsService: ElectedsService,
        private _categoriesService: CategoriesService,
        private _organsService: OrgansService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _router: Router
    ) {
        // Set the default
        this.interpellationDetails = new Interpellation();

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
        this.createInterpellationForm();
        this.getCategories();
        this.getElecteds();
        this.getOrgans();
        // Subscribe to update interpellation on changes
        this._interpellationDetailsService.onInterpellationDetailsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(interpellationDetails => {

                if (interpellationDetails) {
                    if (interpellationDetails.elected) {
                        this.getElectedById(interpellationDetails.elected.id);
                        this.interpellationForm.get('elected').setValue(interpellationDetails.elected.id);                    }
                    if (interpellationDetails.organ) {
                        this.getOrganById(interpellationDetails.article.category.id);
                        this.interpellationForm.get('organ').setValue(interpellationDetails.organ.id);
                    }
                    this.getCategoryById(interpellationDetails.article.category.id);
                    this.interpellationForm.get('id').setValue(interpellationDetails.id);
                    this.interpellationForm.get('subject').setValue(interpellationDetails.article.subject);
                    this.interpellationForm.get('content').setValue(interpellationDetails.article.content);
                    this.interpellationForm.get('organCall').setValue(interpellationDetails.organCall);
                    this.interpellationForm.get('callAs').setValue(interpellationDetails.callAs);
                    this.interpellationForm.get('category').setValue(interpellationDetails.article.category.id);
                    this.interpellationDetails = new Interpellation(interpellationDetails);
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
            subject: new FormControl(''),
            content: new FormControl('', Validators.required),
            organCall: new FormControl('', Validators.required),
            callAs: new FormControl('', Validators.required),
            elected: new FormControl(''),
            category: new FormControl('', Validators.required),
            organ: new FormControl(''),
        });
    }

    getElecteds() {
        this._electedsService.getAll().subscribe(value => {
            this.electeds = value['response'];
        }, error => console.log(error));
    }

    getCategories() {
        this._categoriesService.getAll().subscribe(value => {
            this.categories = value['response'];
        }, error => console.log(error));
    }

    getOrgans() {
        this._organsService.getAll().subscribe(value => {
            this.organs = value['response'];
        }, error => console.log(error));
    }

    getElectedById(id: number) {
        this._electedsService.getById(id).subscribe(value => {
            this.elected = value['response'];
        }, error => console.log(error));
    }

    getOrganById(id: number) {
        this._organsService.getById(id).subscribe(value => {
            this.organ = value['response'];
        }, error => console.log(error));
    }

    getCategoryById(id: number) {
        this._categoriesService.getById(id).subscribe(value => {
            this.category = value['response'];
        }, error => console.log(error));
    }

    findByElectedSelected(value) {
        this.getElectedById(value);
    }

    findCategorySelected(value) {
        this.getCategoryById(value);
    }

    findOrganSelected(value) {
        this.getOrganById(value);
    }

    getOrganChoice(value) {
        this.organCallSelected = value;
    }
}
