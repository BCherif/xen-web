import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {Elected} from '../../../data/models/elected.model';
import {CALL_AS, CATEGORY, ORGAN_CALL, STATE_FOLDER, STATE_LAW_PROJECT} from '../../../data/enums/enums';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Interpellation} from '../../../data/models/interpellation.model';
import {Organ} from '../../../data/models/organ.model';
import {ArticleService} from './article.service';
import {Denunciation} from '../../../data/models/denunciation.model';
import {LawProject} from '../../../data/models/law.project.model';
import {LegalFolder} from '../../../data/models/legal.folder.model';
import {Petition} from '../../../data/models/petition.model';
import {Article} from '../../../data/models/article.model';
import {OrgansService} from '../../trueometer/organs/organs.service';
import {ElectedsService} from '../../trueometer/electeds/electeds.service';
import {SaveArticleEntity} from '../../../data/wrapper/save.article.entity.model';

@Component({
    selector: 'publications-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ArticleComponent implements OnInit, OnDestroy {
    interpellation: Interpellation;
    denunciation: Denunciation;
    lawProject: LawProject;
    legalFolder: LegalFolder;
    petition: Petition;
    article: Article;
    elected: Elected;
    electeds: Elected[];
    organ: Organ;
    organs: Organ[];
    pageType: string;
    publicationForm: FormGroup;
    asCalls: any[];
    callAs = CALL_AS;
    category = CATEGORY;
    categories: any[];
    organCalls: any[];
    organCall = ORGAN_CALL;
    stateFolder = STATE_FOLDER;
    stateFolders: any[];
    stateLawProject = STATE_LAW_PROJECT;
    stateLawProjects: any[];
    organCallSelected: any;
    categorySelected: any;
    stateLawChoice : any;
    saveArticleEntity: SaveArticleEntity;


    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param _toastr
     * @param _articleService
     * @param _organsService
     * @param _electedService
     * @param _router
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _articleService: ArticleService,
        private _organsService: OrgansService,
        private _electedService: ElectedsService,
        private _router: Router
    ) {
        // Set the default
        this.article = new Article();
        this.legalFolder = new LegalFolder();
        this.interpellation = new Interpellation();
        this.lawProject = new LawProject();
        this.petition = new Petition();
        this.denunciation = new Denunciation();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.asCalls = Object.keys(this.callAs);
        this.organCalls = Object.keys(this.organCall);
        this.categories = Object.keys(this.category);
        this.stateFolders = Object.keys(this.stateFolder);
        this.stateLawProjects = Object.keys(this.stateLawProject);
        this.createPublicationForm();
        this.getElecteds();
        this.getOrgans();
        // Subscribe to update interpellation on changes
        this._articleService.onArticleChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(article => {

                if (article) {
                    this.article = new Article(article);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.article = new Article();
                }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create publication form
     *
     * @returns {FormGroup}
     */
    createPublicationForm() {
        this.publicationForm = this._formBuilder.group({
            id: new FormControl(''),
            title: new FormControl('',Validators.required),
            year: new FormControl(''),
            stateLawProject: new FormControl(''),
            decisionMaker: new FormControl(''),
            entity: new FormControl(''),
            justification: new FormControl(''),
            stateFolder: new FormControl(''),
            content: new FormControl('', Validators.required),
            organCall: new FormControl(''),
            callAs: new FormControl(''),
            elected: new FormControl(''),
            category: new FormControl('', Validators.required),
            organ: new FormControl(''),
        });
    }

    getElecteds() {
        this._electedService.getAll().subscribe(value => {
            this.electeds = value['response'];
        }, error => console.log(error));
    }

    getOrgans() {
        this._organsService.getAll().subscribe(value => {
            this.organs = value['response'];
        }, error => console.log(error));
    }

    getElectedById(id: number) {
        this._electedService.getById(id).subscribe(value => {
            this.elected = value['response'];
        }, error => console.log(error));
    }

    getOrganById(id: number) {
        this._organsService.getById(id).subscribe(value => {
            this.organ = value['response'];
        }, error => console.log(error));
    }

    findByElectedSelected(value) {
        this.getElectedById(value);
    }

    findOrganSelected(value) {
        this.getOrganById(value);
    }

    save() {
        this.saveArticleEntity = new SaveArticleEntity();
        this.article.title = this.publicationForm.get('title').value;
        this.article.category = this.publicationForm.get('category').value;
        this.article.content = this.publicationForm.get('content').value;
        this.saveArticleEntity.article = this.article;
        if (this.categorySelected ==='LAW_PROJECT') {
            this.lawProject.stateLawProject = this.publicationForm.get('stateLawProject').value;
            this.lawProject.year = this.publicationForm.get('year').value;
            this.lawProject.elected = this.elected;
            this.saveArticleEntity.lawProject = this.lawProject;
        }else if (this.categorySelected === 'DENUNCIATION'){
            this.denunciation.entity = this.publicationForm.get('entity').value;
            this.denunciation.justification = this.publicationForm.get('justification').value;
            this.denunciation.denunciationDate = new Date();
            this.saveArticleEntity.denunciation = this.denunciation;
        }else if (this.categorySelected ==='INTERPELLATION'){
            this.interpellation.organCall = this.publicationForm.get('organCall').value;
            this.interpellation.callAs = this.publicationForm.get('callAs').value;
            this.interpellation.elected= this.elected;
            this.interpellation.organ= this.organ;
            this.interpellation.interpelDate= new Date();
            this.saveArticleEntity.interpellation = this.interpellation;
        }else if (this.categorySelected ==='PETITION') {
            this.petition.decisionMaker = this.publicationForm.get('decisionMaker').value;
            this.saveArticleEntity.petition = this.petition;
        }else if (this.categorySelected ==='LEGAL_FILE') {
            this.legalFolder.stateFolder = this.publicationForm.get('stateFolder').value;
            this.saveArticleEntity.legalFolder = this.legalFolder;
        }
        this._articleService.create(this.saveArticleEntity).subscribe(data => {
            if (data['status'] === 'OK') {
                this._toastr.success(data['message']);
                this._router.navigateByUrl('/main/publications/articles');
            } else {
                this._toastr.error(data['message']);
            }
        });
    }

    getOrganChoice(value) {
        this.organCallSelected = value;
    }

    getCategoryChoice(value) {
        this.categorySelected = value;
    }

    getStateSelected(value) {
        this.stateLawChoice = value;
    }
}
