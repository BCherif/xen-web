import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from 'ngx-spinner';
import {QuizCategory} from '../../../data/models/quiz.category.model';
import {QuizCategoriesService} from '../quiz-categories/quiz-categories.service';

@Component({
    selector     : 'publications-add-category-dialog',
    templateUrl  : './add-category.component.html',
    styleUrls    : ['./add-category.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class PublicationsAddCategoryDialogComponent implements OnInit
{
    action: string;
    quizCategory: QuizCategory;
    quizCatForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<PublicationsAddCategoryDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _quizCategoriesService
     * @param _toastr
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<PublicationsAddCategoryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _quizCategoriesService: QuizCategoriesService,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Modifier une categorie';
            this.quizCategory = _data.quizCategory;
        }
        else
        {
            this.dialogTitle = 'Ajouter une categorie';
            this.quizCategory = new QuizCategory({});
        }

        this.quizCatForm = this.createCategory();
    }

    ngOnInit() {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create quizCat
     *
     * @returns {FormGroup}
     */
    createCategory(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.quizCategory.id],
            name    : [this.quizCategory.name, Validators.required],
            description: [this.quizCategory.description]
        });
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.quizCategory = new QuizCategory();
        this.quizCategory = this.quizCatForm.getRawValue();
        this._quizCategoriesService.create(this.quizCategory).subscribe(data => {
            if (data['status'] === 'OK') {
                this._quizCategoriesService.getCategories();
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
