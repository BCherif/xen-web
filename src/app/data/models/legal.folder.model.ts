import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Article} from './article.model';
import {STATE_FOLDER} from '../enums/enums';

@Injectable()
export class LegalFolder implements Deserializable{
    id: number;
    stateFolder: STATE_FOLDER;
    article: Article;

    constructor(legalFolder?) {
        legalFolder = legalFolder || {};
        this.id = legalFolder.id;
        this.stateFolder = legalFolder.stateFolder;
        this.article = legalFolder.article;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
