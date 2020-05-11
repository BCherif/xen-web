import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";

@Injectable()
export class Category implements Deserializable{
    id: number;
    name: string;
    description: string;

    constructor(category?) {
        category = category || {};
        this.id = category.id;
        this.name = category.name ;
        this.description = category.description;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}