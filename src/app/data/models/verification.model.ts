import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Category} from "./category.model";
import {Elected} from "./elected.model";
import {JUDGMENT} from "../enums/enums";

@Injectable()
export class Verification implements Deserializable{
    id: number;
    verifDate: Date = new Date();
    label: string;
    content: string;
    reason: string;
    judgment: JUDGMENT;
    elected: Elected;
    category: Category;

    constructor(verification?) {
        verification = verification || {};
        this.id = verification.id;
        this.label = verification.label;
        this.verifDate = verification.verifDate;
        this.content = verification.content;
        this.judgment = verification.judgment;
        this.reason = verification.reason;
        this.elected = verification.elected;
        this.category = verification.category;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
