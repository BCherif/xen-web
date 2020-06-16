import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatRippleModule} from '@angular/material/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {AgmCoreModule} from '@agm/core';

import {FuseSharedModule} from '@fuse/shared.module';
import {FuseWidgetModule} from '@fuse/components/widget/widget.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';

import {NgxMaskModule, IConfig} from 'ngx-mask';
import {MatMenuModule} from '@angular/material/menu';
import {DenunciationsComponent} from './denunciations/denunciations.component';
import {DenunciationsService} from './denunciations/denunciations.service';
import {DenunciationService} from './denunciation/denunciation.service';
import {DenunciationComponent} from './denunciation/denunciation.component';
import {InterpellationsComponent} from './interpellations/interpellations.component';
import {InterpellationsService} from './interpellations/interpellations.service';
import {InterpellationComponent} from './interpellation/interpellation.component';
import {InterpellationService} from './interpellation/interpellation.service';
import {PetitionsComponent} from './petitions/petitions.component';
import {PetitionsService} from './petitions/petitions.service';
import {LawProjectsComponent} from './law-projects/law-projects.component';
import {LawProjectsService} from './law-projects/law-projects.service';
import {PetitionComponent} from './petition/petition.component';
import {PetitionService} from './petition/petition.service';
import {LawProjectService} from './law-project/law-project.service';
import {LawProjectComponent} from './law-project/law-project.component';
import {CitizenVoicesService} from './citizen-voices/citizen-voices.service';
import {CitizenVoicesComponent} from './citizen-voices/citizen-voices.component';
import {SpinnerModule} from '../../shared/modules/spinner.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {CKEditorModule} from 'ckeditor4-angular';


const maskConfig: Partial<IConfig> = {
    validation: false,
};

const routes: Routes = [
    {
        path: 'citizen-voices',
        component: CitizenVoicesComponent,
        resolve: {
            data: CitizenVoicesService
        }
    },
    {
        path: 'denunciations',
        component: DenunciationsComponent,
        resolve: {
            data: DenunciationsService
        }
    },
    {
        path: 'denunciations/:id',
        component: DenunciationComponent,
        resolve: {
            data: DenunciationService
        }
    },
    {
        path: 'denunciations/:id/:label',
        component: DenunciationComponent,
        resolve: {
            data: DenunciationService
        }
    },
    {
        path: 'interpellations',
        component: InterpellationsComponent,
        resolve: {
            data: InterpellationsService
        }
    },
    {
        path: 'interpellations/:id',
        component: InterpellationComponent,
        resolve: {
            data: InterpellationService
        }
    },
    {
        path: 'interpellations/:id/:label',
        component: InterpellationComponent,
        resolve: {
            data: InterpellationService
        }
    },
    {
        path: 'petitions',
        component: PetitionsComponent,
        resolve: {
            data: PetitionsService
        }
    },
    {
        path: 'petitions/:id',
        component: PetitionComponent,
        resolve: {
            data: PetitionService
        }
    },
    {
        path: 'petitions/:id/:label',
        component: PetitionComponent,
        resolve: {
            data: PetitionService
        }
    },
    {
        path: 'law-projects',
        component: LawProjectsComponent,
        resolve: {
            data: LawProjectsService
        }
    },
    {
        path: 'law-projects/:id',
        component: LawProjectComponent,
        resolve: {
            data: LawProjectService
        }
    },
    {
        path: 'law-projects/:id/:label',
        component: LawProjectComponent,
        resolve: {
            data: LawProjectService
        }
    }
];

@NgModule({
    declarations: [
        DenunciationsComponent,
        DenunciationComponent,
        InterpellationsComponent,
        InterpellationComponent,
        PetitionsComponent,
        LawProjectsComponent,
        PetitionComponent,
        LawProjectComponent,
        CitizenVoicesComponent
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
        MatDatepickerModule,
        CKEditorModule
    ],
    providers: [],
    entryComponents: []
})
export class ParticipationModule {
}
