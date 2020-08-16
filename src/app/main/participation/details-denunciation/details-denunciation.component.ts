import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Denunciation} from '../../../data/models/denunciation.model';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';
import {DenunciationsService} from '../denunciations/denunciations.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'participation-details-denunciation-dialog',
    templateUrl: './details-denunciation.component.html',
    styleUrls: ['./details-denunciation.component.css']
})
export class DetailsDenunciationComponent {

    denunciation: Denunciation;

    confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

    constructor(
        public matDialogRef: MatDialogRef<DetailsDenunciationComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        public _denunciationService: DenunciationsService,
        private _matDialog: MatDialog,
        private _toastr: ToastrService
    ) {
        this.denunciation = _data.denunciation;
    }

    validation(denunciation: Denunciation) {
        this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Etes-vous sûre de valider la denonciation';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._denunciationService.publish(denunciation).subscribe(data => {
                    if (data['status'] === 'OK') {
                        this._toastr.success(data['message']);
                        const denunciationIndex = this._denunciationService.denunciations.indexOf(denunciation);
                        this._denunciationService.denunciations.splice(denunciationIndex, 1, data['response']);
                        this._denunciationService.onDenunciationsChanged.next(this._denunciationService.denunciations);
                        this.matDialogRef.close();
                    } else {
                        this._toastr.error(data['message']);
                        this.matDialogRef.close();
                    }
                }, error => console.log(error));
            }
        });
    }

    toPublish(denunciation: Denunciation) {
        this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Etes-vous sûre de démoderer la denonciation';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                denunciation.article.ischeck = false;
                denunciation.ischeck = false;
                this._denunciationService.toPublish(denunciation).subscribe(data => {
                    if (data['status'] === 'OK') {
                        this._toastr.success(data['message']);
                        const denunciationIndex = this._denunciationService.denunciations.indexOf(denunciation);
                        this._denunciationService.denunciations.splice(denunciationIndex, 1, data['response']);
                        this._denunciationService.onDenunciationsChanged.next(this._denunciationService.denunciations);
                        this.matDialogRef.close();
                    } else {
                        this._toastr.error(data['message']);
                        this.matDialogRef.close();
                    }
                }, error => console.log(error));
            }
        });
    }
}
