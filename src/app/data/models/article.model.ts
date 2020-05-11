import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Verification} from "./verification.model";
import {Interpellation} from "./interpellation.model";
import {Category} from "./category.model";
import {Request} from './request.model';

@Injectable()
export class Article implements Deserializable{
    id: number;
    name: string;
    verification: Verification;
    request: Request;
    interpellation: Interpellation;
    category: Category

    constructor(article?) {
        article = article || {};
        this.id = article.id;
        this.name = article.name ;
        this.verification = article.verification;
        this.request = article.request;
        this.interpellation = article.interpellation;
        this.category = article.category;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}