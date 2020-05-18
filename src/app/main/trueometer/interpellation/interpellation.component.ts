import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {InterpellationService} from './interpellation.service';
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
    selector: 'trueometer-interpellation',
    templateUrl: './interpellation.component.html',
    styleUrls: ['./interpellation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class InterpellationComponent implements OnInit, OnDestroy {
    interpellation: Interpellation;
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
     * @param {InterpellationService} _interpellationService
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
        private _interpellationService: InterpellationService,
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
        this.interpellation = new Interpellation();

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
        this._interpellationService.onInterpellationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(interpellation => {

                if (interpellation) {
                    if (interpellation.elected) {
                        this.getElectedById(interpellation.elected.id);
                        this.interpellationForm.get('elected').setValue(interpellation.elected.id);                    }
                    if (interpellation.organ) {
                        this.getOrganById(interpellation.organ.id);
                        this.interpellationForm.get('organ').setValue(interpellation.organ.id);
                    }
                   /* this.getCategoryById(interpellation.category.id);
                    this.interpellationForm.get('id').setValue(interpellation.id);
                    this.interpellationForm.get('subject').setValue(interpellation.subject);
                    this.interpellationForm.get('content').setValue(interpellation.content);
                    this.interpellationForm.get('organCall').setValue(interpellation.organCall);
                    this.interpellationForm.get('callAs').setValue(interpellation.callAs);
                    this.interpellationForm.get('category').setValue(interpellation.category.id);*/
                    this.interpellation = new Interpellation(interpellation);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.interpellation = new Interpellation();
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

   /* saveOrUpdate() {
        this.interpellation = new Interpellation();
        this.interpellation = this.interpellationForm.getRawValue();
        this.interpellation.elected = this.elected;
        this.interpellation.category = this.category;
        this.interpellation.organ = this.organ;
        if (!this.interpellation.id) {
            this._interpellationService.create(this.interpellation).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/trueometer/interpellations');
                } else {
                    this._toastr.error(data['message']);
                }
            });
        } else {
            this._interpellationService.update(this.interpellation).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/trueometer/interpellations');
                } else {
                    this._toastr.error(data['message']);
                }
            }, error => {
                // console.log(error);
            });
        }
    }*/

    getOrganChoice(value) {
        this.organCallSelected = value;
    }
}
