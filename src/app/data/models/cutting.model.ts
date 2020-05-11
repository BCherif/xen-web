import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";

@Injectable()
export class Cutting implements Deserializable{
    id: number;
    name: string;
    description: string;

    constructor(cutting?) {
        cutting = cutting || {};
        this.id = cutting.id;
        this.name = cutting.name ;
        this.description = cutting.description;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}