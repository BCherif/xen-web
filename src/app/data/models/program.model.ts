import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Elected} from "./elected.model";

@Injectable()
export class Program implements Deserializable{
    id: number;
    years: string;
    elected: Elected;

    constructor(program?) {
        program = program || {};
        this.id = program.id;
        this.years = program.years ;
        this.elected = program.elected;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}