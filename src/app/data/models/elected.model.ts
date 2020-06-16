import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Locality} from "./locality.model";
import {Organ} from "./organ.model";

@Injectable()
export class Elected implements Deserializable{
    id: number;
    lastname: string;
    firstname: string;
    job: string;
    sexe: string;
    level: Locality;
    organ: Organ;

    constructor(elected?) {
        elected = elected || {};
        this.id = elected.id;
        this.lastname = elected.lastname;
        this.firstname = elected.firstname;
        this.job = elected.levelOfEducation;
        this.sexe = elected.profession;
        this.level = elected.level;
        this.organ = elected.organ;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
