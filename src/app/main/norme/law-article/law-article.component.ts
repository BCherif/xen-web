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
import {LawArticle} from '../../../data/models/law.article.model';
import {LawService} from '../law/law.service';
import {LawArticleService} from './law-article.service';

@Component({
    selector     : 'norme-law-article',
    templateUrl  : './law-article.component.html',
    styleUrls    : ['./law-article.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LawArticleComponent implements OnInit, OnDestroy
{
    law: Law;
    lawArticle: LawArticle;
    laws: Law[];
    pageType: string;
    lawArticleForm: FormGroup;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param _lawService
     * @param _lawArticleService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param _toastr
     * @param _router
     */
    constructor(
        private _lawService: LawService,
        private _lawArticleService: LawArticleService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _router: Router
    )
    {
        // Set the default
        this.lawArticle = new LawArticle();

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
        this.createlawArticleForm();
        this.getLaws();
        // Subscribe to update law on changes
        this._lawArticleService.onLawArticleChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(lawArticle => {

                if ( lawArticle )
                {
                    this.getLawById(lawArticle.law.id);
                    this.lawArticleForm.get('id').setValue(lawArticle.id);
                    this.lawArticleForm.get('name').setValue(lawArticle.name);
                    this.lawArticleForm.get('content').setValue(lawArticle.content);
                    this.lawArticleForm.get('law').setValue(lawArticle.law.id);
                    this.lawArticle = new LawArticle(lawArticle);
                    this.pageType = 'edit';
                }
                else
                {
                    this.pageType = 'new';
                    this.lawArticle = new LawArticle();
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
     * Create lawArticle form
     *
     * @returns {FormGroup}
     */
    createlawArticleForm(){
        this.lawArticleForm = this._formBuilder.group({
            id: new FormControl(''),
            name: new FormControl('',Validators.required),
            content: new FormControl('', Validators.required),
            law: new FormControl('', Validators.required)
        });
    }
    
    getLaws() {
        this._lawService.getAll().subscribe(value => {
            this.laws = value['response'];
        }, error => console.log(error))
    }

    getLawById(id: number) {
        this._lawService.getById(id).subscribe(value => {
            this.law = value['response'];
        },error => console.log(error))
    }

    
    findLawSelected(value) {
        this.getLawById(value);
    }

    saveOrUpdate() {
        this.lawArticle = new LawArticle();
        this.lawArticle = this.lawArticleForm.getRawValue();
        this.lawArticle.law = this.law;
        if (!this.lawArticle.id) {
            this._lawArticleService.create(this.lawArticle).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/norme/law-articles');
                } else {
                    this._toastr.error(data['message']);
                }
            });
        } else {
            this._lawArticleService.update(this.lawArticle).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/norme/law-articles');
                } else {
                    this._toastr.error(data['message']);
                }
            });
        }
    }

}
