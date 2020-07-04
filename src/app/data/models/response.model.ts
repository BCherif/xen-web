import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Quiz} from './quiz.model';
import {TYPE_QUIZ_ANSWER} from '../enums/enums';

@Injectable()
export class Response implements Deserializable{
    id: number;
    name: string;
    numberFiled: number;
    dateField: Date;
    isCorrect: boolean;
    description: string;
    typeAnswer : TYPE_QUIZ_ANSWER;
    quiz: Quiz;

    constructor(response?) {
        response = response || {};
        this.id = response.id;
        this.name = response.name;
        this.numberFiled = response.numberFiled;
        this.dateField = response.dateField;
        this.typeAnswer = response.typeAnswer;
        this.isCorrect = response.isCorrect;
        this.description = response.description;
        this.quiz = response.quiz;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
