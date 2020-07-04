import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {ProgramService} from './program.service';
import {Program} from '../../../data/models/program.model';
import {Elected} from '../../../data/models/elected.model';
import {Organ} from '../../../data/models/organ.model';
import {ElectedsService} from '../../trueometer/electeds/electeds.service';
import {OrgansService} from '../../trueometer/organs/organs.service';
import {ORGAN_CALL} from '../../../data/enums/enums';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'setting-program',
    templateUrl: './program.component.html',
    styleUrls: ['./program.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ProgramComponent implements OnInit, OnDestroy {
    program: Program;
    electeds: Elected[];
    elected: Elected;
    organ: Organ;
    organs: Organ[];
    organCalls: any[];
    organCall = ORGAN_CALL;
    organCallSelected: any;
    programForm: FormGroup;
    pageType: string;
    startDate: Date;
    endDate: Date;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param _toastr
     * @param _programService
     * @param _electedsService
     * @param _organsService
     * @param _router
     * @param _spinnerService
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _programService: ProgramService,
        private _electedsService: ElectedsService,
        private _organsService: OrgansService,
        private _router: Router,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the default
        this.program = new Program();

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
        this.organCalls = Object.keys(this.organCall);
        this.createProgramForm();
        this.getElecteds();
        this.getOrgans();
        // Subscribe to update interpellation on changes
        this._programService.onProgramChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(program => {

                if (program) {
                    if (program.elected) {
                        this.getElectedById(program.elected.id);
                        this.programForm.get('elected').setValue(program.elected.id);                    }
                    if (program.organ) {
                        this.getOrganById(program.organ.id);
                        this.programForm.get('organ').setValue(program.organ.id);
                    }
                    this.programForm.get('id').setValue(program.id);
                    this.programForm.get('title').setValue(program.title);
                    this.programForm.get('date').setValue({'begin': new Date(program.startDate), 'end': new Date(program.endDate)});
                    this.programForm.get('organCall').setValue(program.organCall);
                    this.program = new Program(program);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.program = new Program();
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
     * Create program form
     *
     * @returns {FormGroup}
     */
    createProgramForm() {
        this.programForm = this._formBuilder.group({
            id: new FormControl(''),
            date: [{begin: this.program.startDate, end: this.program.endDate}],
            title: new FormControl('', Validators.required),
            organ: new FormControl(''),
            elected: new FormControl(''),
            organCall: new FormControl(''),
        });
    }

    getElecteds() {
        this._electedsService.getAll().subscribe(value => {
            this.electeds = value['response'];
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

    findByElectedSelected(value) {
        this.getElectedById(value);
    }

    findOrganSelected(value) {
        this.getOrganById(value);
    }

    getOrganChoice(value) {
        this.organCallSelected = value;
    }

    onChangeDate(event) {
        this.startDate = new Date(event.target.value.begin);
        this.endDate = new Date(event.target.value.end);
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.program = new Program();
        this.program = this.programForm.getRawValue();
        this.program.elected = this.elected;
        this.program.startDate = this.startDate;
        this.program.endDate = this.endDate;
        this.program.organ = this.organ;
        if (!this.program.id) {
            this._programService.create(this.program).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/setting/programs');
                    this._spinnerService.hide();
                } else {
                    this._toastr.error(data['message']);
                }
            });
        } else {
            this._programService.update(this.program).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/setting/programs');
                    this._spinnerService.hide();
                } else {
                    this._toastr.error(data['message']);
                }
            });
        }
    }

}
