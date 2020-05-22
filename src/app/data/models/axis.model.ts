import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";

@Injectable()
export class Axis implements Deserializable{
    id: number;
    name: string;
    description: string;

    constructor(axis?) {
        axis = axis || {};
        this.id = axis.id;
        this.name = axis.name;
        this.description = axis.description;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}