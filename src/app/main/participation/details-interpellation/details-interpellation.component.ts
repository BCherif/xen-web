import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Interpellation} from '../../../data/models/interpellation.model';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';
import {ToastrService} from 'ngx-toastr';
import {InterpellationsService} from '../interpellations/interpellations.service';

@Component({
    selector: 'participation-details-interpellation-dialog',
    templateUrl: './details-interpellation.component.html',
    styleUrls: ['./details-interpellation.component.css']
})
export class DetailsInterpellationComponent {

    confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

    interpellation: Interpellation;

    constructor(
        public matDialogRef: MatDialogRef<DetailsInterpellationComponent>,
        private _interpellationsService: InterpellationsService,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _matDialog: MatDialog,
        private _toastr: ToastrService
    ) {
        this.interpellation = _data.interpellation;
    }

    validation(interpellation: Interpellation) {
        this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Etes-vous sûre de valider cette interpellation';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._interpellationsService.publish(interpellation).subscribe(data => {
                    if (data['status'] === 'OK') {
                        this._toastr.success(data['message']);
                        const interpellationIndex = this._interpellationsService.interpellations.indexOf(interpellation);
                        this._interpellationsService.interpellations.splice(interpellationIndex, 1, data['response']);
                        this._interpellationsService.onInterpellationsChanged.next(this._interpellationsService.interpellations);
                        this.matDialogRef.close();
                    } else {
                        this._toastr.error(data['message']);
                    }
                }, error => console.log(error));
            }
        });
    }

    toPublish(interpellation: Interpellation) {
        this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Etes-vous sûre de démoderer cette interpellation';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                interpellation.ischeck = false;
                interpellation.article.ischeck = false;
                this._interpellationsService.toPublish(interpellation).subscribe(data => {
                    if (data['status'] === 'OK') {
                        this._toastr.success(data['message']);
                        const interpellationIndex = this._interpellationsService.interpellations.indexOf(interpellation);
                        this._interpellationsService.interpellations.splice(interpellationIndex, 1, data['response']);
                        this._interpellationsService.onInterpellationsChanged.next(this._interpellationsService.interpellations);
                        this.matDialogRef.close();
                    } else {
                        this._toastr.error(data['message']);
                    }
                }, error => console.log(error));
            }
        });
    }
}
