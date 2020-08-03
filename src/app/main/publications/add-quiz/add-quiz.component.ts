import {Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Quiz} from '../../../data/models/quiz.model';
import {QuizzesService} from '../quizzes/quizzes.service';
import {TYPE_QUIZ_ANSWER} from '../../../data/enums/enums';
import {Router} from '@angular/router';
import {Response} from '../../../data/models/response.model';
import {Domain} from '../../../data/models/domain.model';
import {DomainsService} from '../../setting/domains/domains.service';
import {Observable} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {ResponsesService} from '../responses/responses.service';
import {MatChipInputEvent} from '@angular/material/chips';
import {map, startWith} from 'rxjs/operators';
import {Form} from '../../../data/models/form.model';

@Component({
    selector: 'publications-quiz-form-dialog',
    templateUrl: './add-quiz.component.html',
    styleUrls: ['./add-quiz.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class PublicationsAddQuizDialogComponent implements OnInit {
    action: string;
    quiz: Quiz;
    form: Form;
    quizForm: FormGroup;
    types: any[];
    type = TYPE_QUIZ_ANSWER;
    typeSelected: any;
    dialogTitle: string;

    domains: Domain[];
    domain: Domain;

    responses: any = [];
    allResponses: any[] = [];
    filteredResponses: Observable<any[]>;
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = false;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    @ViewChild('responseInput') responseInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    /**
     * Constructor
     *
     * @param {MatDialogRef<PublicationsAddQuizDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _quizzesService
     * @param _toastr
     * @param _spinnerService
     * @param _domainsService
     * @param _responsesService
     * @param _router
     */
    constructor(
        public matDialogRef: MatDialogRef<PublicationsAddQuizDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _quizzesService: QuizzesService,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService,
        private _domainsService: DomainsService,
        private _responsesService: ResponsesService,
        private _router: Router
    ) {
        // Set the defaults
        this.action = _data.action;
        this.form = _data.form;

        if (this.action === 'new') {
            this.dialogTitle = 'Ajouter une question';
        }
        this.quiz = new Quiz();
        this.createQuizForm();
    }

    ngOnInit() {
        this.types = Object.keys(this.type);
        this.getResponses();
        this.getDomains();

        this.filteredResponses = this.quizForm.get('responses').valueChanges.pipe(
            startWith(''),
            map((value: any | null) => value ? this._filter(value) : this.allResponses.slice()));
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
        this.quizForm = this._formBuilder.group({
            name: [this.quiz.name, Validators.required],
            typeQuiz: [this.quiz.typeQuiz, Validators.required],
            domain: [this.quiz.domain, Validators.required],
            responses: [this.quiz.responses]
            /*  answers: this._formBuilder.array([]),*/
        });
    }

    getResponses() {
        this._responsesService.getAll().subscribe(value => {
            this.allResponses = value['response'];
        }, error => console.log(error));
    }

    add(event: MatChipInputEvent): void {
        debugger
        const input = event.input;
        const value = event.value;
        // Add our response
        if ((value || '').trim()) {
            this.responses.push({
                id: null,
                name: value.trim()
            });
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.quizForm.get('responses').setValue(null);
    }

    remove(fruit, index): void {
        this.responses.splice(index, 1);
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.responses.push(event.option.value);
        this.responseInput.nativeElement.value = '';
        this.quizForm.get('responses').setValue(null);
    }

    private _filter(name: any): any[] {
        return this.allResponses.filter(option => option.name.includes(name));
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

    /*
     answers(): FormArray {
         return this.quizForm.get('answers') as FormArray;
     }

     newAnswer(): FormGroup {
         return this._formBuilder.group({
             name: [this.response.name]
         });
     }

     addAnswer() {
         this.answers().push(this.newAnswer());
     }

     removeAnswer(i: number) {
         this.answers().removeAt(i);
     }*/

    saveQuiz() {
        this._spinnerService.show();
        this.quiz = new Quiz();
        this.quiz = this.quizForm.getRawValue();
        this.quiz.domain = this.domain;
        this.quiz.form = this.form;
        this.quiz.responses = this.responses;
        this._quizzesService.create(this.quiz).subscribe(data => {
            if (data['status'] === 'OK') {
                this._quizzesService.getQuizzes();
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

    onTypeChange(value) {
        this.typeSelected = value;
    }

}
