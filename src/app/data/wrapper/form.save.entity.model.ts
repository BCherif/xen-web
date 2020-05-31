import {Injectable} from "@angular/core";
import {Form} from '../models/form.model';
import {Quiz} from '../models/quiz.model';

@Injectable()
export class FormSaveEntity{
    form?: Form;
    quizList?: Quiz[];


}