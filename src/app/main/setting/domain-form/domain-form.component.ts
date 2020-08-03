import {Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {Domain} from '../../../data/models/domain.model';
import {Axis} from '../../../data/models/axis.model';
import {DomainsService} from '../domains/domains.service';
import {AxesService} from '../axes/axes.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'setting-domain-form-dialog',
    templateUrl: './domain-form.component.html',
    styleUrls: ['./domain-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SettingDomainFormDialogComponent implements OnInit, OnDestroy {
    action: string;
    domain: Domain;
    axes: Axis[];
    axis: Axis;
    domainForm: FormGroup;
    dialogTitle: string;

    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MatDialogRef<SettingDomainFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _domainsService
     * @param _axesService
     * @param _toastr
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<SettingDomainFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _domainsService: DomainsService,
        private _axesService: AxesService,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Modifier un domaine';
            this.domain = _data.domain;
            this.getAxeById(this.domain.axis.id);
            this.updateDomainForm();
        } else {
            this.dialogTitle = 'Ajouter un domaine';
            this.domain = new Domain({});
            this.createDomainForm();
        }

    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.getAllAxes();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getAllAxes() {
        this._axesService.getAll().subscribe(value => {
            this.axes = value['response'];
        }, error => console.log(error));
    }

    getAxeById(id: number) {
        this._axesService.getById(id).subscribe(value => {
            this.axis = value['response'];
        }, error => console.log(error));
    }

    /**
     * Create domain form
     *
     * @returns {FormGroup}
     */
    createDomainForm() {
        this.domainForm = this._formBuilder.group({
            id: new FormControl(''),
            name: new FormControl('', Validators.required),
            axis: new FormControl('', Validators.required)
        });
    }

    /**
     * Create domain form
     *
     * @returns {FormGroup}
     */
    updateDomainForm() {
        this.domainForm = this._formBuilder.group({
            id: new FormControl(this.domain.id),
            name: new FormControl(this.domain.name, Validators.required),
            axis: new FormControl(this.domain.axis.id, Validators.required)
        });
    }

    findAxeSelected(value) {
        this.getAxeById(value);
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.domain = new Domain();
        this.domain = this.domainForm.getRawValue();
        this.domain.axis = this.axis;
        if (!this.domain.id) {
            this._domainsService.create(this.domain).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._domainsService.getDomains();
                    this._toastr.success(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                    this._spinnerService.hide();
                }
            });
        } else {
            this._domainsService.update(this.domain).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._domainsService.getDomains();
                    this._toastr.success(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                    this._spinnerService.hide();
                }
            });
        }
    }
}
