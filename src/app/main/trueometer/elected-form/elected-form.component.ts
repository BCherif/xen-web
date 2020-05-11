import {Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {Locality} from "../../../data/models/locality.model";
import {Subject} from "rxjs";
import {Organ} from "../../../data/models/organ.model";
import {OrgansService} from "../organs/organs.service";
import {ElectedsService} from "../electeds/electeds.service";
import {Elected} from "../../../data/models/elected.model";
import {LocalitiesService} from "../../setting/localities/localities.service";

@Component({
    selector     : 'trueometer-elected-form-dialog',
    templateUrl  : './elected-form.component.html',
    styleUrls    : ['./elected-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SettingElectedFormDialogComponent implements OnInit, OnDestroy{
    action: string;
    elected: Elected;
    locality: Locality;
    localities: Locality[];
    organ: Organ;
    organs: Organ[];
    electedForm: FormGroup;
    dialogTitle: string;

    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MatDialogRef<SettingElectedFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _electedsService
     * @param _localitiesService
     * @param _organsService
     * @param _toastr
     */
    constructor(
        public matDialogRef: MatDialogRef<SettingElectedFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _electedsService: ElectedsService,
        private _localitiesService: LocalitiesService,
        private _organsService: OrgansService,
        private _toastr: ToastrService,
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Modifier Un elus';
            this.elected = _data.elected;
            this.getLocalityById(this.elected.locality.id);
            this.getOrganById(this.elected.organ.id);
            this.updateElectedForm();
        }
        else
        {
            this.dialogTitle = 'Ajouter Un elus';
            this.elected = new Elected({});
            this.createElectedForm();
        }

    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.getAllLocalities();
        this.getAllOrgans();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getAllLocalities(){
        this._localitiesService.getAll().subscribe(value => {
            this.localities = value['response'];
        }, error => console.log(error))
    }

    getAllOrgans() {
        this._organsService.getAll().subscribe(value => {
            this.organs = value['response'];
        }, error => console.log(error))
    }

    getLocalityById(id: number) {
        this._localitiesService.getById(id).subscribe(value => {
            this.locality = value['response'];
        },error => console.log(error))
    }

    getOrganById(id: number) {
        this._organsService.getById(id).subscribe(value => {
            this.organ = value['response'];
        },error => console.log(error))
    }

    /**
     * Create elected form
     *
     * @returns {FormGroup}
     */
    createElectedForm(){
        this.electedForm = this._formBuilder.group({
            id: new FormControl(''),
            lastname: new FormControl('', Validators.required),
            firstname: new FormControl('', Validators.required),
            job: new FormControl('', Validators.required),
            sexe: new FormControl('', Validators.required),
            locality: new FormControl('', Validators.required),
            organ: new FormControl('', Validators.required)
        });
    }

    /**
     * Create elected form
     *
     * @returns {FormGroup}
     */
    updateElectedForm(){
        this.electedForm = this._formBuilder.group({
            id: new FormControl(this.elected.id),
            lastname: new FormControl(this.elected.lastname, Validators.required),
            firstname: new FormControl(this.elected.firstname, Validators.required),
            job: new FormControl(this.elected.job, Validators.required),
            sexe: new FormControl(this.elected.sexe, Validators.required),
            locality: new FormControl(this.elected.locality.id, Validators.required),
            organ: new FormControl(this.elected.organ.id, Validators.required)
        });
    }

    findLocalitySelected(value) {
        this.getLocalityById(value);
    }

    findOrganSelected(value) {
        this.getOrganById(value);
    }

    saveOrUpdate() {
        this.elected = new Elected();
        this.elected = this.electedForm.getRawValue();
        this.elected.locality = this.locality;
        this.elected.organ = this.organ;
        if (!this.elected.id) {
            this._electedsService.create(this.elected).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._electedsService.getElecteds();
                    this._toastr.success(data['message']);
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this.matDialogRef.close();
                }
            });
        } else {
            this._electedsService.update(this.elected).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._electedsService.getElecteds();
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
