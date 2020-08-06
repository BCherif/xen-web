import {Deserializable} from '../data/wrapper/deserializable.wrapper';
import {Locality} from '../data/models/locality.model';
import {Injectable} from '@angular/core';

@Injectable()
export class SearchLevelEntity implements Deserializable {
    name?: string;
    levels?: Locality[];

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: this): boolean {
        return true;
    }

}
