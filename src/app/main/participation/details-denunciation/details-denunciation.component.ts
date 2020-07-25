import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Petition} from '../../../data/models/petition.model';
import {Denunciation} from '../../../data/models/denunciation.model';

@Component({
  selector: 'participation-details-denunciation-dialog',
  templateUrl: './details-denunciation.component.html',
  styleUrls: ['./details-denunciation.component.css']
})
export class DetailsDenunciationComponent {

  denunciation: Denunciation;

  constructor(
    public matDialogRef: MatDialogRef<DetailsDenunciationComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {
    this.denunciation = _data.denunciation;
  }
}
