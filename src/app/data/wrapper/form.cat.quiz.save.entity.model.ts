import {Injectable} from "@angular/core";
import {Form} from '../models/form.model';
import {Quiz} from '../models/quiz.model';
import {QuizCategory} from '../models/quiz.category.model';

@Injectable()
export class FormCatQuizSaveEntity{
    form?: Form;
    quizCategory?: QuizCategory;
    quizzes?: Quiz[];


}