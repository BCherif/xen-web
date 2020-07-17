import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Article} from './article.model';
import {INITIATOR, STATE_LAW_PROJECT} from '../enums/enums';

@Injectable()
export class LawProject implements Deserializable{
    id: number;
    year: Date;
    stateLawProject: STATE_LAW_PROJECT;
    article: Article;
    initiator: INITIATOR;
    ischeck: boolean;
    createDate: Date = new Date();
    updateDate: Date;
    
    constructor(lawProject?) {
        lawProject = lawProject || {};
        this.id = lawProject.id;
        this.year = lawProject.year;
        this.stateLawProject = lawProject.stateLawProject;
        this.article = lawProject.article;
        this.initiator = lawProject.initiator;
        this.ischeck = lawProject.ischeck;
        this.createDate = lawProject.createDate;
        this.updateDate = lawProject.updateDate;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
