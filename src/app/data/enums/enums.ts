export enum JUDGMENT {
    CULPABLE = 'Coupable',
    NOT_CULPABLE = 'Non coupable'
}

export enum INITIATOR {
    PRESIDENT = 'Président de la republique',
    ASSEMBLY = 'Assemblée nationale'
}

export enum STATE_PROJECT {
    REALIZE = 'Réaliser',
    NO_REALIZE = 'Non Réaliser',
    IN_PROGRESS = 'En Cours',
    NO_ASSESS = 'Non Evaluer'
}

export enum CATEGORY {
    CORRUPTOMETER = 'Corruptomètre',
    GOVERNOMETER = 'Gouvernomètre',
    CITIZEN_PARTICIPATION = 'Participation Citoyenne'
}

export enum GOUV_SUB_CAT {
    POLITICAL_GOVERNANCE = 'Gouvernance politique et economique',
    LOCAL_GOVERNANCE = 'Gouvernance locale',
    PEACE_AND_SECURITY = 'Paix et sécurité',
    JUSTICE = 'Justice'
}

export enum SUB_CATEGORY {
    POLITICAL_GOVERNANCE = 'Gouvernance politique et economique',
    LOCAL_GOVERNANCE = 'Gouvernance locale',
    PEACE_AND_SECURITY = 'Paix et sécurité',
    JUSTICE = 'Justice',
    LAW_PROJECT = 'Projet de lois',
    DENUNCIATION = 'Dénonciation',
    PETITION = 'Pétition',
    INTERPELLATION = 'Interpellation',
    LEGAL_FOLDER = 'Dossier en justice'
}

export enum STATE_FOLDER {
    WITHOUT_CONTINUATION = 'Sans Suite',
    CLOSE = 'Clos',
    IN_PROGRESS = 'En cours'
}

export enum TYPE_QUIZ {
    TEXT = 'Texte',
    NUMBER = 'Nombre',
    CHECK = 'Checkbox',
    RADIO = 'Radio Button',
    SELECT = 'Select',
    DATE = 'Date'
}


export enum CALL_AS {
    ANONYMOUS = 'Anonyme',
    NOT_ANONYMOUS = 'Non Anonyme'
}

export enum ORGAN_CALL {
    ELECTED = 'Elus',
    ORGAN = 'Organ'
}

export enum VOICE {
    FOR = 'Pour',
    AGAINST = 'Contre'
}

export enum STATE_LAW_PROJECT {
    IN_AMENDMENT = 'En amendement',
    IN_REJECTION = 'En rejet',
    IN_PROMULGATION = 'En promulgation',
    IN_ADOPTION = 'En adoption'
}

export enum CATEGORY_FORM {
    CORRUPTOMETER = 'Corruptomètre',
    GOVERNOMETER = 'Gouvernomètre'
}