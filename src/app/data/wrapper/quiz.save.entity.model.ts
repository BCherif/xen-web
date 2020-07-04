import {Injectable} from "@angular/core";
import {Form} from '../models/form.model';
import {Quiz} from '../models/quiz.model';
import {Response} from '../models/response.model';

@Injectable()
export class QuizSaveEntity{
    quiz?: Quiz;
    responses?: Response[];


}