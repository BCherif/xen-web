import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import {Verification} from "../../../data/models/verification.model";
import {ElectedsService} from "../electeds/electeds.service";
import {CategoriesService} from "../../setting/categories/categories.service";
import {Elected} from "../../../data/models/elected.model";
import {Category} from "../../../data/models/category.model";
import {JUDGMENT} from "../../../data/enums/enums";
import {VerificationDetailsService} from './verification-details.service';

@Component({
    selector     : 'trueometer-verification-details',
    templateUrl  : './verification-details.component.html',
    styleUrls    : ['./verification-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class VerificationDetailsComponent implements OnInit, OnDestroy
{
    verification: Verification;
    elected: Elected;
    electeds: Elected[];
    category: Category;
    categories: Category[];
    verificationForm: FormGroup;
    judements: any[];
    judmentEnum = JUDGMENT;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {VerificationDetailsService} _verificationDetailsService
     * @param _electedsService
     * @param _categoriesService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _verificationDetailsService: VerificationDetailsService,
        private _electedsService: ElectedsService,
        private _categoriesService: CategoriesService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar
    )
    {
        // Set the default
        this.verification = new Verification();

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
        this.judements = Object.keys(this.judmentEnum);
        this.getCategories();
        this.getElecteds();
        this.createVerificationDetailsForm();
        // Subscribe to update verification on changes
        this._verificationDetailsService.onVerificationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(verificationDetails => {

                if ( verificationDetails )
                {
                    this.getElectedById(verificationDetails.elected.id);
                    this.getCategoryById(verificationDetails.category.id);
                    this.verificationForm.get('id').setValue(verificationDetails.id);
                    this.verificationForm.get('label').setValue(verificationDetails.label);
                    this.verificationForm.get('content').setValue(verificationDetails.content);
                    this.verificationForm.get('reason').setValue(verificationDetails.reason);
                    this.verificationForm.get('judgment').setValue(verificationDetails.judgment);
                    this.verificationForm.get('elected').setValue(verificationDetails.elected.id);
                    this.verificationForm.get('category').setValue(verificationDetails.category.id);
                    this.verification = new Verification(verificationDetails);
                }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create verificationDetails form
     *
     * @returns {FormGroup}
     */
    createVerificationDetailsForm(){
        this.verificationForm = this._formBuilder.group({
            id: new FormControl(''),
            label: new FormControl('', Validators.required),
            content: new FormControl('', Validators.required),
            reason: new FormControl('', Validators.required),
            judgment: new FormControl('', Validators.required),
            elected: new FormControl('', Validators.required),
            category: new FormControl('', Validators.required)
        });
    }

    getElecteds(){
        this._electedsService.getAll().subscribe(value => {
            this.electeds= value['response'];
        }, error => console.log(error))
    }

    getCategories() {
        this._categoriesService.getAll().subscribe(value => {
            this.categories = value['response'];
        }, error => console.log(error))
    }

    getElectedById(id: number) {
        this._electedsService.getById(id).subscribe(value => {
            this.elected = value['response'];
        },error => console.log(error))
    }

    getCategoryById(id: number) {
        this._categoriesService.getById(id).subscribe(value => {
            this.category = value['response'];
        },error => console.log(error))
    }

    findByElectedSelected(value) {
        this.getElectedById(value);
    }

    findCategorySelected(value) {
        this.getCategoryById(value);
    }

}
