import {Deserializable} from './deserializable.wrapper';
import {Injectable} from "@angular/core";
import {Interpellation} from '../models/interpellation.model';
import {Article} from '../models/article.model';

@Injectable()
export class InterpellationSaveEntity implements Deserializable{
    interpellation: Interpellation;
    article: Article;

    constructor(interpellationSaveEntity?) {
        interpellationSaveEntity = interpellationSaveEntity || {};
        this.interpellation = interpellationSaveEntity.interpellation ;
        this.article = interpellationSaveEntity.article;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

}