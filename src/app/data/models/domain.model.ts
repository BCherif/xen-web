import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Axis} from "./axis.model";

@Injectable()
export class Domain implements Deserializable{
    id: number;
    name: string;
    axis: Axis;

    constructor(domain?) {
        domain = domain || {};
        this.id = domain.id;
        this.name = domain.name ;
        this.axis = domain.axis ;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}