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
import {LawCategoriesComponent} from './law-categories/law-categories.component';
import {LawCategoriesService} from './law-categories/law-categories.service';
import {SettingLawCategoryFormDialogComponent} from './law-category-form/law-category-form.component';
import {LawsService} from './laws/laws.service';
import {LawsComponent} from './laws/laws.component';
import {LawComponent} from './law/law.component';
import {LawService} from './law/law.service';
import {LawArticlesService} from './law-articles/law-articles.service';
import {LawArticlesComponent} from './law-articles/law-articles.component';
import {LawArticleComponent} from './law-article/law-article.component';
import {LawArticleService} from './law-article/law-article.service';


const routes: Routes = [
    {
        path     : 'law-categories',
        component: LawCategoriesComponent,
        resolve  : {
            data: LawCategoriesService
        }
    },
    {
        path     : 'laws',
        component: LawsComponent,
        resolve  : {
            data: LawsService
        }
    },
    {
        path     : 'laws/:id',
        component: LawComponent,
        resolve  : {
            data: LawService
        }
    },
    {
        path     : 'laws/:id/:label',
        component: LawComponent,
        resolve  : {
            data: LawService
        }
    },
    {
        path     : 'law-articles',
        component: LawArticlesComponent,
        resolve  : {
            data: LawArticlesService
        }
    },
    {
        path     : 'law-articles/:id',
        component: LawArticleComponent,
        resolve  : {
            data: LawArticleService
        }
    },
    {
        path     : 'law-articles/:id/:label',
        component: LawArticleComponent,
        resolve  : {
            data: LawArticleService
        }
    }
];

@NgModule({
    declarations: [
        LawCategoriesComponent,
        LawsComponent,
        LawComponent,
        LawArticlesComponent,
        LawArticleComponent,
        SettingLawCategoryFormDialogComponent
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
        MatToolbarModule
    ],
    providers   : [],
    entryComponents: [
        SettingLawCategoryFormDialogComponent
    ]
})
export class NormeModule
{
}
