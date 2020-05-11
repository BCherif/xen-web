import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Locality} from "./locality.model";
import {Pool} from "./pool.model";

@Injectable()
export class GroupAssignment implements Deserializable{
    id: number;
    locality: Locality;
    pool: Pool;

    constructor(groupAssignment?) {
        groupAssignment = groupAssignment || {};
        this.id = groupAssignment.id;
        this.locality = groupAssignment.locality ;
        this.pool = groupAssignment.pool;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}