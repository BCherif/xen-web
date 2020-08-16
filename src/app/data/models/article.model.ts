import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Injectable} from '@angular/core';
import {CATEGORY, SUB_CATEGORY} from '../enums/enums';
import {Locality} from './locality.model';
import {Domain} from './domain.model';
import {User} from './user.model';

@Injectable()
export class Article implements Deserializable {
    id: number;
    title: string;
    fileName: string;
    content: string;
    description: string;
    category: CATEGORY;
    subCategory: SUB_CATEGORY;
    level: Locality;
    domain: Domain;
    ischeck: boolean = false;
    user: User;
    createDate: Date = new Date();
    updateDate: Date;

    constructor(article?) {
        article = article || {};
        this.id = article.id;
        this.title = article.title;
        this.fileName = article.fileName;
        this.content = article.content;
        this.ischeck = article.ischeck;
        this.description = article.description;
        this.category = article.category;
        this.subCategory = article.subCategory;
        this.level = article.level;
        this.domain = article.domain;
        this.user = article.user;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}