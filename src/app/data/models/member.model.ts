import {Deserializable} from "../wrapper/deserializable.wrapper";
import {Injectable} from "@angular/core";
import {Locality} from "./locality.model";

@Injectable()
export class Member implements Deserializable{
    id: number;
    lastname: string;
    firstname: string;
    levelOfEducation: string;
    profession: string;
    membership: string;
    parliamentGroup: string;
    commission: string;
    address: string;
    locality: Locality;

    constructor(member?) {
        member = member || {};
        this.id = member.id;
        this.lastname = member.lastname;
        this.firstname = member.firstname;
        this.levelOfEducation = member.levelOfEducation;
        this.profession = member.profession;
        this.membership = member.membership;
        this.parliamentGroup = member.parliamentGroup;
        this.commission = member.commission;
        this.address = member.address;
        this.locality = member.locality ;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    equals(obj: any): boolean {
        return this.id === obj.id;
    }
}
