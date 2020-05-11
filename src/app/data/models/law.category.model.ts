import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";

@Injectable()
export class LawCategory implements Deserializable{
    id: number;
    name: string;
    description: string;

    constructor(lawCategory?) {
        lawCategory = lawCategory || {};
        this.id = lawCategory.id;
        this.name = lawCategory.name ;
        this.description = lawCategory.description;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}