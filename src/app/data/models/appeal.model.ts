import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Injectable} from '@angular/core';
import {DEGREE, JUDGMENT, STATE_FOLDER} from '../enums/enums';
import {LegalFolder} from './legal.folder.model';
import {Locality} from './locality.model';
import {Domain} from './domain.model';
import {Jurisdiction} from './jurisdiction.model';

@Injectable()
export class Appeal implements Deserializable {
    id: number;
    title: string;
    degree: DEGREE;
    nameOfAccused: string;
    judgment: JUDGMENT;
    stateFolder: STATE_FOLDER;
    decisionOfJurisdiction: string;
    motivation: string;
    amountAtStake: number;
    dateAppeal: Date;
    dateOfJudment: Date;
    legalFolder: LegalFolder;
    level: Locality;
    domain: Domain;
    jurisdiction: Jurisdiction;

    constructor(appeal?) {
        appeal = appeal || {};
        this.id = appeal.id;
        this.title = appeal.title;
        this.degree = appeal.degree;
        this.nameOfAccused = appeal.nameOfAccused;
        this.decisionOfJurisdiction = appeal.decisionOfJurisdiction;
        this.motivation = appeal.motivation;
        this.amountAtStake = appeal.amountAtStake;
        this.dateAppeal = appeal.dateAppeal;
        this.dateOfJudment = appeal.dateOfJudment;
        this.level = appeal.level;
        this.domain = appeal.domain;
        this.legalFolder = appeal.legalFolder;
        this.jurisdiction = appeal.jurisdiction;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}