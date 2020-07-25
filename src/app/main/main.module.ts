import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {FuseSharedModule} from '@fuse/shared.module';
import {AngularEditorModule} from '@kolkov/angular-editor';

const routes = [
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
    },
    {
        path: 'setting',
        loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule)
    },
    {
        path: 'governometer',
        loadChildren: () => import('./governometer/governometer.module').then(m => m.GovernometerModule)
    },
    {
        path: 'corryptometer',
        loadChildren: () => import('./corryptometer/corryptometer.module').then(m => m.CorryptometerModule)
    },
    {
        path: 'participation',
        loadChildren: () => import('./participation/participation.module').then(m => m.ParticipationModule)
    },
    {
        path: 'trueometer',
        loadChildren: () => import('./trueometer/trueometer.module').then(m => m.TrueometerModule)
    },
    {
        path: 'publications',
        loadChildren: () => import('./publications/publications.module').then(m => m.PublicationsModule)
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule,
        AngularEditorModule
    ]
})
export class MainModule {
}
