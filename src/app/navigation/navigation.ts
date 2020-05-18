import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Fonctionnalitées',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'publications',
                title    : 'Publications',
                type     : 'collapsable',
                icon: 'check',
                children : [
                   /* {
                        id   : 'requests',
                        title: 'Demandes',
                        type : 'item',
                        icon: 'priority_high',
                        url  : '/main/trueometer/requests'
                    },
                    {
                        id   : 'verifications',
                        title: 'Vérifications',
                        type : 'item',
                        icon: 'check',
                        url  : '/main/trueometer/verifications'
                    },*/
                    {
                        id       : 'articles',
                        title    : 'Articles',
                        type     : 'item',
                        icon     : 'priority_high',
                        url  : '/main/publications/articles'
                    },
                    {
                        id       : 'legal-folders',
                        title    : 'Dossiers en justice',
                        type     : 'item',
                        icon     : 'priority_high',
                        url  : '/main/publications/legal-folders'
                    },
                    {
                        id       : 'law-projects',
                        title    : 'Projet de Lois',
                        type     : 'item',
                        icon     : 'priority_high',
                        url  : '/main/publications/law-projects'
                    },
                    {
                        id       : 'petitions',
                        title    : 'Pétitions',
                        type     : 'item',
                        icon     : 'priority_high',
                        url  : '/main/publications/petitions'
                    },
                    {
                        id       : 'denunciations',
                        title    : 'Dénonciations',
                        type     : 'item',
                        icon     : 'priority_high',
                        url  : '/main/publications/denunciations'
                    },
                    {
                        id       : 'interpellations',
                        title    : 'Interpellations',
                        type     : 'item',
                        icon     : 'volume_up',
                        url  : '/main/trueometer/interpellations'
                    }
                ]
            },
            {
                id   : 'electeds',
                title: 'Elus',
                type : 'item',
                icon: 'person_add',
                url  : '/main/trueometer/electeds'
            },
            {
                id   : 'organs',
                title: 'Organs',
                type : 'item',
                icon: 'people',
                url  : '/main/trueometer/organs'
            },
            {
                id       : 'form',
                title    : 'Gestion des formulaires',
                type     : 'collapsable',
                icon: 'settings',
                children : [
                    {
                        id   : 'forms',
                        title: 'Formulaires',
                        type : 'item',
                        icon: 'settings',
                        url  : '/main/publications/forms'
                    }
                ]
            },
/*
            {
                id       : 'norme',
                title    : 'Normes',
                type     : 'collapsable',
                icon: 'gavel',
                children : [
                    {
                        id   : 'article',
                        title: 'Article de lois',
                        type : 'item',
                        icon: 'gavel',
                        url  : '/main/norme/law-articles'
                    },
                    {
                        id   : 'lois',
                        title: 'Lois',
                        type : 'item',
                        icon: 'gavel',
                        url  : '/main/norme/laws'
                    },
                    {
                        id   : 'category',
                        title: 'Catégories de lois',
                        type : 'item',
                        icon: 'gavel',
                        url  : '/main/norme/law-categories'
                    }
                ]
            },
*/
            {
                id       : 'setting',
                title    : 'Configurations',
                type     : 'collapsable',
                icon: 'settings',
                children : [
                    {
                        id   : 'cuttings',
                        title: 'Découpages',
                        type : 'item',
                        icon: 'account_balance',
                        url  : '/main/setting/cuttings'
                    },
                    {
                        id   : 'localities',
                        title: 'Localités',
                        type : 'item',
                        icon: 'home',
                        url  : '/main/setting/localities'
                    },
                    {
                        id   : 'categories',
                        title: 'Categories',
                        type : 'item',
                        icon: 'create',
                        url  : '/main/setting/categories'
                    }
                ]
            }
        ]
    }
];
