import {FuseNavigation} from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: 'Fonctionnalitées',
        translate: 'NAV.APPLICATIONS',
        type: 'group',
        children: [
            {
                id: 'publications',
                title: 'Publications',
                type: 'collapsable',
                icon: 'library_books',
                children: [
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
                        id: 'articles',
                        title: 'Articles',
                        type: 'item',
                        icon: 'library_books',
                        url: '/main/publications/articles'
                    },
                    {
                        id: 'legal-folders',
                        title: 'Dossiers en justice',
                        type: 'item',
                        icon: 'folder',
                        url: '/main/publications/legal-folders'
                    },
                    {
                        id: 'law-projects',
                        title: 'Projet de Lois',
                        type: 'item',
                        icon: 'gavel',
                        url: '/main/publications/law-projects'
                    },
                    {
                        id: 'petitions',
                        title: 'Pétitions',
                        type: 'item',
                        icon: 'library_books',
                        url: '/main/publications/petitions'
                    },
                    {
                        id: 'denunciations',
                        title: 'Dénonciations',
                        type: 'item',
                        icon: 'library_books',
                        url: '/main/publications/denunciations'
                    },
                    {
                        id: 'interpellations',
                        title: 'Interpellations',
                        type: 'item',
                        icon: 'volume_up',
                        url: '/main/trueometer/interpellations'
                    }
                ]
            },
            {
                id: 'programs',
                title: 'Programmes',
                type: 'item',
                icon: 'folder',
                url: '/main/setting/programs'
            },
            {
                id: 'projects',
                title: 'Projets',
                type: 'item',
                icon: 'folder',
                url: '/main/trueometer/projects'
            },
            {
                id: 'electeds',
                title: 'Elus',
                type: 'item',
                icon: 'person_add',
                url: '/main/trueometer/electeds'
            },
            {
                id: 'organs',
                title: 'Organs',
                type: 'item',
                icon: 'people',
                url: '/main/trueometer/organs'
            },
            {
                id: 'form',
                title: 'Gestion des formulaires',
                type: 'collapsable',
                icon: 'post_add',
                children: [
                    {
                        id: 'forms',
                        title: 'Formulaires',
                        type: 'item',
                        icon: 'edit',
                        url: '/main/publications/forms'
                    },
                    {
                        id: 'quizzes',
                        title: 'Questions',
                        type: 'item',
                        icon: 'priority_high',
                        url: '/main/publications/quizzes'
                    },
                    {
                        id: 'responses',
                        title: 'Réponses',
                        type: 'item',
                        icon: 'done_all',
                        url: '/main/publications/responses'
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
                id: 'setting',
                title: 'Configurations',
                type: 'collapsable',
                icon: 'settings',
                children: [
                    {
                        id: 'cuttings',
                        title: 'Découpages',
                        type: 'item',
                        icon: 'account_balance',
                        url: '/main/setting/cuttings'
                    },
                    {
                        id: 'localities',
                        title: 'Localités',
                        type: 'item',
                        icon: 'home',
                        url: '/main/setting/localities'
                    },
                    {
                        id: 'domains',
                        title: 'Domaines',
                        type: 'item',
                        icon: 'settings',
                        url: '/main/setting/domains'
                    },
                    {
                        id: 'axes',
                        title: 'Axes',
                        type: 'item',
                        icon: 'settings',
                        url: '/main/setting/axes'
                    }
                ]
            }
        ]
    }
];
