import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {Axis} from '../../../data/models/axis.model';
import {AxesService} from '../axes/axes.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector     : 'setting-axe-form-dialog',
    templateUrl  : './axe-form.component.html',
    styleUrls    : ['./axe-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SettingAxeFormDialogComponent
{
    action: string;
    axis: Axis;
    axeForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<SettingAxeFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _axesService
     * @param _toastr
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<SettingAxeFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _axesService: AxesService,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Modifier un axe';
            this.axis = _data.axis;
        }
        else
        {
            this.dialogTitle = 'Ajouter un axe';
            this.axis = new Axis({});
        }

        this.axeForm = this.createAxisForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create axis form
     *
     * @returns {FormGroup}
     */
    createAxisForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.axis.id],
            name    : [this.axis.name],
            description: [this.axis.description]
        });
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.axis = new Axis();
        this.axis = this.axeForm.getRawValue();
        if (!this.axis.id) {
            this._axesService.create(this.axis).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._axesService.getAxies();
                    this._toastr.success(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                }
            });
        } else {
            this._axesService.update(this.axis).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._axesService.getAxies();
                    this._toastr.success(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                }
            });
        }
    }
}
