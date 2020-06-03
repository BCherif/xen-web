import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Article} from './article.model';
import {JUDGMENT, STATE_FOLDER} from '../enums/enums';
import {Jurisdiction} from './jurisdiction.model';

@Injectable()
export class LegalFolder implements Deserializable{
    id: number;
    stateFolder: STATE_FOLDER;
    judgment: JUDGMENT;
    nameOfAccused: string;
    decisionOfJurisdiction: string;
    motivation: string;
    amountAtStake: number;
    dateOfCharge: Date;
    dateOfJudment: Date;
    dateStopCA: Date;
    dateStopCS: Date;
    article: Article;
    jurisdiction: Jurisdiction;

    constructor(legalFolder?) {
        legalFolder = legalFolder || {};
        this.id = legalFolder.id;
        this.stateFolder = legalFolder.stateFolder;
        this.judgment = legalFolder.judgment;
        this.article = legalFolder.article;
        this.jurisdiction = legalFolder.jurisdiction;
        this.nameOfAccused = legalFolder.nameOfAccused;
        this.decisionOfJurisdiction = legalFolder.decisionOfJurisdiction;
        this.motivation = legalFolder.motivation;
        this.amountAtStake = legalFolder.amountAtStake;
        this.dateOfCharge = legalFolder.dateOfCharge;
        this.dateOfJudment = legalFolder.dateOfJudment;
        this.dateStopCA = legalFolder.dateStopCA;
        this.dateStopCS = legalFolder.dateStopCS;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
