import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Role} from './role.model';

@Injectable()
export class User implements Deserializable{
    id?: number;
    lastname?: string;
    firstname?: string;
    username?: string;
    password?: string;
    telephone?: string;
    address?: string;
    turnoverTarget?: number;
    loggedIn?: boolean;
    email?: string;
    enabled?: boolean;
    function?: string;
    token?: string;
    imageUri?: string;
    checked: boolean;
    roles: Role[];

    constructor(user?) {
        user = user || {};
        this.id = user.id || null;
        this.lastname = user.lastname;
        this.firstname = user.firstname;
        this.username = user.username;
        this.password = user.password;
        this.telephone = user.telephone;
        this.email = user.email;
        this.enabled = user.enabled;
        this.function = user.function;
        this.token = user.token;
        this.roles = user.roles || [];
        this.turnoverTarget = user.turnoverTarget;
        this.loggedIn = user.loggedIn;
        this.checked = user.checked;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
