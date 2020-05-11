import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Category} from "./category.model";
import {Elected} from "./elected.model";
import {Organ} from "./organ.model";
import {CALL_AS, ORGAN_CALL} from '../enums/enums';

@Injectable()
export class Interpellation implements Deserializable{
    id: number;
    interpelDate: Date = new Date();
    subject: string;
    content: string;
    response: string;
    callAs: CALL_AS;
    organCall: ORGAN_CALL;
    elected: Elected;
    category: Category;
    organ: Organ;

    constructor(interpellation?) {
        interpellation = interpellation || {};
        this.id = interpellation.id;
        this.subject = interpellation.subject;
        this.interpelDate = interpellation.interpelDate;
        this.content = interpellation.content;
        this.response = interpellation.response;
        this.callAs = interpellation.callAs;
        this.organCall = interpellation.organCall;
        this.elected = interpellation.elected;
        this.category = interpellation.category;
        this.organ = interpellation.organ;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
