import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {CATEGORY_FORM} from '../enums/enums';

@Injectable()
export class Form implements Deserializable{
    id: number;
    name: string;
    categoryForm: CATEGORY_FORM;

    constructor(form?) {
        form = form || {};
        this.id = form.id;
        this.name = form.name;
        this.categoryForm = form.categoryForm;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
