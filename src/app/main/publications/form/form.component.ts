import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {Quiz} from '../../../data/models/quiz.model';
import {FormService} from './form.service';
import {Form} from '../../../data/models/form.model';
import {FormSaveEntity} from '../../../data/wrapper/form.save.entity.model';
import {CATEGORY_FORM} from '../../../data/enums/enums';

@Component({
    selector     : 'publications-form',
    templateUrl  : './form.component.html',
    styleUrls    : ['./form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FormComponent implements OnInit, OnDestroy
{
    form: Form;
    quizs: Quiz[] = [];
    categoryForm = CATEGORY_FORM;
    categories : any[];
    formSaveEntity: FormSaveEntity;
    pageType: string;
    crudForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormService} _formService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param _toastr
     * @param _router
     */
    constructor(
        private _formService: FormService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _router: Router
    )
    {
        // Set the default
        this.form = new Form();

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
        this.categories = Object.keys(this.categoryForm);
        this.createForm();
        // Subscribe to update request on changes
        this._formService.onFormChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(form => {
                if ( form )
                {
                    this.form = new Form(form);
                    this.pageType = 'edit';
                }
                else
                {
                    this.pageType = 'new';
                    this.form = new Form();
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
     * Create form
     *
     * @returns {FormGroup}
     */
    createForm(){
        this.crudForm = this._formBuilder.group({
            id: new FormControl(''),
            name: new FormControl('', Validators.required),
            categoryForm: new FormControl('')
        });
        this.addNewRow();
    }

    delete(i: number){
        this.quizs.splice(i,1);
    }

    addNewRow() {
        let size = this.quizs.length;
        let newQuiz = new Quiz();
        this.quizs.splice(size+1,0,newQuiz);
    }

    save() {
        this.form = new Form();
        this.formSaveEntity = new FormSaveEntity();
        this.form = this.crudForm.getRawValue();
        this.formSaveEntity.form = this.form;
        this.formSaveEntity.quizList = this.quizs;
        this._formService.create(this.formSaveEntity).subscribe(data=>{
            if (data['status'] === 'OK') {
                this._toastr.success(data['message']);
                this._router.navigateByUrl('/main/publications/forms');
            } else {
                this._toastr.error(data['message']);
            }
        })
    }

}
