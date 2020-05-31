import {Deserializable} from './deserializable.wrapper';
import {Injectable} from '@angular/core';
import {Article} from '../models/article.model';
import {LawProject} from '../models/law.project.model';

@Injectable()
export class LawProjectSaveEntity implements Deserializable {
    lawProject: LawProject;
    article: Article;

    constructor(lawProjectSaveEntity?) {
        lawProjectSaveEntity = lawProjectSaveEntity || {};
        this.lawProject = lawProjectSaveEntity.lawProject;
        this.article = lawProjectSaveEntity.article;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

}