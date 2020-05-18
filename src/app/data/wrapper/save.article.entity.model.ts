import {Injectable} from "@angular/core";
import {LawProject} from '../models/law.project.model';
import {Petition} from '../models/petition.model';
import {Denunciation} from '../models/denunciation.model';
import {Interpellation} from '../models/interpellation.model';
import {LegalFolder} from '../models/legal.folder.model';
import {Article} from '../models/article.model';

@Injectable()
export class SaveArticleEntity{
    lawProject: LawProject;
    petition: Petition;
    denunciation: Denunciation;
    interpellation: Interpellation;
    legalFolder: LegalFolder;
    article: Article;


}