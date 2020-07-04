import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';
import {AuthBody} from '../../../utils/auth-body';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../environments/environment';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    authBody: AuthBody;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param router
     * @param authService
     * @param toastr
     * @param _spinnerService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        document.title = 'XENSA | Auth';

        localStorage.removeItem('app-token');
        localStorage.removeItem('isLoggedin');
        this.authBody = new AuthBody();

        this.loginForm = this._formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onLogin(): void {
        this._spinnerService.show();

        this.authBody.username = this.loginForm.value.username;
        this.authBody.password = this.loginForm.value.password;
        this.authService.login(this.authBody).subscribe(ret => {
            if (ret['status'] === 'OK') {
                this.toastr.success(ret['message']);
                // let encoded = btoa(JSON.stringify(ret['response']));
                // console.log('ENCODED : '+encoded);
                // let decoded = atob(encoded);
                // console.log('DECODED : '+decoded);
                localStorage.setItem('app-token', btoa(JSON.stringify(ret['response'])));
                localStorage.setItem('isLoggedin', 'true');

                this.router.navigateByUrl('/main/governometer/articles').then(r => {
                    if (r) {
                        this._spinnerService.hide();
                    }else {
                        console.log("La navigation a échoué!");
                    }
                });
            } else {
                this.toastr.error(ret['message']);
                // console.log(ret['message']);
            }

        }, e => {
            this.toastr.error(environment.errorMessage);
            // console.log(e);
        });

    }
}
