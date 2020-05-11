import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {Law} from '../../../data/models/law.model';
import {LawCategory} from '../../../data/models/law.category.model';
import {LawCategoriesService} from '../law-categories/law-categories.service';
import {LawService} from './law.service';

@Component({
    selector     : 'norme-law',
    templateUrl  : './law.component.html',
    styleUrls    : ['./law.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LawComponent implements OnInit, OnDestroy
{
    law: Law;
    lawCategory: LawCategory;
    lawCategories: LawCategory[];
    pageType: string;
    lawForm: FormGroup;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param _lawService
     * @param _lawCategoriesService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param _toastr
     * @param _router
     */
    constructor(
        private _lawService: LawService,
        private _lawCategoriesService: LawCategoriesService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _router: Router
    )
    {
        // Set the default
        this.law = new Law();

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
        this.createLawForm();
        this.getLawCategories();
        // Subscribe to update law on changes
        this._lawService.onLawChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(law => {

                if ( law )
                {
                    this.getLawCategoryById(law.lawCategory.id);
                    this.lawForm.get('id').setValue(law.id);
                    this.lawForm.get('name').setValue(law.name);
                    this.lawForm.get('content').setValue(law.content);
                    this.lawForm.get('lawCategory').setValue(law.lawCategory.id);
                    this.law = new Law(law);
                    this.pageType = 'edit';
                }
                else
                {
                    this.pageType = 'new';
                    this.law = new Law();
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
     * Create law form
     *
     * @returns {FormGroup}
     */
    createLawForm(){
        this.lawForm = this._formBuilder.group({
            id: new FormControl(''),
            name: new FormControl('',Validators.required),
            content: new FormControl('', Validators.required),
            lawCategory: new FormControl('', Validators.required)
        });
    }
    
    getLawCategories() {
        this._lawCategoriesService.getAll().subscribe(value => {
            this.lawCategories = value['response'];
        }, error => console.log(error))
    }

    getLawCategoryById(id: number) {
        this._lawCategoriesService.getById(id).subscribe(value => {
            this.lawCategory = value['response'];
        },error => console.log(error))
    }

    
    findLawCategorySelected(value) {
        this.getLawCategoryById(value);
    }

    saveOrUpdate() {
        this.law = new Law();
        this.law = this.lawForm.getRawValue();
        this.law.lawCategory = this.lawCategory;
        if (!this.law.id) {
            this._lawService.create(this.law).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/norme/laws');
                } else {
                    this._toastr.error(data['message']);
                }
            });
        } else {
            this._lawService.update(this.law).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/norme/laws');
                } else {
                    this._toastr.error(data['message']);
                }
            });
        }
    }

}
