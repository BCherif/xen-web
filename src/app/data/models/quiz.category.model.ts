import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";

@Injectable()
export class QuizCategory implements Deserializable{
    id: number;
    name: string;
    description: string;

    constructor(quizCategory?) {
        quizCategory = quizCategory || {};
        this.id = quizCategory.id;
        this.name = quizCategory.name ;
        this.description = quizCategory.description;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}