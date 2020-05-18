import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Article} from './article.model';

@Injectable()
export class Denunciation implements Deserializable{
    id: number;
    denunciationDate: Date = new Date();
    entity: string;
    justification: string;
    article: Article;
    
    constructor(denunciation?) {
        denunciation = denunciation || {};
        this.id = denunciation.id;
        this.denunciationDate = denunciation.denunciationDate;
        this.entity = denunciation.entity;
        this.justification = denunciation.justification;
        this.article = denunciation.article;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
