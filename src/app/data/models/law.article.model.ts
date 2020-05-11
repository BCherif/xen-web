import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Law} from "./law.model";

@Injectable()
export class LawArticle implements Deserializable{
    id: number;
    name: string;
    content: string;
    law: Law;

    constructor(lawArticle?) {
        lawArticle = lawArticle || {};
        this.id = lawArticle.id;
        this.name = lawArticle.name ;
        this.content = lawArticle.content;
        this.law = lawArticle.law;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}