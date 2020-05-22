import {Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {Subject} from "rxjs";
import {Program} from '../../../data/models/program.model';
import {Elected} from '../../../data/models/elected.model';
import {ElectedsService} from '../../trueometer/electeds/electeds.service';
import {ProgramsService} from '../programs/programs.service';

@Component({
    selector     : 'setting-program-form-dialog',
    templateUrl  : './program-form.component.html',
    styleUrls    : ['./program-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SettingProgramFormDialogComponent implements OnInit, OnDestroy{
    action: string;
    program: Program;
    electeds: Elected[];
    elected: Elected;
    programForm: FormGroup;
    dialogTitle: string;

    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MatDialogRef<SettingProgramFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _programsService
     * @param _electedsService
     * @param _toastr
     */
    constructor(
        public matDialogRef: MatDialogRef<SettingProgramFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _programsService: ProgramsService,
        private _electedsService: ElectedsService,
        private _toastr: ToastrService,
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Modifier un programme';
            this.program = _data.program;
            this.getElectedById(this.program.elected.id);
            this.updateProgramForm();
        }
        else
        {
            this.dialogTitle = 'Ajouter un programme';
            this.program = new Program({});
            this.createProgramForm();
        }

    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.getAllElected();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getAllElected(){
        this._electedsService.getAll().subscribe(value => {
            this.electeds = value['response'];
        }, error => console.log(error))
    }

    getElectedById(id: number) {
        this._electedsService.getById(id).subscribe(value => {
            this.elected = value['response'];
        },error => console.log(error))
    }

    /**
     * Create program form
     *
     * @returns {FormGroup}
     */
    createProgramForm(){
        this.programForm = this._formBuilder.group({
            id: new FormControl(''),
            years: new FormControl('', Validators.required),
            elected: new FormControl('', Validators.required)
        });
    }

    /**
     * Create program form
     *
     * @returns {FormGroup}
     */
    updateProgramForm(){
        this.programForm = this._formBuilder.group({
            id: new FormControl(this.program.id),
            years: new FormControl(this.program.years, Validators.required),
            elected: new FormControl(this.program.elected.id, Validators.required)
        });
    }

    findElectedSelected(value) {
        this.getElectedById(value);
    }

    saveOrUpdate() {
        this.program = new Program();
        this.program = this.programForm.getRawValue();
        this.program.elected = this.elected;
        if (!this.program.id) {
            this._programsService.create(this.program).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._programsService.getPrograms();
                    this._toastr.success(data['message']);
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                }
            });
        } else {
            this._programsService.update(this.program).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._programsService.getPrograms();
                    this._toastr.success(data['message']);
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                }
            });
        }
    }
}
