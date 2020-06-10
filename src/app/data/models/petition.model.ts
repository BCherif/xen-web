import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Article} from './article.model';
import {User} from './user.model';

@Injectable()
export class Petition implements Deserializable{
    id: number;
    petitionDate: Date = new Date();
    decisionMaker: string;
    article: Article;
    user: User;
    createDate: Date = new Date();
    updateDate: Date;
    
    constructor(petition?) {
        petition = petition || {};
        this.id = petition.id;
        this.petitionDate = petition.petitionDate;
        this.decisionMaker = petition.decisionMaker;
        this.article = petition.article;
        this.user = petition.user;
        this.createDate = petition.createDate;
        this.updateDate = petition.updateDate;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
