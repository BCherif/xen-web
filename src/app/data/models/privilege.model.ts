import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";

@Injectable()
export class Privilege implements Deserializable{
    id: number;
    name: string;
    description: string;

    constructor(privilege?) {
        privilege = privilege || {};
        this.id = privilege.id;
        this.name = privilege.name ;
        this.description = privilege.description;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}