import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Quiz} from './quiz.model';

@Injectable()
export class Response implements Deserializable{
    id: number;
    name: string;
    quiz: Quiz;

    constructor(response?) {
        response = response || {};
        this.id = response.id;
        this.name = response.name;
        this.quiz = response.quiz;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
