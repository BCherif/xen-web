import {Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {Cutting} from "../../../data/models/cutting.model";
import {CuttingsService} from "../cuttings/cuttings.service";
import {Locality} from "../../../data/models/locality.model";
import {LocalitiesService} from "../localities/localities.service";
import {Subject} from "rxjs";

@Component({
    selector     : 'setting-locality-form-dialog',
    templateUrl  : './locality-form.component.html',
    styleUrls    : ['./locality-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SettingLocalityFormDialogComponent implements OnInit, OnDestroy{
    action: string;
    locality: Locality;
    levels: Locality[];
    localitySelected: Locality;
    cuttings: Cutting[];
    cutting: Cutting;
    localityForm: FormGroup;
    dialogTitle: string;

    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MatDialogRef<SettingLocalityFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _cuttingsService
     * @param _localitiesService
     * @param _toastr
     */
    constructor(
        public matDialogRef: MatDialogRef<SettingLocalityFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _cuttingsService: CuttingsService,
        private _localitiesService: LocalitiesService,
        private _toastr: ToastrService,
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Modifier Une Localité';
            this.locality = _data.locality;
            this.getCuttingById(this.locality?.cutting?.id);
            this.getLeveSupById(this.locality?.levelSup?.id);
            this.updateOrderForm();
        }
        else
        {
            this.dialogTitle = 'Ajouter Une Localité';
            this.locality = new Locality({});
            this.createOrderForm();
        }

    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.getAllCutting();
        this.getLevelSup();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    getLevelSup(){
        this._localitiesService.getAll().subscribe(value => {
            this.levels = value['response'];
        }, error => console.log(error))
    }

    getLeveSupById(id: number) {
        this._localitiesService.getById(id).subscribe(value => {
            this.localitySelected = value['response'];
        },error => console.log(error))
    }


    getAllCutting(){
        this._cuttingsService.getAll().subscribe(value => {
            this.cuttings = value['response'];
        }, error => console.log(error))
    }

    getCuttingById(id: number) {
        this._cuttingsService.getById(id).subscribe(value => {
            this.cutting = value['response'];
        },error => console.log(error))
    }

    /**
     * Create locality form
     *
     * @returns {FormGroup}
     */
    createOrderForm(){
        this.localityForm = this._formBuilder.group({
            id: new FormControl(''),
            name: new FormControl('', Validators.required),
            cutting: new FormControl('', Validators.required),
            levelSup: new FormControl('')
        });
    }

    /**
     * Create locality form
     *
     * @returns {FormGroup}
     */
    updateOrderForm(){
        this.localityForm = this._formBuilder.group({
            id: new FormControl(this.locality.id),
            name: new FormControl(this.locality.name, Validators.required),
            cutting: new FormControl(this.locality?.cutting?.id, Validators.required),
            levelSup: new FormControl(this.locality?.levelSup?.id)
        });
    }

    findCuttingSelected(value) {
        this.getCuttingById(value);
    }

    findLevelSupSelected(value) {
        this.getLeveSupById(value);
    }

    saveOrUpdate() {
        this.locality = new Locality();
        this.locality = this.localityForm.getRawValue();
        this.locality.cutting = this.cutting;
        this.locality.levelSup = this.localitySelected;
        if (!this.locality.id) {
            this._localitiesService.create(this.locality).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._localitiesService.getLocalities();
                    this._toastr.success(data['message']);
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                }
            });
        } else {
            this._localitiesService.update(this.locality).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._localitiesService.getLocalities();
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
