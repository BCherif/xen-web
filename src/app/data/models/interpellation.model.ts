import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Injectable} from '@angular/core';
import {Elected} from './elected.model';
import {Organ} from './organ.model';
import {CALL_AS, ORGAN_CALL} from '../enums/enums';
import {Article} from './article.model';

@Injectable()
export class Interpellation implements Deserializable {
    id: number;
    interpelDate: Date = new Date();
    response: string;
    author: string;
    answered: boolean;
    callAs: CALL_AS;
    organCall: ORGAN_CALL;
    electeds: Elected[];
    organs: Organ[];
    article: Article;
    ischeck: boolean;
    invalidate: boolean = true;
    createDate: Date = new Date();
    updateDate: Date;

    constructor(interpellation?) {
        interpellation = interpellation || {};
        this.id = interpellation.id;
        this.interpelDate = interpellation.interpelDate;
        this.response = interpellation.response;
        this.author = interpellation.author;
        this.answered = interpellation.answered;
        this.callAs = interpellation.callAs;
        this.organCall = interpellation.organCall;
        this.electeds = interpellation.electeds;
        this.organs = interpellation.organs;
        this.ischeck = interpellation.ischeck;
        this.invalidate = interpellation.invalidate;
        this.article = interpellation.article;
        this.createDate = interpellation.createDate;
        this.updateDate = interpellation.updateDate;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
