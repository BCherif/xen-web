import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";

@Injectable()
export class Axis implements Deserializable{
    id: number;
    nom: string;

    constructor(category?) {
        category = category || {};
        this.id = category.id;
        this.nom = category.nom ;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}