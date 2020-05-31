import {Deserializable} from './deserializable.wrapper';
import {Injectable} from '@angular/core';
import {Article} from '../models/article.model';
import {Denunciation} from '../models/denunciation.model';

@Injectable()
export class DenunciationSaveEntity implements Deserializable {
    denunciation: Denunciation;
    article: Article;

    constructor(denunciationSaveEntity?) {
        denunciationSaveEntity = denunciationSaveEntity || {};
        this.denunciation = denunciationSaveEntity.denunciation;
        this.article = denunciationSaveEntity.article;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

}