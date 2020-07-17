import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Privilege} from './privilege.model';

@Injectable()
export class Role implements Deserializable{
    id: number;
    name: string;
    description: string;
    checked: boolean;
    permissions: Privilege[];

    constructor(role?) {
        role = role || {};
        this.id = role.id;
        this.name = role.name ;
        this.checked = role.checked || false;
        this.description = role.description;
        this.permissions = role.permissions || [];
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}