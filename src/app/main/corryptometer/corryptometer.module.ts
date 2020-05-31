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
import {LegalFoldersComponent} from './legal-folders/legal-folders.component';
import {LegalFoldersService} from './legal-folders/legal-folders.service';
import {LegalFolderService} from './legal-folder/legal-folder.service';
import {LegalFolderComponent} from './legal-folder/legal-folder.component';


const maskConfig: Partial<IConfig> = {
    validation: false,
};

const routes: Routes = [
    {
        path: 'legal-folders',
        component: LegalFoldersComponent,
        resolve: {
            data: LegalFoldersService
        }
    },
    {
        path: 'legal-folders/:id',
        component: LegalFolderComponent,
        resolve: {
            data: LegalFolderService
        }
    },
    {
        path: 'legal-folders/:id/:label',
        component: LegalFolderComponent,
        resolve: {
            data: LegalFolderService
        }
    }
];

@NgModule({
    declarations: [
        LegalFoldersComponent,
        LegalFolderComponent
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
        MatMenuModule
    ],
    providers: [],
    entryComponents: []
})
export class CorryptometerModule {
}
