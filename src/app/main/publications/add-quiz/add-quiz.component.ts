import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from 'ngx-spinner';
import {Form} from '../../../data/models/form.model';
import {FormsService} from '../forms/forms.service';
import {Quiz} from '../../../data/models/quiz.model';
import {QuizzesService} from '../quizzes/quizzes.service';
import {TYPE_QUIZ_ANSWER} from '../../../data/enums/enums';
import {QuizSaveEntity} from '../../../data/wrapper/quiz.save.entity.model';
import {Router} from '@angular/router';
import {Response} from '../../../data/models/response.model';

@Component({
    selector     : 'publications-quiz-form-dialog',
    templateUrl  : './add-quiz.component.html',
    styleUrls    : ['./add-quiz.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class PublicationsAddQuizDialogComponent implements OnInit
{
    action: string;
    form: Form;
    quiz: Quiz;
    response : Response;
    quizSaveEntity: QuizSaveEntity;
    quizForm: FormGroup;
    types: any[];
    type = TYPE_QUIZ_ANSWER;
    typeSelected : any;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<PublicationsAddQuizDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _formsService
     * @param _quizzesService
     * @param _toastr
     * @param _spinnerService
     * @param _router
     */
    constructor(
        public matDialogRef: MatDialogRef<PublicationsAddQuizDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _formsService: FormsService,
        private _quizzesService: QuizzesService,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService,
        private _router: Router,
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'addQUiz' )
        {
            this.dialogTitle = 'Ajouter une question';
            this.form = _data.form;
        }
        this.quiz = new Quiz();
        this.response = new Response();
        this.quizSaveEntity = new QuizSaveEntity();
        this.createQuizForm();
    }

    ngOnInit() {
        this.types = Object.keys(this.type);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create form
     *
     * @returns {FormGroup}
     */
    createQuizForm() {
       this.quizForm =this._formBuilder.group({
            name    : [this.quiz.name, Validators.required],
            typeQuiz: [this.quiz.typeQuiz, Validators.required],
            answers: this._formBuilder.array([]) ,
        });
    }

    answers() : FormArray {
        return this.quizForm.get("answers") as FormArray
    }

    newAnswer(): FormGroup {
        return this._formBuilder.group({
            name: [this.response.name],
            numberFiled: [this.response.numberFiled],
            dateField: [this.response.dateField],
            isCorrect: [this.response.isCorrect],
        })
    }

    addAnswer() {
        this.answers().push(this.newAnswer());
    }

    removeAnswer(i:number) {
        this.answers().removeAt(i);
    }

    saveQuiz() {
        this._spinnerService.show();
        this.quizSaveEntity = new QuizSaveEntity();
        this.quizSaveEntity.quiz = this.quizForm.getRawValue();
        this.quizSaveEntity.quiz.form = this.form;
        this.quizSaveEntity.responses = this.quizForm.get('answers').value;
        this._quizzesService.create(this.quizSaveEntity).subscribe(data=>{
            if (data['status'] === 'OK') {
                this._router.navigateByUrl('/main/publications/forms')
                this._toastr.success(data['message']);
                this._spinnerService.hide();
                this.matDialogRef.close();
            }else {
                this._toastr.error(data['message']);
                this._spinnerService.hide();
                this.matDialogRef.close();
            }
        })
    }

    onTypeChange(value) {
        this.typeSelected = value;
    }

}
