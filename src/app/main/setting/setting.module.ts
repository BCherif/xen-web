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

import {NgxDaterangepickerMd} from 'ngx-daterangepicker-material';

import {FuseSharedModule} from '@fuse/shared.module';
import {FuseWidgetModule} from '@fuse/components/widget/widget.module';
import {CategoriesService} from './categories/categories.service';
import {CategoriesComponent} from './categories/categories.component';
import {SettingCategoryFormDialogComponent} from './category-form/category-form.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {CuttingsComponent} from './cuttings/cuttings.component';
import {CuttingsService} from './cuttings/cuttings.service';
import {SettingCuttingFormDialogComponent} from './cutting-form/cutting-form.component';
import {LocalitiesService} from './localities/localities.service';
import {LocalitiesComponent} from './localities/localities.component';
import {SettingLocalityFormDialogComponent} from './locality-form/locality-form.component';
import {AxesComponent} from './axes/axes.component';
import {AxesService} from './axes/axes.service';
import {SettingAxeFormDialogComponent} from './axe-form/axe-form.component';
import {DomainsComponent} from './domains/domains.component';
import {DomainsService} from './domains/domains.service';
import {SettingDomainFormDialogComponent} from './domain-form/domain-form.component';
import {ProgramsService} from './programs/programs.service';
import {ProgramsComponent} from './programs/programs.component';
import {ProgramService} from './program/program.service';
import {ProgramComponent} from './program/program.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {SatDatepickerModule, SatNativeDateModule} from 'saturn-datepicker';
import {MatMenuModule} from '@angular/material/menu';
import {SpinnerModule} from '../../shared/modules/spinner.module';
import {NgxSpinnerModule} from 'ngx-spinner';


const routes: Routes = [
    {
        path: 'categories',
        component: CategoriesComponent,
        resolve: {
            data: CategoriesService
        }
    },
    {
        path: 'cuttings',
        component: CuttingsComponent,
        resolve: {
            data: CuttingsService
        }
    },
    {
        path: 'localities',
        component: LocalitiesComponent,
        resolve: {
            data: LocalitiesService
        }
    },
    {
        path: 'axes',
        component: AxesComponent,
        resolve: {
            data: AxesService
        }
    },
    {
        path: 'domains',
        component: DomainsComponent,
        resolve: {
            data: DomainsService
        }
    },
    {
        path: 'programs',
        component: ProgramsComponent,
        resolve: {
            data: ProgramsService
        }
    },
    {
        path: 'programs/:id',
        component: ProgramComponent,
        resolve: {
            data: ProgramService
        }
    },
    {
        path: 'programs/:id/:label',
        component: ProgramComponent,
        resolve: {
            data: ProgramService
        }
    },
];

@NgModule({
    declarations: [
        CategoriesComponent,
        CuttingsComponent,
        ProgramsComponent,
        ProgramComponent,
        SettingCategoryFormDialogComponent,
        SettingCuttingFormDialogComponent,
        LocalitiesComponent,
        AxesComponent,
        DomainsComponent,
        SettingLocalityFormDialogComponent,
        SettingAxeFormDialogComponent,
        SettingDomainFormDialogComponent
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
        NgxDaterangepickerMd.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),

        FuseSharedModule,
        FuseWidgetModule,
        MatDialogModule,
        MatToolbarModule,
        MatDatepickerModule,
        SatDatepickerModule,
        SatNativeDateModule,
        MatMenuModule,
        SpinnerModule,
        NgxSpinnerModule
    ],
    providers: [],
    entryComponents: [
        SettingCategoryFormDialogComponent,
        SettingCuttingFormDialogComponent,
        SettingLocalityFormDialogComponent,
        SettingAxeFormDialogComponent,
        SettingDomainFormDialogComponent
    ]
})
export class SettingModule {
}
