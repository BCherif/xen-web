import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Injectable} from '@angular/core';
import {TYPE_QUIZ_ANSWER} from '../enums/enums';
import {Domain} from './domain.model';
import {Response} from './response.model';
import {Form} from './form.model';

@Injectable()
export class Quiz implements Deserializable {
    id: number;
    name: string;
    domain: Domain;
    form: Form;
    responses: Response[];
    typeQuiz: TYPE_QUIZ_ANSWER;

    constructor(quiz?) {
        quiz = quiz || {};
        this.id = quiz.id;
        this.name = quiz.name;
        this.domain = quiz.domain;
        this.form = quiz.form;
        this.responses = quiz.responses;
        this.typeQuiz = quiz.typeQuiz;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
