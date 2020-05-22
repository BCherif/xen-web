import {Injectable} from "@angular/core";
import {Quiz} from '../models/quiz.model';
import {Response} from '../models/response.model';

@Injectable()
export class ResponseSaveEntity{
    quiz?: Quiz;
    responses?: Response[];


}