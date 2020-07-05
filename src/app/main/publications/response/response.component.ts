import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {Quiz} from '../../../data/models/quiz.model';
import {Response} from '../../../data/models/response.model';
import {ResponseSaveEntity} from '../../../data/wrapper/response.save.entity.model';
import {ResponseService} from './response.service';
import {QuizzesService} from '../quizzes/quizzes.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector     : 'publications-response',
    templateUrl  : './response.component.html',
    styleUrls    : ['./response.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ResponseComponent implements OnInit, OnDestroy
{
    responses: Response[] = [];
    responseSaveEntity: ResponseSaveEntity;
    quiz: Quiz;
    response: Response;
    quizzes : Quiz[];
    pageType: string;
    responseForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ResponseService} _responseService
     * @param _quizzesService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param _toastr
     * @param _router
     * @param _spinnerService
     */
    constructor(
        private _responseService: ResponseService,
        private _quizzesService: QuizzesService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _router: Router,
        private _spinnerService: NgxSpinnerService
    )
    {
        // Set the default
        this.response = new Response();
        this.responseSaveEntity = new ResponseSaveEntity();

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
        this.createForm();
        this.getQuizzes();
        // Subscribe to update request on changes
        this._responseService.onResponseChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                if ( response )
                {
                    this.response = new Response(response);
                    this.pageType = 'edit';
                }
                else
                {
                    this.pageType = 'new';
                    this.response = new Response();
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

    getQuizzes() {
        this._quizzesService.getAll().subscribe(value => {
            this.quizzes = value['response'];
        }, error => console.log(error))
    }

    getQuizById(id: number) {
        this._quizzesService.getById(id).subscribe(value => {
            this.quiz = value['response'];
        },error => console.log(error))
    }

    findQuizSelected(value) {
        this.getQuizById(value);
    }


    /**
     * Create form
     *
     * @returns {FormGroup}
     */
    createForm(){
        this.responseForm = this._formBuilder.group({
            id: new FormControl(''),
            quiz: new FormControl('', Validators.required)
        });
        this.addNewRow();
    }

    delete(i: number){
        this.responses.splice(i,1);
    }

    addNewRow() {
        let size = this.responses.length;
        let newResponse = new Response();
        this.responses.splice(size+1,0,newResponse);
    }

    /*isLinesCorrect(): boolean {
        let ret: boolean = true;
        if (this.responses.length < 1) {
            ret = false;
        }else {
            for (let item of this.responses) {
                if (!item.name || !item.description || item.name.length <= 0 || item.description.length <= 0) {
                    return false;
                }
            }
        }
        return ret;
    }*/

    save() {
        this._spinnerService.show();
        this.responseSaveEntity = new ResponseSaveEntity();
        this.responseSaveEntity.quiz = this.quiz;
        this.responseSaveEntity.responses = this.responses;
        this._responseService.create(this.responseSaveEntity).subscribe(data=>{
            if (data['status'] === 'OK') {
                this._toastr.success(data['message']);
                this._router.navigateByUrl('/main/publications/responses');
                this._spinnerService.hide();
            } else {
                this._toastr.error(data['message']);
            }
        })
    }

}
