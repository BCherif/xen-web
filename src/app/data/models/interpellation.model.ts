import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Elected} from "./elected.model";
import {Organ} from "./organ.model";
import {CALL_AS, ORGAN_CALL} from '../enums/enums';
import {Article} from './article.model';
import {User} from './user.model';

@Injectable()
export class Interpellation implements Deserializable{
    id: number;
    interpelDate: Date = new Date();
    response: string;
    author: string;
    callAs: CALL_AS;
    organCall: ORGAN_CALL;
    elected: Elected;
    article: Article;
    organ: Organ;
    user: User;

    constructor(interpellation?) {
        interpellation = interpellation || {};
        this.id = interpellation.id;
        this.interpelDate = interpellation.interpelDate;
        this.response = interpellation.response;
        this.author = interpellation.author;
        this.callAs = interpellation.callAs;
        this.organCall = interpellation.organCall;
        this.elected = interpellation.elected;
        this.article = interpellation.article;
        this.organ = interpellation.organ;
        this.user = interpellation.user;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
