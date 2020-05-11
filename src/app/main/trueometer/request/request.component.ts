import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import {RequestService} from "./request.service";
import {ElectedsService} from "../electeds/electeds.service";
import {CategoriesService} from "../../setting/categories/categories.service";
import {Elected} from "../../../data/models/elected.model";
import {Category} from "../../../data/models/category.model";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {Request} from '../../../data/models/request.model';

@Component({
    selector     : 'trueometer-request',
    templateUrl  : './request.component.html',
    styleUrls    : ['./request.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class RequestComponent implements OnInit, OnDestroy
{
    request: Request;
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
     * @param {RequestService} _requestService
     * @param _electedsService
     * @param _categoriesService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param _toastr
     * @param _router
     */
    constructor(
        private _requestService: RequestService,
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
        this.request = new Request();

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
        this._requestService.onRequestChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(request => {
                if ( request )
                {
                    this.getElectedById(request.elected.id);
                    this.getCategoryById(request.category.id);
                    this.requestForm.get('id').setValue(request.id);
                    this.requestForm.get('content').setValue(request.content);
                    this.requestForm.get('newSource').setValue(request.newSource);
                    this.requestForm.get('subject').setValue(request.subject);
                    this.requestForm.get('elected').setValue(request.elected.id);
                    this.requestForm.get('category').setValue(request.category.id);
                    this.request = new Request(request);
                    this.pageType = 'edit';
                }
                else
                {
                    this.pageType = 'new';
                    this.request = new Request();
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

    saveOrUpdate() {
        this.request = new Request();
        this.request = this.requestForm.getRawValue();
        this.request.elected = this.elected;
        this.request.category = this.category;
        if (!this.request.id) {
            this._requestService.create(this.request).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/trueometer/requests');
                } else {
                    this._toastr.error(data['message']);
                }
            });
        } else {
            this._requestService.update(this.request).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/trueometer/requests');
                } else {
                    this._toastr.error(data['message']);
                }
            }, error => {
                // console.log(error);
            });
        }
    }

}
