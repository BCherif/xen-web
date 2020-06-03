import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";

@Injectable()
export class Jurisdiction implements Deserializable{
    id: number;
    name: string;
    description: string;

    constructor(jurisdiction?) {
        jurisdiction = jurisdiction || {};
        this.id = jurisdiction.id;
        this.name = jurisdiction.name;
        this.description = jurisdiction.description;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}