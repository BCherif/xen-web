import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Article} from '../../../data/models/article.model';
import {SUB_CATEGORY} from '../../../data/enums/enums';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';
import {ArticlesService} from '../articles/articles.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'governometer-article-details-dialog',
    templateUrl: './article-details.component.html',
    styleUrls: ['./article-details.component.css']
})
export class ArticleDetailsComponent {

    article: Article;
    subCategory = SUB_CATEGORY;

    confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

    constructor(
        public matDialogRef: MatDialogRef<ArticleDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _articlesService: ArticlesService,
        private _matDialog: MatDialog,
        private _toastr: ToastrService
    ) {
        this.article = _data.article;
    }

    validation(article: Article) {
        this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Etes-vous sûre de valider cet article';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._articlesService.publish(article).subscribe(data => {
                    if (data['status'] === 'OK') {
                        this._toastr.success(data['message']);
                        const articleIndex = this._articlesService.articles.indexOf(article);
                        this._articlesService.articles.splice(articleIndex, 1, data['response']);
                        this._articlesService.onArticlesChanged.next(this._articlesService.articles);
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
