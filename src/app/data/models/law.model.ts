import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {LawCategory} from "./law.category.model";

@Injectable()
export class Law implements Deserializable{
    id: number;
    name: string;
    content: string;
    lawCategory: LawCategory;

    constructor(law?) {
        law = law || {};
        this.id = law.id;
        this.name = law.name ;
        this.content = law.content;
        this.lawCategory = law.lawCategory;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}