import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import {MatPaginatorModule} from "@angular/material/paginator";
import {ToastrModule} from "ngx-toastr";
import {LOCALE_ID} from '@angular/core';
import localeFr from '@angular/common/locales/fr';
import {HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';
import {AuthGuard} from './shared/auth.guard';

registerLocaleData(localeFr);

const appRoutes: Routes = [
    {
        path      : '',
        redirectTo: 'main/publications/articles',
        pathMatch: 'full'
    },
    {
        path        : 'auth/login',
        loadChildren: () => import('./main/auth/login/login.module').then(m => m.LoginModule)
    },
    {
        path        : 'main',
        loadChildren: () => import('./main/main.module').then(m => m.MainModule),
        canActivate: [AuthGuard]
    }/*,
    {
        path      : '**',
        redirectTo: 'main/publications/articles'
    }*/
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        ToastrModule.forRoot({
                closeButton: false,
                newestOnTop: false,
                progressBar: true,
                positionClass: 'toast-top-right',
                preventDuplicates: false,
                timeOut: 3000,
                extendedTimeOut: 1000,
            }
        ),

        // App modules
        LayoutModule,
        SampleModule,
        MatTableModule,
        MatRippleModule,
        MatPaginatorModule
    ],
    providers: [
        {provide: LOCALE_ID, useValue: 'fr-FR'},
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
