import {FuseNavigation} from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: 'Fonctionnalitées',
        translate: 'NAV.APPLICATIONS',
        type: 'group',
        children: [
            {
                id: 'governometer',
                title: 'Gouvernomètre',
                type: 'collapsable',
                icon: 'library_books',
                children: [
                    {
                        id: 'articles',
                        title: 'Publications',
                        type: 'item',
                        icon: 'library_books',
                        url: '/main/governometer/articles'
                    }
                ]
            },
            {
                id: 'corryptometer',
                title: 'Corruptomètre',
                type: 'collapsable',
                icon: 'folder',
                children: [
                    {
                        id: 'jurisdictions',
                        title: 'Juridictions',
                        type: 'item',
                        icon: 'home',
                        url: '/main/corryptometer/jurisdictions'
                    },
                    {
                        id: 'legal-folders',
                        title: 'Dossiers en justice',
                        type: 'item',
                        icon: 'folder',
                        url: '/main/corryptometer/legal-folders'
                    },
                    {
                        id: 'appeals',
                        title: 'Appels',
                        type: 'item',
                        icon: 'folder',
                        url: '/main/corryptometer/appeals'
                    },
                    {
                        id: 'provides',
                        title: 'Pourvoirs',
                        type: 'item',
                        icon: 'folder',
                        url: '/main/corryptometer/provides'
                    },
                    {
                        id: 'traces-folder',
                        title: 'Historiques',
                        type: 'item',
                        icon: 'folder',
                        url: '/main/corryptometer/traces-folder'
                    }
                ]
            },
            {
                id: 'participation',
                title: 'Participation Citoyenne',
                type: 'collapsable',
                icon: 'person_add',
                children: [
                    {
                        id: 'citizen-voices',
                        title: 'Voix citoyen',
                        type: 'item',
                        icon: 'people',
                        url: '/main/participation/citizen-voices'
                    },
                    {
                        id: 'law-projects',
                        title: 'Projet de Lois',
                        type: 'item',
                        icon: 'gavel',
                        url: '/main/participation/law-projects'
                    },
                    {
                        id: 'petitions',
                        title: 'Pétitions',
                        type: 'item',
                        icon: 'library_books',
                        url: '/main/participation/petitions'
                    },
                    {
                        id: 'denunciations',
                        title: 'Dénonciations',
                        type: 'item',
                        icon: 'library_books',
                        url: '/main/participation/denunciations'
                    },
                    {
                        id: 'interpellations',
                        title: 'Interpellations',
                        type: 'item',
                        icon: 'volume_up',
                        url: '/main/participation/interpellations'
                    }
                ]
            },
            {
                id: 'org',
                title: 'Institutions',
                type: 'collapsable',
                icon: 'person_add',
                children: [
                    {
                        id: 'electeds',
                        title: 'Membres',
                        type: 'item',
                        icon: 'person_add',
                        url: '/main/trueometer/electeds'
                    },
                    {
                        id: 'organs',
                        title: 'Institutions',
                        type: 'item',
                        icon: 'people',
                        url: '/main/trueometer/organs'
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
                        id: 'quiz-categories',
                        title: 'Catégories',
                        type: 'item',
                        icon: 'edit',
                        url: '/main/publications/quiz-categories'
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
            },
            {
                id: 'admin',
                title: 'Administrations',
                type: 'collapsable',
                icon: 'person_add',
                children: [
                    {
                        id: 'users',
                        title: 'Utilisateurs',
                        type: 'item',
                        icon: 'person',
                        url: '/main/admin/users'
                    },
                    {
                        id: 'roles',
                        title: 'Rôles',
                        type: 'item',
                        icon: 'people_outline',
                        url: '/main/admin/roles'
                    }
                ]
            }
        ]
    }
];
