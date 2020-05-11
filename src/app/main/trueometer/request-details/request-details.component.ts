import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import {ElectedsService} from "../electeds/electeds.service";
import {CategoriesService} from "../../setting/categories/categories.service";
import {Elected} from "../../../data/models/elected.model";
import {Category} from "../../../data/models/category.model";
import {Request} from '../../../data/models/request.model';
import {RequestDetailsService} from './request-details.service';

@Component({
    selector     : 'trueometer-request-details',
    templateUrl  : './request-details.component.html',
    styleUrls    : ['./request-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class RequestDetailsComponent implements OnInit, OnDestroy
{
    requestDetails: Request;
    elected: Elected;
    electeds: Elected[];
    category: Category;
    categories: Category[];
    pageType: string;
    requestForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {RequestDetailsService} _requestDetailsService
     * @param _electedsService
     * @param _categoriesService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _requestDetailsService: RequestDetailsService,
        private _electedsService: ElectedsService,
        private _categoriesService: CategoriesService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar
    )
    {
        // Set the default
        this.requestDetails = new Request();

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
        this.createRequestForm();
        this.getCategories();
        this.getElecteds();
        // Subscribe to update request on changes
        this._requestDetailsService.onRequestDetailsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(requestDetails => {
                if ( requestDetails )
                {
                    this.getElectedById(requestDetails.elected.id);
                    this.getCategoryById(requestDetails.category.id);
                    this.requestForm.get('id').setValue(requestDetails.id);
                    this.requestForm.get('content').setValue(requestDetails.content);
                    this.requestForm.get('newSource').setValue(requestDetails.newSource);
                    this.requestForm.get('subject').setValue(requestDetails.subject);
                    this.requestForm.get('elected').setValue(requestDetails.elected.id);
                    this.requestForm.get('category').setValue(requestDetails.category.id);
                    this.requestDetails = new Request(requestDetails);
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
     * Create request form
     *
     * @returns {FormGroup}
     */
    createRequestForm(){
        this.requestForm = this._formBuilder.group({
            id: new FormControl(''),
            content: new FormControl('', Validators.required),
            subject: new FormControl(''),
            newSource: new FormControl('', Validators.required),
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
