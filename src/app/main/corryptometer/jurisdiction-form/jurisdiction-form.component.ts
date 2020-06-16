import { Component, Inject, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {Jurisdiction} from '../../../data/models/jurisdiction.model';
import {JurisdictionsService} from '../jurisdictions/jurisdictions.service';

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
     */
    constructor(
        public matDialogRef: MatDialogRef<CorryptometerJurisdictionFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _jurisdictionsService: JurisdictionsService,
        private _toastr: ToastrService,
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Modifier une juridiction';
            this.jurisdiction = _data.jurisdiction;
        }
        else
        {
            this.dialogTitle = 'Ajouter une juridiction';
            this.jurisdiction = new Jurisdiction({});
        }

        this.jurisdictionForm = this.createJurisdictionForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create jurisdiction form
     *
     * @returns {FormGroup}
     */
    createJurisdictionForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.jurisdiction.id],
            name    : [this.jurisdiction.name, Validators.required],
            description: [this.jurisdiction.description]
        });
    }

    saveOrUpdate() {
        this.jurisdiction = new Jurisdiction();
        this.jurisdiction = this.jurisdictionForm.getRawValue();
        if (!this.jurisdiction.id) {
            this._jurisdictionsService.create(this.jurisdiction).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._jurisdictionsService.getJurisdictions();
                    this._toastr.success(data['message']);
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                }
            });
        } else {
            this._jurisdictionsService.update(this.jurisdiction).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._jurisdictionsService.getJurisdictions();
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
