import {Deserializable} from '../wrapper/deserializable.wrapper';
import {Injectable} from '@angular/core';
import {Locality} from './locality.model';
import {Domain} from './domain.model';
import {User} from './user.model';

@Injectable()
export class CitizenVoice implements Deserializable {
    id: number;
    title: string;
    content: string;
    locality: Locality;
    domain: Domain;
    user: User;

    constructor(citizenVoice?) {
        citizenVoice = citizenVoice || {};
        this.id = citizenVoice.id;
        this.title = citizenVoice.title;
        this.content = citizenVoice.content;
        this.locality = citizenVoice.locality;
        this.domain = citizenVoice.domain;
        this.user = citizenVoice.user;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}