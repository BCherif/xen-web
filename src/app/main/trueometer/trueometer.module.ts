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
import {InterpellationsComponent} from './interpellations/interpellations.component';
import {InterpellationsService} from './interpellations/interpellations.service';
import {InterpellationComponent} from './interpellation/interpellation.component';
import {InterpellationService} from './interpellation/interpellation.service';
import {MatMenuModule} from '@angular/material/menu';
import {RequestAnswerComponent} from './request-answer/request-answer.component';
import {RequestAnswerService} from './request-answer/request-answer.service';
import {VerificationDetailsComponent} from './verification-details/verification-details.component';
import {VerificationDetailsService} from './verification-details/verification-details.service';
import {RequestDetailsComponent} from './request-details/request-details.component';
import {RequestDetailsService} from './request-details/request-details.service';
import {InterpellationDetailsComponent} from './interpellation-details/interpellation-details.component';
import {InterpellationDetailsService} from './interpellation-details/interpellation-details.service';

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
        path     : 'interpellations',
        component: InterpellationsComponent,
        resolve  : {
            data: InterpellationsService
        }
    },
    {
        path     : 'interpellations/:id',
        component: InterpellationComponent,
        resolve  : {
            data: InterpellationService
        }
    },
    {
        path     : 'interpellations/:id/:label',
        component: InterpellationComponent,
        resolve  : {
            data: InterpellationService
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
        path     : 'interpellation-details/:id',
        component: InterpellationDetailsComponent,
        resolve  : {
            data: InterpellationDetailsService
        }
    },
    {
        path     : 'verification-details/:id',
        component: VerificationDetailsComponent,
        resolve  : {
            data: VerificationDetailsService
        }
    },
    {
        path     : 'electeds',
        component: ElectedsComponent,
        resolve  : {
            data: ElectedsService
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
        RequestDetailsComponent,
        VerificationDetailsComponent,
        InterpellationsComponent,
        InterpellationComponent,
        InterpellationDetailsComponent,
        SettingOrganFormDialogComponent,
        RequestAnswerComponent,
        SettingElectedFormDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),
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
        MatMenuModule
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
