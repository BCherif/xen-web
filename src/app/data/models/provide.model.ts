import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Injectable} from '@angular/core';
import {CS_JUDGMENT, DEGREE, STATE_FOLDER} from '../enums/enums';
import {LegalFolder} from './legal.folder.model';
import {Locality} from './locality.model';
import {Domain} from './domain.model';
import {Jurisdiction} from './jurisdiction.model';

@Injectable()
export class Provide implements Deserializable {
    id: number;
    title: string;
    degree: DEGREE;
    nameOfAccused: string;
    judgment: CS_JUDGMENT;
    stateFolder: STATE_FOLDER;
    decisionOfJurisdiction: string;
    motivation: string;
    amountAtStake: number;
    dateProvide: Date;
    dateOfJudment: Date;
    legalFolder: LegalFolder;
    level: Locality;
    domain: Domain;
    jurisdiction: Jurisdiction;

    constructor(provide?) {
        provide = provide || {};
        this.id = provide.id;
        this.title = provide.title;
        this.degree = provide.degree;
        this.nameOfAccused = provide.nameOfAccused;
        this.decisionOfJurisdiction = provide.decisionOfJurisdiction;
        this.motivation = provide.motivation;
        this.amountAtStake = provide.amountAtStake;
        this.dateProvide = provide.dateAppeal;
        this.dateOfJudment = provide.dateOfJudment;
        this.level = provide.level;
        this.domain = provide.domain;
        this.legalFolder = provide.legalFolder;
        this.jurisdiction = provide.jurisdiction;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}