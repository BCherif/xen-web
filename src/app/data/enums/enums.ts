export enum JUDGMENT {
    IN_PROGRESS = 'En cours',
    CULPABLE = 'Coupable',
    RELAX = 'Relaxer'
}

export enum CS_JUDGMENT {
    IN_PROGRESS = 'En cours',
    REJECTION = 'Rejet',
    BROKEN = 'Casse'
}

export enum INITIATOR {
    PRESIDENT = 'Gouvernement',
    ASSEMBLY = 'Assemblée nationale',
    CITIZEN = 'Citoyen'
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
    CLOSE = 'Clos',
    IN_PROGRESS = 'En cours'
}

export enum TYPE_QUIZ_ANSWER {
    text = 'Texte',
    number = 'Nombre',
    checkbox = 'Multiple choix',
    select = 'Selectionner',
    date = 'Date'
}


export enum CALL_AS {
    ANONYMOUS = 'Anonyme',
    NOT_ANONYMOUS = 'Non Anonyme'
}

export enum ORGAN_CALL {
    ELECTED = 'Membre',
    ORGAN = 'Institution'
}

export enum DEGREE {
    CS = 'Cour suprême',
    SECOND_LEVEL = '2eme degré',
    FIRST_LEVEL = '1er degré'
}

export enum STATE_LAW_PROJECT {
    STUDY = 'A l\'étude',
    ADOPTED = 'Adoptée',
    PUBLISHED = 'Publiée',
    PROMULGATED = 'Promulguée'
}

export enum CATEGORY_FORM {
    CORRUPTOMETER = 'Corruptomètre',
    GOVERNOMETER = 'Gouvernomètre'
}