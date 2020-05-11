import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Category} from "../../../data/models/category.model";
import {CategoriesService} from "../categories/categories.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector     : 'setting-category-form-dialog',
    templateUrl  : './category-form.component.html',
    styleUrls    : ['./category-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SettingCategoryFormDialogComponent
{
    action: string;
    category: Category;
    categoryForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<SettingCategoryFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _categoriesService
     * @param _toastr
     */
    constructor(
        public matDialogRef: MatDialogRef<SettingCategoryFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _categoriesService: CategoriesService,
        private _toastr: ToastrService,
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Modifier Une Categorie';
            this.category = _data.category;
        }
        else
        {
            this.dialogTitle = 'Ajouter Une Categorie';
            this.category = new Category({});
        }

        this.categoryForm = this.createCategoryForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create category form
     *
     * @returns {FormGroup}
     */
    createCategoryForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.category.id],
            name    : [this.category.name],
            description: [this.category.description]
        });
    }

    saveOrUpdate() {
        this.category = new Category();
        this.category = this.categoryForm.getRawValue();
        if (!this.category.id) {
            this._categoriesService.create(this.category).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._categoriesService.getCategories();
                    this._toastr.success(data['message']);
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                }
            });
        } else {
            this._categoriesService.update(this.category).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._categoriesService.getCategories();
                    this._toastr.success(data['message']);
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                }
            }, error => {
                // console.log(error);
            });
        }
    }
}
