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
import {FormsService} from './forms/forms.service';
import {FormsComponent} from './forms/forms.component';
import {FormComponent} from './form/form.component';
import {FormService} from './form/form.service';
import {QuizzesService} from './quizzes/quizzes.service';
import {QuizzesComponent} from './quizzes/quizzes.component';
import {MatMenuModule} from '@angular/material/menu';
import {ResponsesService} from './responses/responses.service';
import {ResponsesComponent} from './responses/responses.component';
import {ResponseService} from './response/response.service';
import {ResponseComponent} from './response/response.component';
import {SpinnerModule} from '../../shared/modules/spinner.module';


const routes: Routes = [
    {
        path: 'quizzes',
        component: QuizzesComponent,
        resolve: {
            data: QuizzesService
        }
    },
    {
        path: 'responses',
        component: ResponsesComponent,
        resolve: {
            data: ResponsesService
        }
    },
    {
        path: 'forms',
        component: FormsComponent,
        resolve: {
            data: FormsService
        }
    },
    {
        path: 'forms/:id',
        component: FormComponent,
        resolve: {
            data: FormService
        }
    },
    {
        path: 'forms/:id/:label',
        component: FormComponent,
        resolve: {
            data: FormService
        }
    },
    {
        path: 'responses/:id',
        component: ResponseComponent,
        resolve: {
            data: ResponseService
        }
    },
    {
        path: 'responses/:id/:label',
        component: ResponseComponent,
        resolve: {
            data: ResponseService
        }
    }
];

@NgModule({
    declarations: [
        QuizzesComponent,
        FormsComponent,
        FormComponent,
        ResponsesComponent,
        ResponseComponent
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
        MatMenuModule,
        SpinnerModule
    ],
    providers: [],
    entryComponents: []
})
export class PublicationsModule {
}
