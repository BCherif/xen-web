import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Category} from '../../../data/models/category.model';
import {CategoriesService} from '../categories/categories.service';
import {Domain} from '../../../data/models/domain.model';
import {DomainsService} from '../../setting/domains/domains.service';

@Component({
    selector: 'publications-category-form-dialog',
    templateUrl: './category-form.component.html',
    styleUrls: ['./category-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CategoryFormComponent {
    action: string;
    category: Category;
    categoryForm: FormGroup;
    dialogTitle: string;

    domains: Domain[];
    domain: Domain;

    /**
     * Constructor
     *
     * @param {MatDialogRef<CategoryFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _categoriesService
     * @param _domainsService
     * @param _toastr
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<CategoryFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _categoriesService: CategoriesService,
        private _domainsService: DomainsService,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Modifier une catégorie';
            this.category = _data.category;
        } else {
            this.dialogTitle = 'Ajouter une catégorie';
            this.category = new Category({});
        }

        this.categoryForm = this.createCategoryForm();
        this.getDomains();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create category form
     *
     * @returns {FormGroup}
     */
    createCategoryForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.category.id],
            name: [this.category.name],
            domain: [this.category.domain]
        });
    }

    getDomains() {
        this._domainsService.getAll().subscribe(value => {
            this.domains = value['response'];
        }, error => console.log(error));
    }

    getDomainById(id: number) {
        this._domainsService.getById(id).subscribe(value => {
            this.domain = value['response'];
        }, error => console.log(error));
    }

    findDomainSelected(value) {
        this.getDomainById(value);
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.category = new Category();
        this.category = this.categoryForm.getRawValue();
        this.category.domain = this.domain;
        if (!this.category.id) {
            this._categoriesService.create(this.category).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._categoriesService.getCategories();
                    this._toastr.success(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                }
            });
        } else {
            this._categoriesService.update(this.category).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._categoriesService.getCategories();
                    this._toastr.success(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                }
            });
        }
    }
}
