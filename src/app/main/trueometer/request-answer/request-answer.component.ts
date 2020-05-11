import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import {Verification} from "../../../data/models/verification.model";
import {RequestAnswerService} from "./request-answer.service";
import {ElectedsService} from "../electeds/electeds.service";
import {CategoriesService} from "../../setting/categories/categories.service";
import {Elected} from "../../../data/models/elected.model";
import {Category} from "../../../data/models/category.model";
import {JUDGMENT} from "../../../data/enums/enums";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {Request} from '../../../data/models/request.model';
import {VerificationSaveEntity} from '../../../data/wrapper/verification.save.entity.model';
import {RequestService} from '../request/request.service';
import {VerificationService} from '../verification/verification.service';

@Component({
    selector     : 'trueometer-verification',
    templateUrl  : './request-answer.component.html',
    styleUrls    : ['./request-answer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class RequestAnswerComponent implements OnInit, OnDestroy
{
    verificationSaveEntity: VerificationSaveEntity;
    verification: Verification;
    requestAnswer: Request;
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
     * @param {RequestAnswerService} _requestAnswerService
     * @param _electedsService
     * @param _requestService
     * @param _categoriesService
     * @param _verificationService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param _toastr
     * @param _router
     */
    constructor(
        private _requestAnswerService: RequestAnswerService,
        private _electedsService: ElectedsService,
        private _requestService: RequestService,
        private _categoriesService: CategoriesService,
        private _verificationService: VerificationService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _router: Router
    )
    {
        // Set the default
        this.verificationSaveEntity = new VerificationSaveEntity();

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
        this.createVerificationForm();
        // Subscribe to update verification on changes
        this._requestAnswerService.onRequestChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(requestAnswer => {

                if ( requestAnswer )
                {
                    this.getRequestAnswerById(requestAnswer.id);
                    this.getElectedById(requestAnswer.elected.id);
                    this.getCategoryById(requestAnswer.category.id);
                    this.verificationForm.get('id').setValue('');
                    this.verificationForm.get('label').setValue(requestAnswer.subject);
                    this.verificationForm.get('content').setValue(requestAnswer.content);
                    this.verificationForm.get('reason').setValue('');
                    this.verificationForm.get('judgment').setValue('');
                    this.verificationForm.get('elected').setValue(requestAnswer.elected.id);
                    this.verificationForm.get('category').setValue(requestAnswer.category.id);
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

    getRequestAnswerById(id: number) {
        this._requestService.getById(id).subscribe(value => {
            this.requestAnswer = value['response'];
        },error => console.log(error))
    }

    findByElectedSelected(value) {
        this.getElectedById(value);
    }

    findCategorySelected(value) {
        this.getCategoryById(value);
    }

    save() {
        this.verificationSaveEntity = new VerificationSaveEntity();
        this.verification = this.verificationForm.getRawValue();
        this.verification.elected = this.elected;
        this.verification.category = this.category;
        this.verificationSaveEntity.verification = this.verification;
        this.verificationSaveEntity.request = this.requestAnswer;
        this._verificationService.create(this.verificationSaveEntity).subscribe(data => {
            if (data['status'] === 'OK') {
                this._toastr.success(data['message']);
                this._router.navigateByUrl('/main/trueometer/verifications');
            } else {
                this._toastr.error(data['message']);
            }
        });
    }

}
