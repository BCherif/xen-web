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
import {ArticlesService} from './articles/articles.service';
import {ArticlesComponent} from './articles/articles.component';
import {ArticleComponent} from './article/article.component';
import {ArticleService} from './article/article.service';
import {LawProjectsComponent} from './law-projects/law-projects.component';
import {LawProjectsService} from './law-projects/law-projects.service';
import {LegalFoldersService} from './legal-folders/legal-folders.service';
import {LegalFoldersComponent} from './legal-folders/legal-folders.component';
import {DenunciationsComponent} from './denunciations/denunciations.component';
import {DenunciationsService} from './denunciations/denunciations.service';
import {PetitionsComponent} from './petitions/petitions.component';
import {PetitionsService} from './petitions/petitions.service';
import {FormsService} from './forms/forms.service';
import {FormsComponent} from './forms/forms.component';
import {FormComponent} from './form/form.component';
import {FormService} from './form/form.service';


const routes: Routes = [
    {
        path     : 'articles',
        component: ArticlesComponent,
        resolve  : {
            data: ArticlesService
        }
    },
    {
        path     : 'denunciations',
        component: DenunciationsComponent,
        resolve  : {
            data: DenunciationsService
        }
    },
    {
        path     : 'petitions',
        component: PetitionsComponent,
        resolve  : {
            data: PetitionsService
        }
    },
    {
        path     : 'law-projects',
        component: LawProjectsComponent,
        resolve  : {
            data: LawProjectsService
        }
    },
    {
        path     : 'legal-folders',
        component: LegalFoldersComponent,
        resolve  : {
            data: LegalFoldersService
        }
    },
    {
        path     : 'articles/:id',
        component: ArticleComponent,
        resolve  : {
            data: ArticleService
        }
    },
    {
        path     : 'articles/:id/:label',
        component: ArticleComponent,
        resolve  : {
            data: ArticleService
        }
    },
    {
        path     : 'forms',
        component: FormsComponent,
        resolve  : {
            data: FormsService
        }
    },
    {
        path     : 'forms/:id',
        component: FormComponent,
        resolve  : {
            data: FormService
        }
    },
    {
        path     : 'forms/:id/:label',
        component: FormComponent,
        resolve  : {
            data: FormService
        }
    }
];

@NgModule({
    declarations: [
        ArticlesComponent,
        ArticleComponent,
        LawProjectsComponent,
        LegalFoldersComponent,
        DenunciationsComponent,
        PetitionsComponent,
        FormsComponent,
        FormComponent
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

    ]
})
export class PublicationsModule
{
}
