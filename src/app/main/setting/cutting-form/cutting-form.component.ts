import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {Cutting} from '../../../data/models/cutting.model';
import {CuttingsService} from '../cuttings/cuttings.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'setting-cutting-form-dialog',
    templateUrl: './cutting-form.component.html',
    styleUrls: ['./cutting-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SettingCuttingFormDialogComponent {
    action: string;
    cutting: Cutting;
    cuttingSelected: Cutting;
    cuttings: Cutting[];
    cuttingForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<SettingCuttingFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _cuttingsService
     * @param _toastr
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<SettingCuttingFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _cuttingsService: CuttingsService,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the defaults
        this.action = _data.action;
        this.getAllCutting();

        if (this.action === 'edit') {
            this.dialogTitle = 'Modifier un découpage';
            this.cutting = _data.cutting;
            this.getCuttingById(this.cutting?.cuttingSup?.id);
            this.cuttingForm = this.updateCuttingForm();
        } else {
            this.dialogTitle = 'Ajouter un découpage';
            this.cutting = new Cutting({});
            this.cuttingForm = this.createCuttingForm();
        }


    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getAllCutting() {
        this._cuttingsService.getAllCutting().subscribe(value => {
            this.cuttings = value['response'];
        }, error => console.log(error));
    }

    getCuttingById(id: number) {
        this._cuttingsService.getById(id).subscribe(value => {
            this.cuttingSelected = value['response'];
        }, error => console.log(error));
    }

    findCuttingSelected(value) {
        this.getCuttingById(value);
    }

    /**
     * Create cutting form
     *
     * @returns {FormGroup}
     */
    createCuttingForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.cutting.id],
            name: [this.cutting.name, Validators.required],
            description: [this.cutting.description],
            cuttingSup: [this.cutting.cuttingSup]
        });
    }

    /**
     * Create cutting form
     *
     * @returns {FormGroup}
     */
    updateCuttingForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.cutting.id],
            name: [this.cutting.name, Validators.required],
            description: [this.cutting.description],
            cuttingSup: [this.cutting?.cuttingSup?.id]
        });
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.cutting = new Cutting();
        this.cutting = this.cuttingForm.getRawValue();
        this.cutting.cuttingSup = this.cuttingSelected;
        if (!this.cutting.id) {
            this._cuttingsService.create(this.cutting).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._cuttingsService.getCuttings();
                    this._toastr.success(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                }
            });
        } else {
            this._cuttingsService.update(this.cutting).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._cuttingsService.getCuttings();
                    this._toastr.success(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                }
            }, error => {
                // console.log(error);
            });
        }
    }
}
