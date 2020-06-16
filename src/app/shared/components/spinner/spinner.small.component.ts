import {AfterViewChecked, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {HttpProgressState, IHttpState} from '../../http/http-progress-state';
import {HttpStateService} from '../../http/http-state.service';

@Component({
    selector: 'http-spinner-small',
    templateUrl: './spinner.small.component.html',
    styleUrls: ['./spinner.small.component.scss']
})
export class SpinnerSmallComponent implements OnInit, OnDestroy, AfterViewChecked {
    public loading = false;
    @Input() public filterBy: string | null = null;

    constructor(private httpStateService: HttpStateService,
                private cdRef: ChangeDetectorRef) {
    }

    /**
     * receives all HTTP requests and filters them by the filterBy
     * values provided
     */
    ngOnInit(): void {
        this.activateSpinner();
    }

    ngAfterViewChecked(): void {
        // this.activateSpinner();
    }

    ngOnDestroy(): void {
    }

    activateSpinner(): void {
        this.httpStateService.state.subscribe((progress: IHttpState) => {
            if (progress && progress.url) {
                // console.log('progress && progress.url');
                if (!this.filterBy) {
                    // console.log('!this.filterBy');
                    this.loading = (progress.state === HttpProgressState.start);
                    this.cdRef.detectChanges();
                } else if (progress.url.indexOf(this.filterBy) !== -1) {
                    // console.log('progress.url.indexOf(this.filterBy) !== -1');
                    this.loading = (progress.state === HttpProgressState.start);
                    this.cdRef.detectChanges();
                }
            }
        });
    }
}
