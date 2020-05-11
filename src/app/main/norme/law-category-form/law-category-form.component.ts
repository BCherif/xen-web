import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {LawCategory} from '../../../data/models/law.category.model';
import {LawCategoriesService} from '../law-categories/law-categories.service';

@Component({
    selector     : 'norme-law-category-form-dialog',
    templateUrl  : './law-category-form.component.html',
    styleUrls    : ['./law-category-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SettingLawCategoryFormDialogComponent
{
    action: string;
    lawCategory: LawCategory;
    lawCategoryForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<SettingLawCategoryFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _lawCategoriesService
     * @param _toastr
     */
    constructor(
        public matDialogRef: MatDialogRef<SettingLawCategoryFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _lawCategoriesService: LawCategoriesService,
        private _toastr: ToastrService,
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Modifier Une Categorie';
            this.lawCategory = _data.lawCategory;
        }
        else
        {
            this.dialogTitle = 'Ajouter Une Categorie';
            this.lawCategory = new LawCategory({});
        }

        this.lawCategoryForm = this.createLawCategoryForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create law-category form
     *
     * @returns {FormGroup}
     */
    createLawCategoryForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.lawCategory.id],
            name    : [this.lawCategory.name],
            description: [this.lawCategory.description]
        });
    }

    saveOrUpdate() {
        this.lawCategory = new LawCategory();
        this.lawCategory = this.lawCategoryForm.getRawValue();
        if (!this.lawCategory.id) {
            this._lawCategoriesService.create(this.lawCategory).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._lawCategoriesService.getLawCategories();
                    this._toastr.success(data['message']);
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                }
            });
        } else {
            this._lawCategoriesService.update(this.lawCategory).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._lawCategoriesService.getLawCategories();
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
