import {Deserializable} from './deserializable.wrapper';
import {Injectable} from "@angular/core";
import {Verification} from '../models/verification.model';
import {Request} from '../models/request.model';

@Injectable()
export class VerificationSaveEntity implements Deserializable{
    verification: Verification;
    request: Request;

    constructor(verificationSaveEntity?) {
        verificationSaveEntity = verificationSaveEntity || {};
        this.verification = verificationSaveEntity.verification ;
        this.request = verificationSaveEntity.request;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

}