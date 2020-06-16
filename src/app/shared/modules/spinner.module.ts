import {NgModule} from '@angular/core';
import {SpinnerComponent} from '../components/spinner/spinner.component';
import {CommonModule} from '@angular/common';
import {SpinnerSmallComponent} from '../components/spinner/spinner.small.component';
import {FuseSharedModule} from '../../../@fuse/shared.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
    declarations: [
        SpinnerComponent,
        SpinnerSmallComponent
    ],
    exports: [
        SpinnerComponent,
        SpinnerSmallComponent
    ],
    imports: [
        MatProgressSpinnerModule,
        CommonModule,
        FuseSharedModule
    ]
})
export class SpinnerModule {
}