import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Category} from "./category.model";
import {Elected} from "./elected.model";

@Injectable()
export class Request implements Deserializable{
    id: number;
    requestDate: Date = new Date();
    subject: string;
    content: string;
    newSource: string;
    answered: boolean = false;
    elected: Elected;
    category: Category;

    constructor(request?) {
        request = request || {};
        this.id = request.id;
        this.subject = request.subject;
        this.content = request.content;
        this.newSource = request.newSource;
        this.answered = request.answered;
        this.requestDate = request.requestDate;
        this.elected = request.elected;
        this.category = request.category;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
