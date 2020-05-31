import {Deserializable} from './deserializable.wrapper';
import {Injectable} from "@angular/core";
import {Article} from '../models/article.model';
import {Petition} from '../models/petition.model';

@Injectable()
export class PetitionSaveEntity implements Deserializable{
    petition: Petition;
    article: Article;

    constructor(petitionSaveEntity?) {
        petitionSaveEntity = petitionSaveEntity || {};
        this.petition = petitionSaveEntity.petition ;
        this.article = petitionSaveEntity.article;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

}