import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Interpellation} from '../../../data/models/interpellation.model';

@Component({
  selector: 'participation-details-interpellation-dialog',
  templateUrl: './details-interpellation.component.html',
  styleUrls: ['./details-interpellation.component.css']
})
export class DetailsInterpellationComponent {

    interpellation: Interpellation;

  constructor(
    public matDialogRef: MatDialogRef<DetailsInterpellationComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {
    this.interpellation = _data.interpellation;
  }
}
