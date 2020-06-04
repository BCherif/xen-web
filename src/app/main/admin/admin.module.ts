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
import {RolesComponent} from './roles/roles.component';
import {RolesService} from './roles/roles.service';
import {UsersComponent} from './users/users.component';
import {UsersService} from './users/users.service';
import {AdminCrudUserComponent} from './crud-user/crud-user.component';
import {AdminCrudUserService} from './crud-user/crud-user.service';
import {AdminCrudRoleComponent} from './crud-role/crud-role.component';
import {AdminCrudRoleService} from './crud-role/crud-role.service';
import {MatDividerModule} from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';


const maskConfig: Partial<IConfig> = {
    validation: false,
};

const routes: Routes = [
    {
        path: 'roles',
        component: RolesComponent,
        resolve: {
            data: RolesService
        }
    },
    {
        path: 'roles/by-name/:name',
        component: AdminCrudRoleComponent,
        resolve: {
            data: AdminCrudRoleService
        }
    },
    {
        path: 'roles/:name',
        component: AdminCrudRoleComponent,
        resolve: {
            data: AdminCrudRoleService
        }
    },
    {
        path: 'users',
        component: UsersComponent,
        resolve: {
            data: UsersService
        }
    },
    {
        path: 'users/:id',
        component: AdminCrudUserComponent,
        resolve: {
            data: AdminCrudUserService
        }
    },
    {
        path: 'users/:id/:name',
        component: AdminCrudUserComponent,
        resolve: {
            data: AdminCrudUserService
        }
    }

];

@NgModule({
    declarations: [
        RolesComponent,
        UsersComponent,
        AdminCrudUserComponent,
        AdminCrudRoleComponent
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
        MatDividerModule,
        MatCheckboxModule
    ],
    providers   : [],
    entryComponents: [
    ]
})
export class AdminModule
{
}
