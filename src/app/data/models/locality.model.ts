import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Cutting} from "./cutting.model";

@Injectable()
export class Locality implements Deserializable{
    id: number;
    name: string;
    cutting: Cutting;
    levelSup: Locality;

    constructor(locality?) {
        locality = locality || {};
        this.id = locality.id;
        this.name = locality.name ;
        this.cutting = locality.cutting ;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}