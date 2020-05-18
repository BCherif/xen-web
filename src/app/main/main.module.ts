import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
    {
        path        : 'setting',
        loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule)
    },
    {
        path        : 'trueometer',
        loadChildren: () => import('./trueometer/trueometer.module').then(m => m.TrueometerModule)
    },
    {
        path        : 'norme',
        loadChildren: () => import('./norme/norme.module').then(m => m.NormeModule)
    },
    {
        path        : 'publications',
        loadChildren: () => import('./publications/publications.module').then(m => m.PublicationsModule)
    }
];

@NgModule({
    imports     : [
        RouterModule.forChild(routes),
        FuseSharedModule
    ]
})
export class MainModule
{
}
