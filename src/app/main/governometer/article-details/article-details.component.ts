import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Article} from '../../../data/models/article.model';
import {SUB_CATEGORY} from '../../../data/enums/enums';

@Component({
    selector: 'governometer-article-details-dialog',
    templateUrl: './article-details.component.html',
    styleUrls: ['./article-details.component.css']
})
export class ArticleDetailsComponent {

    article: Article;
    subCategory = SUB_CATEGORY;

    constructor(
        public matDialogRef: MatDialogRef<ArticleDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        this.article = _data.article;
    }
}
