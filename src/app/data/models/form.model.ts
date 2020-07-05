import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {CATEGORY_FORM} from '../enums/enums';
import {QuizCategory} from './quiz.category.model';

@Injectable()
export class Form implements Deserializable{
    id: number;
    name: string;
    categoryForm: CATEGORY_FORM;
    quizCategories: QuizCategory[];

    constructor(form?) {
        form = form || {};
        this.id = form.id;
        this.name = form.name;
        this.categoryForm = form.categoryForm;
        this.quizCategories = form.quizCategories;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
