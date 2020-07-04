import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgmCoreModule } from '@agm/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDialogModule} from "@angular/material/dialog";
import {MatToolbarModule} from "@angular/material/toolbar";
import {OrgansComponent} from "./organs/organs.component";
import {OrgansService} from "./organs/organs.service";
import {SettingOrganFormDialogComponent} from "./organ-form/organ-form.component";
import {ElectedsComponent} from "./electeds/electeds.component";
import {ElectedsService} from "./electeds/electeds.service";
import {SettingElectedFormDialogComponent} from "./elected-form/elected-form.component";
import {VerificationsService} from "./verifications/verifications.service";
import {VerificationsComponent} from "./verifications/verifications.component";
import {VerificationComponent} from "./verification/verification.component";
import {VerificationService} from "./verification/verification.service";
import {RequestsComponent} from "./requests/requests.component";
import {RequestsService} from "./requests/requests.service";
import {RequestComponent} from './request/request.component';
import {RequestService} from './request/request.service';
import {MatMenuModule} from '@angular/material/menu';
import {RequestAnswerComponent} from './request-answer/request-answer.component';
import {RequestAnswerService} from './request-answer/request-answer.service';
import {VerificationDetailsComponent} from './verification-details/verification-details.component';
import {RequestDetailsComponent} from './request-details/request-details.component';
import {RequestDetailsService} from './request-details/request-details.service';
import {ProjectsService} from './projects/projects.service';
import {ProjectsComponent} from './projects/projects.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import {ProjectService} from './project/project.service';
import {ProjectComponent} from './project/project.component';
import {SpinnerModule} from '../../shared/modules/spinner.module';
import {NgxSpinnerModule} from 'ngx-spinner';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

const routes: Routes = [
    {
        path     : 'verifications',
        component: VerificationsComponent,
        resolve  : {
            data: VerificationsService
        }
    },
    {
        path     : 'verifications/:id',
        component: VerificationComponent,
        resolve  : {
            data: VerificationService
        }
    },
    {
        path     : 'verifications/:id/:label',
        component: VerificationComponent,
        resolve  : {
            data: VerificationService
        }
    },
    {
        path     : 'requests',
        component: RequestsComponent,
        resolve  : {
            data: RequestsService
        }
    },
    {
        path     : 'requests/:id',
        component: RequestComponent,
        resolve  : {
            data: RequestService
        }
    },
    {
        path     : 'requests/:id/:label',
        component: RequestComponent,
        resolve  : {
            data: RequestService
        }
    },
    {
        path     : 'organs',
        component: OrgansComponent,
        resolve  : {
            data: OrgansService
        }
    },
    {
        path     : 'request-answer/:id',
        component: RequestAnswerComponent,
        resolve  : {
            data: RequestAnswerService
        }
    },
    {
        path     : 'request-details/:id',
        component: RequestDetailsComponent,
        resolve  : {
            data: RequestDetailsService
        }
    },
    {
        path     : 'electeds',
        component: ElectedsComponent,
        resolve  : {
            data: ElectedsService
        }
    },
    {
        path     : 'projects',
        component: ProjectsComponent,
        resolve  : {
            data: ProjectsService
        }
    },
    {
        path     : 'projects/:id/:label',
        component: ProjectComponent,
        resolve  : {
            data: ProjectService
        }
    },
    {
        path     : 'projects/:id',
        component: ProjectComponent,
        resolve  : {
            data: ProjectService
        }
    }
];

@NgModule({
    declarations: [
        OrgansComponent,
        ElectedsComponent,
        VerificationsComponent,
        VerificationComponent,
        RequestsComponent,
        RequestComponent,
        ProjectComponent,
        RequestDetailsComponent,
        VerificationDetailsComponent,
        SettingOrganFormDialogComponent,
        RequestAnswerComponent,
        SettingElectedFormDialogComponent,
        ProjectsComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        NgxMaskModule.forRoot(maskConfig),
        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatTooltipModule,

        NgxChartsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),

        FuseSharedModule,
        FuseWidgetModule,
        MatDialogModule,
        MatToolbarModule,
        MatMenuModule,
        SpinnerModule,
        NgxSpinnerModule
    ],
    providers   : [],
    entryComponents: [
        SettingOrganFormDialogComponent,
        SettingElectedFormDialogComponent
    ]
})
export class TrueometerModule
{
}
