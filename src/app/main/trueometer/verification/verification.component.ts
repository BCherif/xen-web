import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import {Verification} from "../../../data/models/verification.model";
import {VerificationService} from "./verification.service";
import {ElectedsService} from "../electeds/electeds.service";
import {CategoriesService} from "../../setting/categories/categories.service";
import {Elected} from "../../../data/models/elected.model";
import {Category} from "../../../data/models/category.model";
import {JUDGMENT} from "../../../data/enums/enums";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {VerificationSaveEntity} from '../../../data/wrapper/verification.save.entity.model';

@Component({
    selector     : 'trueometer-verification',
    templateUrl  : './verification.component.html',
    styleUrls    : ['./verification.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class VerificationComponent implements OnInit, OnDestroy
{
    verificationSaveEntity: VerificationSaveEntity;
    verification: Verification;
    elected: Elected;
    electeds: Elected[];
    category: Category;
    categories: Category[];
    pageType: string;
    verificationForm: FormGroup;
    judements: any[];
    judmentEnum = JUDGMENT;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {VerificationService} _verificationService
     * @param _electedsService
     * @param _categoriesService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param _toastr
     * @param _router
     */
    constructor(
        private _verificationService: VerificationService,
        private _electedsService: ElectedsService,
        private _categoriesService: CategoriesService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _router: Router
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
        this.createVerificationForm();
        this.getCategories();
        this.getElecteds();
        // Subscribe to update verification on changes
        this._verificationService.onVerificationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(verification => {

                if ( verification )
                {
                    this.getElectedById(verification.elected.id);
                    this.getCategoryById(verification.category.id);
                    this.verificationForm.get('id').setValue(verification.id);
                    this.verificationForm.get('label').setValue(verification.label);
                    this.verificationForm.get('content').setValue(verification.content);
                    this.verificationForm.get('reason').setValue(verification.reason);
                    this.verificationForm.get('judgment').setValue(verification.judgment);
                    this.verificationForm.get('elected').setValue(verification.elected.id);
                    this.verificationForm.get('category').setValue(verification.category.id);
                    this.verification = new Verification(verification);
                    this.pageType = 'edit';
                }
                else
                {
                    this.pageType = 'new';
                    this.verification = new Verification();
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
     * Create verification form
     *
     * @returns {FormGroup}
     */
    createVerificationForm(){
        this.verificationForm = this._formBuilder.group({
            id: new FormControl(''),
            label: new FormControl(''),
            content: new FormControl('', Validators.required),
            reason: new FormControl(''),
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

    saveOrUpdate() {
        this.verificationSaveEntity = new VerificationSaveEntity();
        this.verification = this.verificationForm.getRawValue();
        this.verification.elected = this.elected;
        this.verification.category = this.category;
        this.verificationSaveEntity.verification = this.verification;
        if (!this.verification.id) {
            this._verificationService.create(this.verificationSaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/trueometer/verifications');
                } else {
                    this._toastr.error(data['message']);
                }
            });
        } else {
            this._verificationService.update(this.verificationSaveEntity).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/trueometer/verifications');
                } else {
                    this._toastr.error(data['message']);
                }
            });
        }
    }

}
