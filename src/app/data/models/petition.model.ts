import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Article} from './article.model';

@Injectable()
export class Petition implements Deserializable{
    id: number;
    petitionDate: Date = new Date();
    decisionMaker: string;
    article: Article;
    
    constructor(petition?) {
        petition = petition || {};
        this.id = petition.id;
        this.petitionDate = petition.petitionDate;
        this.decisionMaker = petition.decisionMaker;
        this.article = petition.article;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
