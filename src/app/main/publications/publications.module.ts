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
import {QuizzesService} from './quizzes/quizzes.service';
import {QuizzesComponent} from './quizzes/quizzes.component';
import {MatMenuModule} from '@angular/material/menu';
import {ResponsesService} from './responses/responses.service';
import {ResponsesComponent} from './responses/responses.component';
import {ResponseService} from './response/response.service';
import {ResponseComponent} from './response/response.component';
import {SpinnerModule} from '../../shared/modules/spinner.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import {PublicationsAddFormDialogComponent} from './add-form/add-form.component';
import {PublicationsAddQuizDialogComponent} from './add-quiz/add-quiz.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {QuizCategoriesService} from './quiz-categories/quiz-categories.service';
import {QuizCategoriesComponent} from './quiz-categories/quiz-categories.component';
import {PublicationsAddCategoryDialogComponent} from './add-category/add-category.component';
import {PublicationsAffectQuizDialogComponent} from './affect-quiz/affect-quiz.component';


const routes: Routes = [
    {
        path: 'quizzes',
        component: QuizzesComponent,
        resolve: {
            data: QuizzesService
        }
    },
    {
        path: 'quiz-categories',
        component: QuizCategoriesComponent,
        resolve: {
            data: QuizCategoriesService
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
        ResponsesComponent,
        ResponseComponent,
        QuizCategoriesComponent,
        PublicationsAddFormDialogComponent,
        PublicationsAddQuizDialogComponent,
        PublicationsAddCategoryDialogComponent,
        PublicationsAffectQuizDialogComponent
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
        SpinnerModule,
        NgxSpinnerModule,
        MatCheckboxModule,
        MatDatepickerModule
    ],
    providers: [],
    entryComponents: [
        PublicationsAddFormDialogComponent,
        PublicationsAddQuizDialogComponent,
        PublicationsAddCategoryDialogComponent,
        PublicationsAffectQuizDialogComponent
    ]
})
export class PublicationsModule {
}
