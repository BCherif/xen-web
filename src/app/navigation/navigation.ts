import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'articles',
                title    : 'Articles',
                type     : 'item',
                icon     : 'priority_high',
                url  : '/main/trueometer/articles'
            },
            {
                id       : 'trueometer',
                title    : 'Véritomètre',
                type     : 'collapsable',
                icon: 'check',
                children : [
                    {
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
                    }
                ]
            },
            {
                id       : 'interpellations',
                title    : 'Interpellations',
                type     : 'item',
                icon     : 'volume_up',
                url  : '/main/trueometer/interpellations'
            },
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
