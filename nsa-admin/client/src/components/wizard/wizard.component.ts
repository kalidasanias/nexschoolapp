import { Component, OnInit, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { WizardStepComponent } from './wizard-step.component';

@Component({
  selector: 'form-wizard',
  template:
  `<div class="steps-basic wizard steps-wizard">
    <div class="steps">
      <ul class="nav nav-justified">
        <li class="nav-item" *ngFor="let step of steps;let i = index" [ngClass]="{ 'first': i == 0, 'last': i == (steps.length - 1), 'done': step.isDone && !step.isActive,'active current': step.isActive, 'enabled': !step.isDisabled, 'disabled': step.isDisabled, 'completed': isCompleted}">
          <a (click)="goToStep(step)"><span class="{{step.iclass ? step.iclass+ \' number_non \'  : \'number\' }} ">{{step.iclass ? '' : i+1}}</span>{{step.title}}</a>
        </li>
      </ul>
    </div>
    <div class="card-block wizard-body">
      <ng-content></ng-content>
    </div>
      <hr>
      <div class="modal-footer" [hidden]="isCompleted">
        <button type="button" class="btn btn-sm btn-primary float-right previousclick" (click)="previous()" [ngClass]="{'hide': !hasPrevStep || !activeStep.showPrev}">Previous</button>
        <button type="button" class="btn btn-sm btn-primary next float-right" (click)="next()" [disabled]="!activeStep.isValid" [ngClass]="{'hide':!hasNextStep || !activeStep.showNext}">Next</button>
        <input type="button" id="completeButton" class="btn btn-sm btn-primary float-right btn-ladda btn-ladda-progres" data-style="expand-right" data-spinner-size="20" (click)="complete()" [disabled]="!activeStep.isValid" value="{{activeStep.btnVal}} " [ngClass]="{'hide':hasNextStep}">
    </div>
  </div>`
  /*,
  styles: [
    '.card { height: 100%; }',
    '.card-header { background-color: #fff; padding: 0; font-size: 1.25rem; }',
    '.card-block { overflow-y: auto; }',
    '.wizard-body { padding-top: 9.5rem; padding-left: 1.25rem; }',
    '.card-footer { background-color: #fff; border-top: 0 none; }',
    '.nav-item { padding: 1rem 0rem; border-bottom: 0.2rem solid #ccc; }',
    '.active { font-weight: bold; color: black; border-bottom-color: #1976D2 !important; }',
    '.enabled { cursor: pointer; border-bottom-color: rgb(88, 162, 234); }',
    '.disabled { color: #ccc; }',
    '.completed { cursor: default; }',
    'ul > li { display: table-cell; text-align: center; width: auto; vertical-align: top; position: relative;}',
    'ul > li:after { position: absolute; top: 43px; width: 50%; height: 2px; background-color: #00BCD4; z-index: 9; }',
    'ul > li.current ~ li:before, .wizard > .steps > ul > li.current ~ li:after { background-color: #eeeeee; }',
    'ul > li .number { background-color: #fff; color: #00BCD4; display: inline-block; position: absolute; top: 0; left: 50%; margin-left: -19px; width: 38px; height: 38px; border: 2px solid #00BCD4; border-radius: 50%; z-index: 10; line-height: 34px; text-align: center; }',
    'ul > li.enabled .number { font-size: 0; }',
    'ul > li.disabled .number:before { font-size: 0; }',
    'ul > li.enabled .number:before { font-size: 14px; }',
    'ul > li { display: block; position: relative; top: 43px; width: 50%; height: 2px; z-index: 9; }',
    'ul > li > a { position: relative; padding-top: 48px; margin-top: 20px; margin-bottom: 20px; display: block;}'
    ]*/
})
export class WizardComponent implements OnInit, AfterContentInit {
  @ContentChildren(WizardStepComponent)
  wizardSteps: QueryList<WizardStepComponent>;

  private _steps: Array<WizardStepComponent> = [];
  private _isCompleted: boolean = false;

  @Output()
  onStepChanged: EventEmitter<WizardStepComponent> = new EventEmitter<WizardStepComponent>();

  constructor() {}

  ngOnInit() {
    // console.info('init....');
  }

  ngAfterContentInit() {
    this.wizardSteps.forEach(step => this._steps.push(step));
    this.steps[0].isActive = true;
  }

  private get steps(): Array<WizardStepComponent> {
    return this._steps.filter(step => !step.hidden);
  }

  private get isCompleted(): boolean {
    return this._isCompleted;
  }

  private get activeStep(): WizardStepComponent {
    return this.steps.find(step => step.isActive);
  }

  private set activeStep(step: WizardStepComponent) {
    if (step !== this.activeStep && !step.isDisabled) {
      this.activeStep.isActive = false;
      step.isActive = true;
      this.onStepChanged.emit(step);
    }
  }

  private get activeStepIndex(): number {
    return this.steps.indexOf(this.activeStep);
  }

  private get hasNextStep(): boolean {
    return this.activeStepIndex < this.steps.length - 1;
  }

  private get hasPrevStep(): boolean {
    return this.activeStepIndex > 0;
  }

  goToStep(step: WizardStepComponent) {
    /*if (!this.isCompleted) {
      this.activeStep = step;
    }*/
  }

  next() {
    if (this.hasNextStep) {
      this.steps[this.activeStepIndex].isDone = true;
      let nextStep: WizardStepComponent = this.steps[this.activeStepIndex + 1];
      this.activeStep.onNext.emit();
      nextStep.isDisabled = false;
      this.activeStep = nextStep;
    }
  }

  previous() {
    if (this.hasPrevStep) {
      this.activeStep.isDisabled = !this.activeStep.isValid;
      this.activeStep.isDone = this.activeStep.isValid;
      let prevStep: WizardStepComponent = this.steps[this.activeStepIndex - 1];
      this.activeStep.onPrev.emit();
      prevStep.isDisabled = false;
      this.activeStep = prevStep;
    }
  }

  complete() {
    this._isCompleted = false;
    this.activeStep.onComplete.emit();
  }

  reset() {
    this.activeStep = this.steps[0];
    for (let step of this.steps) {
      step.isDisabled = true;
      step.isDone = false;
    }
    this.activeStep.isDisabled = false;
    this.activeStep.isActive = true;
    this._isCompleted = false;
  }

  getCurrentStep() {
    return this.activeStepIndex;
  }

}
