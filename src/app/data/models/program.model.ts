import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Elected} from "./elected.model";
import {Organ} from './organ.model';
import {ORGAN_CALL} from '../enums/enums';

@Injectable()
export class Program implements Deserializable{
    id: number;
    years: string;
    title: string;
    elected: Elected;
    startDate: Date;
    endDate: Date;
    organ: Organ;
    organCall: ORGAN_CALL;

    constructor(program?) {
        program = program || {};
        this.id = program.id;
        this.years = program.years ;
        this.startDate = program.startDate ;
        this.endDate = program.endDate ;
        this.years = program.years ;
        this.elected = program.elected;
        this.organ = program.organ;
        this.organCall = program.organCall;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}