import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';


const routes: Routes = [

  /*  {
        path: '', redirectTo: 'main/sample', pathMatch: 'full'
    },
    {
        path: 'auth/login',
        loadChildren: './views/auth/login/login.module#LoginModule'
    },*/
    {
        path: '**',
        redirectTo: 'sample/sample'
    }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
