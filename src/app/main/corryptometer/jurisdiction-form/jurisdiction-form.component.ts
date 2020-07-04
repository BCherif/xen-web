import { Component, Inject, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {Jurisdiction} from '../../../data/models/jurisdiction.model';
import {JurisdictionsService} from '../jurisdictions/jurisdictions.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {DEGREE} from '../../../data/enums/enums';
import {Locality} from '../../../data/models/locality.model';
import {LocalitiesService} from '../../setting/localities/localities.service';

@Component({
    selector     : 'corryptometer-jurisdiction-form-dialog',
    templateUrl  : './jurisdiction-form.component.html',
    styleUrls    : ['./jurisdiction-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CorryptometerJurisdictionFormDialogComponent
{
    action: string;
    jurisdiction: Jurisdiction;
    degree = DEGREE;
    degrees: any[];
    localities: Locality[];
    locality: Locality;
    jurisdictionForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<CorryptometerJurisdictionFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _jurisdictionsService
     * @param _toastr
     * @param _localitiesService
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<CorryptometerJurisdictionFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _jurisdictionsService: JurisdictionsService,
        private _toastr: ToastrService,
        private _localitiesService: LocalitiesService,
        private _spinnerService: NgxSpinnerService
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Modifier une juridiction';
            this.jurisdiction = _data.jurisdiction;
            this.getLocalityById(this.jurisdiction.level.id);
            this.updateJurisdictionForm();
        }
        else
        {
            this.dialogTitle = 'Ajouter une juridiction';
            this.jurisdiction = new Jurisdiction({});
            this.createJurisdictionForm();
        }
        this.degrees = Object.keys(this.degree);
        this.getLocalities();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create jurisdiction form
     *
     */
    createJurisdictionForm(){
        this.jurisdictionForm = this._formBuilder.group({
            id      : [this.jurisdiction.id],
            name    : [this.jurisdiction.name, Validators.required],
            level   : ['', Validators.required],
            degree  : [this.jurisdiction.degree, Validators.required],
            description: [this.jurisdiction.description]
        });
    }


    /**
     * update jurisdiction form
     *
     */
    updateJurisdictionForm(){
        this.jurisdictionForm = this._formBuilder.group({
            id      : [this.jurisdiction.id],
            name    : [this.jurisdiction.name, Validators.required],
            level   : [this.jurisdiction.level.id, Validators.required],
            degree  : [this.jurisdiction.degree, Validators.required],
            description: [this.jurisdiction.description]
        });
    }

    getLocalities() {
        this._localitiesService.getAll().subscribe(value => {
            this.localities = value['response'];
        }, error => console.log(error));
    }

    getLocalityById(id: number) {
        this._localitiesService.getById(id).subscribe(value => {
            this.locality = value['response'];
        }, error => console.log(error));
    }

    findByLocalitySelected(value) {
        this.getLocalityById(value);
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.jurisdiction = new Jurisdiction();
        this.jurisdiction = this.jurisdictionForm.getRawValue();
        this.jurisdiction.level = this.locality;
        if (!this.jurisdiction.id) {
            this._jurisdictionsService.create(this.jurisdiction).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._jurisdictionsService.getJurisdictions();
                    this._toastr.success(data['message']);
                    this.matDialogRef.close();
                    this._spinnerService.hide();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                    this._spinnerService.hide();
                }
            });
        } else {
            this._jurisdictionsService.update(this.jurisdiction).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._jurisdictionsService.getJurisdictions();
                    this._toastr.success(data['message']);
                    this.matDialogRef.close();
                    this._spinnerService.hide();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                    this._spinnerService.hide();
                }
            });
        }
    }
}
