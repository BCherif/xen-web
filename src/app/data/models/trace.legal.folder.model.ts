import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {DEGREE} from '../enums/enums';
import {LegalFolder} from './legal.folder.model';

@Injectable()
export class TraceLegalFolder implements Deserializable{
    id: number;
    degree: DEGREE;
    comment: string;
    date: Date;
    legalFolder: LegalFolder;

    constructor(traceLegalFolder?) {
        traceLegalFolder = traceLegalFolder || {};
        this.id = traceLegalFolder.id;
        this.degree = traceLegalFolder.degree;
        this.comment = traceLegalFolder.comment;
        this.date = traceLegalFolder.date;
        this.legalFolder = traceLegalFolder.legalFolder;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}