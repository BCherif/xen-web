import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Petition} from '../../../data/models/petition.model';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';
import {PetitionsService} from '../petitions/petitions.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'participation-details-petition-dialog',
    templateUrl: './details-petitions.component.html',
    styleUrls: ['./details-petitions.component.css']
})
export class DetailsPetitionsComponent {

    petition: Petition;

    confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

    constructor(
        public matDialogRef: MatDialogRef<DetailsPetitionsComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _petitionsService: PetitionsService,
        private _matDialog: MatDialog,
        private _toastr: ToastrService
    ) {
        this.petition = _data.petition;
    }

    validation(petition: Petition) {
        this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Etes-vous sûre de valider la petition ';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._petitionsService.publish(petition).subscribe(data => {
                    if (data['status'] === 'OK') {
                        this._toastr.success(data['message']);
                        const petitionIndex = this._petitionsService.petitions.indexOf(petition);
                        this._petitionsService.petitions.splice(petitionIndex, 1, data['response']);
                        this._petitionsService.onPetitionsChanged.next(this._petitionsService.petitions);
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
