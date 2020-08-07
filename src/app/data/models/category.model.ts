import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Injectable} from '@angular/core';
import {Domain} from './domain.model';

@Injectable()
export class Category implements Deserializable {
    id: number;
    name: string;
    domain: Domain;

    constructor(category?) {
        category = category || {};
        this.id = category.id;
        this.name = category.name;
        this.domain = category.domain;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}