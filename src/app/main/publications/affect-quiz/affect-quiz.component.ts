import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from 'ngx-spinner';
import {Form} from '../../../data/models/form.model';
import {FormsService} from '../forms/forms.service';
import {Quiz} from '../../../data/models/quiz.model';
import {QuizzesService} from '../quizzes/quizzes.service';
import {FormCatQuizSaveEntity} from '../../../data/wrapper/form.cat.quiz.save.entity.model';
import {QuizCategory} from '../../../data/models/quiz.category.model';
import {QuizCategoriesService} from '../quiz-categories/quiz-categories.service';

@Component({
    selector     : 'publications-affect-quiz-dialog',
    templateUrl  : './affect-quiz.component.html',
    styleUrls    : ['./affect-quiz.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class PublicationsAffectQuizDialogComponent implements OnInit
{
    action: string;
    form: Form;
    affectQuizForm: FormGroup;
    formCatQuiz: FormCatQuizSaveEntity;
    catQuizChoice: QuizCategory;
    quizzes : Quiz[];
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<PublicationsAffectQuizDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _formsService
     * @param _quizzesService
     * @param _quizCategoriesService
     * @param _toastr
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<PublicationsAffectQuizDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _formsService: FormsService,
        private _quizzesService: QuizzesService,
        private _quizCategoriesService: QuizCategoriesService,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    )
    {
        // Set the defaults
        this.action = _data.action;
        this.dialogTitle = 'Affecter des questions';
        this.form = _data.form;
        this.formCatQuiz = new FormCatQuizSaveEntity();
        this.affectQuizForm = this.createForm();
    }

    ngOnInit() {
        this.getAllQuiz();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create form
     *
     * @returns {FormGroup}
     */
    createForm()
    {
        return this._formBuilder.group({
            quizCategory:new FormControl(this.formCatQuiz.quizCategory, Validators.required),
            quizzes:new FormControl(this.formCatQuiz.quizzes, Validators.required)
        });
    }

    getAllQuiz(){
        this._quizzesService.getAll().subscribe(value => {
            this.quizzes = value['response'];
        },error => console.error(error));
    }

    getQuizCatById(id: number) {
        this._quizCategoriesService.getById(id).subscribe(value => {
            this.catQuizChoice = value['response'];
        }, error => console.log(error));
    }

    findCat(value) {
        this.getQuizCatById(value);
    }



    /*getFormById(id: number) {
        this._formsService.getById(id).subscribe(value => {
            this.catQuizChoice = value['response'];
        }, error => console.log(error));
    }*/

    affect() {
        this._spinnerService.show();
        this.formCatQuiz = new FormCatQuizSaveEntity();
        this.formCatQuiz = this.affectQuizForm.getRawValue();
        this.formCatQuiz.form = this.form;
        this.formCatQuiz.quizCategory = this.catQuizChoice;
        this._formsService.affectQuiz(this.formCatQuiz).subscribe(data => {
            if (data['status'] === 'OK') {
                this._formsService.getForms();
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
