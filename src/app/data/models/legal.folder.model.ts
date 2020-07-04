import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Article} from './article.model';
import {DEGREE, JUDGMENT, STATE_FOLDER} from '../enums/enums';
import {Jurisdiction} from './jurisdiction.model';

@Injectable()
export class LegalFolder implements Deserializable{
    id: number;
    stateFolder: STATE_FOLDER;
    judgment: JUDGMENT;
    degree: DEGREE;
    nameOfAccused: string;
    decisionOfJurisdiction: string;
    motivation: string;
    amountAtStake: number;
    appeal: boolean;
    provide: boolean;
    dateOfCharge: Date;
    dateOfJudment: Date;
    dateOfCall: Date;
    dateOfProvide: Date;
    article: Article;
    jurisdiction: Jurisdiction;
    createDate: Date = new Date();
    updateDate: Date;

    constructor(legalFolder?) {
        legalFolder = legalFolder || {};
        this.id = legalFolder.id;
        this.stateFolder = legalFolder.stateFolder;
        this.judgment = legalFolder.judgment;
        this.article = legalFolder.article;
        this.article = legalFolder.article;
        this.article = legalFolder.article;
        this.jurisdiction = legalFolder.jurisdiction;
        this.nameOfAccused = legalFolder.nameOfAccused;
        this.decisionOfJurisdiction = legalFolder.decisionOfJurisdiction;
        this.appeal = legalFolder.appeal;
        this.provide = legalFolder.provide;
        this.motivation = legalFolder.motivation;
        this.amountAtStake = legalFolder.amountAtStake;
        this.dateOfCharge = legalFolder.dateOfCharge;
        this.dateOfJudment = legalFolder.dateOfJudment;
        this.dateOfCall = legalFolder.dateOfCall;
        this.dateOfProvide = legalFolder.dateOfProvide;
        this.createDate = legalFolder.createDate;
        this.updateDate = legalFolder.updateDate;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
