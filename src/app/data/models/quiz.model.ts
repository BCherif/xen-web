import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Form} from './form.model';
import {TYPE_QUIZ} from '../enums/enums';

@Injectable()
export class Quiz implements Deserializable{
    id: number;
    name: string;
    description: string;
    typeQuiz : TYPE_QUIZ;
    form: Form;

    constructor(quiz?) {
        quiz = quiz || {};
        this.id = quiz.id;
        this.name = quiz.name;
        this.description = quiz.description;
        this.typeQuiz = quiz.typeQuiz;
        this.form = quiz.form;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
