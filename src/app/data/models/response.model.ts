import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Injectable} from '@angular/core';

@Injectable()
export class Response implements Deserializable {
    id: number;
    name: string;

    constructor(response?) {
        response = response || {};
        this.id = response.id;
        this.name = response.name;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
