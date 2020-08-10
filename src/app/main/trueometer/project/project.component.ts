import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Project} from '../../../data/models/project.model';
import {Domain} from '../../../data/models/domain.model';
import {Locality} from '../../../data/models/locality.model';
import {Program} from '../../../data/models/program.model';
import {ProjectService} from './project.service';
import {DomainsService} from '../../setting/domains/domains.service';
import {LocalitiesService} from '../../setting/localities/localities.service';
import {ProgramsService} from '../../setting/programs/programs.service';
import {STATE_PROJECT} from '../../../data/enums/enums';
import {NgxSpinnerService} from 'ngx-spinner';
import {SearchLevelEntity} from '../../../utils/search-level-entity';

@Component({
    selector: 'trueometer-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ProjectComponent implements OnInit, OnDestroy {
    project: Project;
    domain: Domain;
    domains: Domain[];
    locality: Locality;
    localities: Locality[];
    program: Program;
    programs: Program[];
    stateProjects: any[];
    stateProject = STATE_PROJECT;
    pageType: string;
    projectForm: FormGroup;

    regions: Locality[];
    circles: SearchLevelEntity[] = [];
    towns: SearchLevelEntity[] = [];
    vfqs: SearchLevelEntity[] = [];

    levelSelected: Locality;

    regionId: number;
    circleId: number;
    towId: number;
    vfqId: number;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param _projectService
     * @param _domainsService
     * @param _localitiesService
     * @param _programsService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param _toastr
     * @param _router
     * @param _spinnerService
     */
    constructor(
        private _projectService: ProjectService,
        private _domainsService: DomainsService,
        private _localitiesService: LocalitiesService,
        private _programsService: ProgramsService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _toastr: ToastrService,
        private _router: Router,
        private _spinnerService: NgxSpinnerService
    ) {
        // Set the default
        this.project = new Project();

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
        this.stateProjects = Object.keys(this.stateProject);
        this.createProjectForm();
        this.getDomains();
        this.getLocalities();
        this.getPrograms();
        // Subscribe to update request on changes
        this._projectService.onProjectChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(project => {
                if (project) {
                    this.projectForm.get('id').setValue(project.id);
                    this.projectForm.get('name').setValue(project.name);
                    this.projectForm.get('budget').setValue(project.budget);
                    this.projectForm.get('state').setValue(project.state);
                    this.projectForm.get('domain').setValue(project.domain.id);
                    this.projectForm.get('region').setValue(project.level.id);
                    this.projectForm.get('circle').setValue(project.level.id);
                    this.projectForm.get('town').setValue(project.level.id);
                    this.projectForm.get('vfq').setValue(project.level.id);
                    this.projectForm.get('program').setValue(project.program.id);
                    this.project = new Project(project);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.project = new Project();
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
     * Create project form
     *
     * @returns {FormGroup}
     */
    createProjectForm() {
        this.projectForm = this._formBuilder.group({
            id: new FormControl(''),
            name: new FormControl('', Validators.required),
            budget: new FormControl('', Validators.required),
            state: new FormControl('', Validators.required),
            domain: new FormControl('', Validators.required),
            region: new FormControl(''),
            circle: new FormControl(''),
            town: new FormControl(''),
            vfq: new FormControl(''),
            program: new FormControl('', Validators.required)
        });
    }

    getDomains() {
        this._domainsService.getAll().subscribe(value => {
            this.domains = value['response'];
        }, error => console.log(error));
    }

    getLocalities() {
        this._domainsService.getAll().subscribe(value => {
            this.localities = value['response'];
            this.regions = this.localities.filter(value1 => value1.levelSup === null);
        }, error => console.log(error));
    }

    getPrograms() {
        this._programsService.getAll().subscribe(value => {
            this.programs = value['response'];
        }, error => console.log(error));
    }

    getDomainById(id: number) {
        this._domainsService.getById(id).subscribe(value => {
            this.domain = value['response'];
        }, error => console.log(error));
    }

    getLocalityById(id: number) {
        this._localitiesService.getById(id).subscribe(value => {
            this.locality = value['response'];
        }, error => console.log(error));
    }

    getProgramById(id: number) {
        this._programsService.getById(id).subscribe(value => {
            this.program = value['response'];
        }, error => console.log(error));
    }

    findByDomainSelected(value) {
        this.getDomainById(value);
    }

    findLocalitySelected(value) {
        this.getLocalityById(value);
    }

    findProgramSelected(value) {
        this.getProgramById(value);
    }

    getCircles(id: number) {
        this._localitiesService.findAllByLevelSupId(id).subscribe(data => {
            this.circles = data['response'];
        }, error => console.log(error));
    }

    getTows(id: number) {
        this._localitiesService.findAllByLevelSupId(id).subscribe(data => {
            this.towns = data['response'];
        }, error => console.log(error));
    }

    getVfqs(id: number) {
        this._localitiesService.findAllByLevelSupId(id).subscribe(data => {
            this.vfqs = data['response'];
        }, error => console.log(error));
    }

    onRegionChange(value) {
        this.regionId = value;
        this.getLocalityById(value);
        this.getCircles(value);

    }

    onCircleChange(event) {
        this.circleId = event;
        this.getLocalityById(event);
        this.getTows(event);
    }

    onTownChange(event) {
        this.towId = event;
        this.getLocalityById(event);
        this.getVfqs(event);
    }

    onVFQChange(event) {
        this.getLocalityById(event);
    }

    saveOrUpdate() {
        this._spinnerService.show();
        this.project = new Project();
        this.project = this.projectForm.getRawValue();
        this.project.domain = this.domain;
        this.project.level = this.locality;
        this.project.program = this.program;
        if (!this.project.id) {
            this._projectService.create(this.project).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/trueometer/projects');
                    this._spinnerService.hide();
                } else {
                    this._toastr.error(data['message']);
                    this._spinnerService.hide();
                }
            });
        } else {
            this._projectService.update(this.project).subscribe(data => {
                if (data['status'] === 'OK') {
                    this._toastr.success(data['message']);
                    this._router.navigateByUrl('/main/trueometer/projects');
                    this._spinnerService.hide();
                } else {
                    this._toastr.error(data['message']);
                    this._spinnerService.hide();
                }
            });
        }
    }

}
