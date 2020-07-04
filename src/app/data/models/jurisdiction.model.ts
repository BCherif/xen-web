import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {DEGREE} from '../enums/enums';
import {Locality} from './locality.model';

@Injectable()
export class Jurisdiction implements Deserializable{
    id: number;
    name: string;
    description: string;
    degree: DEGREE;
    level: Locality;

    constructor(jurisdiction?) {
        jurisdiction = jurisdiction || {};
        this.id = jurisdiction.id;
        this.name = jurisdiction.name;
        this.description = jurisdiction.description;
        this.description = jurisdiction.degree;
        this.description = jurisdiction.level;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}