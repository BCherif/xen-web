import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";

@Injectable()
export class GroupCategory implements Deserializable{
    id: number;
    name: string;

    constructor(groupCategory?) {
        groupCategory = groupCategory || {};
        this.id = groupCategory.id;
        this.name = groupCategory.name ;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}