import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Form} from '../../../data/models/form.model';
import {FormsService} from '../forms/forms.service';
import {CATEGORY_FORM} from '../../../data/enums/enums';
import {Domain} from '../../../data/models/domain.model';
import {DomainsService} from '../../setting/domains/domains.service';

@Component({
    selector: 'publications-add-form-dialog',
    templateUrl: './add-form.component.html',
    styleUrls: ['./add-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class PublicationsAddFormDialogComponent implements OnInit {
    action: string;
    form: Form;
    addForm: FormGroup;
    categoryForm = CATEGORY_FORM;
    domains: Domain[];
    categories: any[];
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<PublicationsAddFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     * @param _formsService
     * @param _domainsService
     * @param _toastr
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<PublicationsAddFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _formsService: FormsService,
        private _domainsService: DomainsService,
        private _toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Modifier un formulaire';
            this.form = _data.form;
        } else {
            this.dialogTitle = 'Ajouter un formulaire';
            this.form = new Form({});
        }

        this.addForm = this.createForm();
    }

    ngOnInit() {
        this.categories = Object.keys(this.categoryForm);
        this.getDomains();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create form
     *
     * @returns {FormGroup}
     */
    createForm() {
        return this._formBuilder.group({
            id: new FormControl(this.form.id),
            name: new FormControl(this.form.name, Validators.required),
            categoryForm: new FormControl(this.form.categoryForm, Validators.required),
            domains: new FormControl(this.form.domains, Validators.required)
        });
    }

    getDomains() {
        this._domainsService.getAll().subscribe(value => {
            this.domains = value['response'];
        }, error => console.log(error));
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.form = new Form();
        this.form = this.addForm.getRawValue();
        if (!this.form.id) {
            this._formsService.create(this.form).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._formsService.getForms();
                    this._toastr.success(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                } else {
                    this._toastr.error(data['message']);
                    this._spinnerService.hide();
                    this.matDialogRef.close();
                }
            });
        }
    }
}
