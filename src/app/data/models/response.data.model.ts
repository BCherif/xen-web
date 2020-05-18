import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Quiz} from './quiz.model';
import {Form} from './form.model';
import {Response} from './response.model';

@Injectable()
export class ResponseData implements Deserializable{
    id: number;
    form: Form;
    response: Response
    quiz: Quiz;

    constructor(responseData?) {
        responseData = responseData || {};
        this.id = responseData.id;
        this.form = responseData.form;
        this.response = responseData.response;
        this.quiz = responseData.quiz;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
