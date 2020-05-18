import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {CATEGORY} from '../enums/enums';

@Injectable()
export class Article implements Deserializable{
    id: number;
    title: string;
    content: string;
    category: CATEGORY

    constructor(article?) {
        article = article || {};
        this.id = article.id;
        this.title = article.title ;
        this.content = article.content;
        this.category = article.category;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}