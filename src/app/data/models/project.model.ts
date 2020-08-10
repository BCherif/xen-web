import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {STATE_PROJECT} from "../enums/enums";
import {Domain} from "./domain.model";
import {Locality} from "./locality.model";
import {Program} from "./program.model";

@Injectable()
export class Project implements Deserializable{
    id: number;
    name: string;
    budget: number;
    state: STATE_PROJECT;
    domain: Domain;
    level: Locality;
    program: Program;

    constructor(project?) {
        project = project || {};
        this.id = project.id;
        this.name = project.name ;
        this.budget = project.budget;
        this.state = project.state;
        this.domain = project.domain;
        this.level = project.level;
        this.program = project.program;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}