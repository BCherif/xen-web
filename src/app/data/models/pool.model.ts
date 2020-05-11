import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {GroupCategory} from "./group.category.model";

@Injectable()
export class Pool implements Deserializable{
    id: number;
    nom: string;
    groupCategory: GroupCategory;

    constructor(pool?) {
        pool = pool || {};
        this.id = pool.id;
        this.nom = pool.nom ;
        this.groupCategory = pool.groupCategory;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}