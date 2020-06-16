import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {Organ} from "../../../data/models/organ.model";
import {OrgansService} from "../organs/organs.service";

@Component({
    selector     : 'trueometer-organ-form-dialog',
    templateUrl  : './organ-form.component.html',
    styleUrls    : ['./organ-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SettingOrganFormDialogComponent
{
    action: string;
    organ: Organ;
    organForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<SettingOrganFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _organsService
     * @param _toastr
     */
    constructor(
        public matDialogRef: MatDialogRef<SettingOrganFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _organsService: OrgansService,
        private _toastr: ToastrService
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Modifier une institution';
            this.organ = _data.organ;
        }
        else
        {
            this.dialogTitle = 'Ajouter une institution';
            this.organ = new Organ({});
        }

        this.organForm = this.createOrganForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create organ form
     *
     * @returns {FormGroup}
     */
    createOrganForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.organ.id],
            name    : [this.organ.name],
            description: [this.organ.description]
        });
    }

    saveOrUpdate() {
        this.organ = new Organ();
        this.organ = this.organForm.getRawValue();
        if (!this.organ.id) {
            this._organsService.create(this.organ).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._organsService.getOrgans();
                    this._toastr.success(data['message']);
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                }
            });
        } else {
            this._organsService.update(this.organ).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._organsService.getOrgans();
                    this._toastr.success(data['message']);
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                }
            }, error => {
                // console.log(error);
            });
        }
    }
}
