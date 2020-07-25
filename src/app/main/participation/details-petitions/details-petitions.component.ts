import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Petition} from '../../../data/models/petition.model';

@Component({
  selector: 'participation-details-petition-dialog',
  templateUrl: './details-petitions.component.html',
  styleUrls: ['./details-petitions.component.css']
})
export class DetailsPetitionsComponent {

  petition: Petition;

  constructor(
    public matDialogRef: MatDialogRef<DetailsPetitionsComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {
    this.petition = _data.petition;
  }
}
