import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';
import {AuthBody} from "../../../utils/auth-body";
import { takeUntil } from 'rxjs/internal/operators';
import {Subject} from "rxjs";
import {environment} from "../../../../environments/environment";
import {AuthService} from "../../../services/auth.service";
import {FuseNavigationService} from "../../../../@fuse/components/navigation/navigation.service";
import {FuseSidebarService} from "../../../../@fuse/components/sidebar/sidebar.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {XensaUtils} from '../../../utils/xensa-utils';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'auth-reset-password-form-dialog',
    templateUrl: './reset-password-form.component.html',
    styleUrls: ['./reset-password-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AuthResetPasswordFormDialogComponent implements OnInit {
    action: string;
    resetForm: FormGroup;
    dialogTitle: string;
    xensaUtils = new XensaUtils();
    currentUser = this.xensaUtils.getAppUser();

    // Private
    private _unsubscribeAll: Subject<any>;
    hide = true;


    /**
     * Constructor
     *
     * @param {MatDialogRef<AuthResetPasswordFormDialogComponent>} matDialogRef
     * @param _data
     * @param authService
     * @param _fuseNavigationService
     * @param _fuseSidebarService
     * @param _toastr
     * @param router
     * @param _fuseNavigationService
     * @param _fuseSidebarService
     * @param {FormBuilder} _formBuilder
     * @param _spinnerService
     */
    constructor(
        public matDialogRef: MatDialogRef<AuthResetPasswordFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private authService: AuthService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _toastr: ToastrService,
        private router: Router,
        private _formBuilder: FormBuilder,
        private _spinnerService: NgxSpinnerService
    ) {

        this.dialogTitle = 'Changement de mot de passe';

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.createAuthForm();
    }

    ngOnInit(): void {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create auth form
     *
     * @returns {FormGroup}
     */
    createAuthForm() {
        this.resetForm = this._formBuilder.group({
            oldPassword          : ['', Validators.required],
            newPassword       : ['', Validators.required],
            confirmPassword: ['', [Validators.required, confirmPasswordValidator]],
        });
        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.resetForm.get('newPassword').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.resetForm.get('confirmPassword').updateValueAndValidity();
            });
    }

    onResetPassword() {
        this._spinnerService.show();
        let authBody = new AuthBody();
        authBody.userId = this.currentUser.id;
        authBody.oldPassword = this.resetForm.value.oldPassword;
        authBody.newPassword = this.resetForm.value.newPassword;
        this.authService.updatePwd(authBody).subscribe(ret => {
            if (ret['status'] === 'OK') {
                this._toastr.success(ret['message']);
                this.matDialogRef.close();

                this.router.navigate(['/auth/login']);
                this._spinnerService.hide();
            } else {
                this._toastr.error(ret['message']);
                this._spinnerService.hide();
            }
        }, e => {
            // console.log(e);
            this._toastr.error(environment.errorMessage);
        });

    }

}
/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if ( !control.parent || !control )
    {
        return null;
    }

    const newPassword = control.parent.get('newPassword');
    const confirmPassword = control.parent.get('confirmPassword');

    if ( !newPassword || !confirmPassword )
    {
        return null;
    }

    if ( confirmPassword.value === '' )
    {
        return null;
    }

    if ( newPassword.value === confirmPassword.value )
    {
        return null;
    }

    return {'passwordsNotMatching': true};
};
