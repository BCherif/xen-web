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

import { NgxMaskModule, IConfig } from 'ngx-mask';
import {MatMenuModule} from '@angular/material/menu';
import {ArticlesComponent} from './articles/articles.component';
import {ArticlesService} from './articles/articles.service';
import {ArticleComponent} from './article/article.component';
import {ArticleService} from './article/article.service';
import {SpinnerModule} from '../../shared/modules/spinner.module';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {CKEditorModule} from 'ckeditor4-angular';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MaterialFileInputModule} from 'ngx-material-file-input';


const maskConfig: Partial<IConfig> = {
    validation: false,
};

const routes: Routes = [
    {
        path: 'articles',
        component: ArticlesComponent,
        resolve: {
            data: ArticlesService
        }
    },
    {
        path: 'articles/:id',
        component: ArticleComponent,
        resolve: {
            data: ArticleService
        }
    },
    {
        path: 'articles/:id/:title',
        component: ArticleComponent,
        resolve: {
            data: ArticleService
        }
    }
];

@NgModule({
    declarations: [
        ArticlesComponent,
        ArticleComponent
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
        CKEditorModule,
        AngularEditorModule,
        NgxSpinnerModule,
        MaterialFileInputModule
    ],
    providers   : [],
    entryComponents: [
    ]
})
export class GovernometerModule
{
}
