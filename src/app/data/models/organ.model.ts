import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";

@Injectable()
export class Organ implements Deserializable{
    id: number;
    name: string;
    description: string;

    constructor(organ?) {
        organ = organ || {};
        this.id = organ.id;
        this.name = organ.name ;
        this.description = organ.description;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}