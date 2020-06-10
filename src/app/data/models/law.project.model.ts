import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Article} from './article.model';
import {STATE_LAW_PROJECT} from '../enums/enums';
import {Elected} from './elected.model';
import {User} from './user.model';

@Injectable()
export class LawProject implements Deserializable{
    id: number;
    year: string;
    stateLawProject: STATE_LAW_PROJECT;
    article: Article;
    elected: Elected;
    createDate: Date = new Date();
    updateDate: Date;
    
    constructor(lawProject?) {
        lawProject = lawProject || {};
        this.id = lawProject.id;
        this.year = lawProject.year;
        this.stateLawProject = lawProject.stateLawProject;
        this.article = lawProject.article;
        this.elected = lawProject.elected;
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
