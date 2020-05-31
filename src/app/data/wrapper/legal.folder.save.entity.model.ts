import {Deserializable} from './deserializable.wrapper';
import {Injectable} from '@angular/core';
import {Article} from '../models/article.model';
import {LegalFolder} from '../models/legal.folder.model';

@Injectable()
export class LegalFolderSaveEntity implements Deserializable {
    legalFolder: LegalFolder;
    article: Article;

    constructor(legalFolderSaveEntity?) {
        legalFolderSaveEntity = legalFolderSaveEntity || {};
        this.legalFolder = legalFolderSaveEntity.legalFolder;
        this.article = legalFolderSaveEntity.article;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

}