import type { Emitter } from 'nanoevents';
import { createNanoEvents } from 'nanoevents';

import type { CodeStepChangeEvent, CodeStepComponent } from '../../components';
import type { StepImplementationRecord } from './ModelBuilder';

export const Validated = 'validated';
export const ValidationInProgress = 'validationInProgress';
export const ValidationComplete = 'validationComplete';

interface Events {
  [Validated]: (args: any) => void;
  [ValidationInProgress]: (name: string, stepCount: number) => void;
  [ValidationComplete]: (name: string, stepCount: number, passedValidation: boolean) => void;
}

export class StepViewer {
  #stepCount = 0;
  #stepRecord: StepImplementationRecord;
  #element: CodeStepComponent;
  #name: string;
  #isValid = false;
  #args = [] as any[];
  #emitter: Emitter<Events>;
  #transpiledCode: string | null;
  #solutionElement?: CodeStepComponent;
  #overrideEventListener?: boolean;

  constructor(props: {
    stepRecord: StepImplementationRecord;
    element: CodeStepComponent;
    name: string;
    stepCount?: number;
    solutionElement?: CodeStepComponent;
  }) {
    this.#stepCount = props.stepCount ?? 0;
    this.#stepRecord = props.stepRecord;
    this.#element = props.element;
    this.#name = props.name;
    this.#transpiledCode = localStorage.getItem(`build-ts:${this.#name}`);
    this.#solutionElement = props.solutionElement;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.#emitter = createNanoEvents<Events>();
    this.setEventListener();
  }

  set show(state: boolean) {
    if (state) {
      this.#element.setAttribute('style', 'display: flex;width: 100%;height:calc(100vw / 3)');
    } else {
      this.#element.setAttribute('style', 'display:none;');
    }
  }
  // TODO: Add stying for "read-only" components
  showSolution(state: boolean) {
    if (this.#solutionElement) {
      if (state) {
        this.#solutionElement.setAttribute(
          'style',
          'display: flex;width: 100%;height:calc(100vw / 3)',
        );
      } else {
        this.#solutionElement.setAttribute('style', 'display:none;');
      }
    }
  }

  set code(value: string) {
    this.#element.setAttribute('code', value);
  }

  set readonly(value: string) {
    if (value === 'true') {
      this.#element.setAttribute('read-only', '');
    } else {
      this.#element.removeAttribute('read-only');
    }
  }

  get solutionElement() {
    return this.#solutionElement;
  }

  resetCodeToDefault() {
    this.code = this.#stepRecord.template;
    localStorage.removeItem(`build:${this.#name}`);
    localStorage.removeItem(`build-ts:${this.#name}`);
    this.#transpiledCode = null;
    this.#isValid = false;
  }

  on<E extends keyof Events>(
    event: E,
    callback: Events[E],
  ): (this: Emitter<Events>, event: E, cb: (...args: any) => void) => void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return this.#emitter.on(event, callback);
  }

  set overrideEventListener(state: boolean) {
    this.#overrideEventListener = state;
  }

  setEventListener() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.#element.addEventListener('change', async (event: Event) => {
      const ce = event as CodeStepChangeEvent;
      const noSyntaxErrors = !ce.detail.hasSyntaxErrors;
      const code = ce.detail.transpiledCode;
      // Save if no errors?
      if (noSyntaxErrors) {
        localStorage.setItem(`build-ts:${this.#name}`, ce.detail.transpiledCode);
        localStorage.setItem(`build:${this.#name}`, ce.detail.code);
        this.#transpiledCode = ce.detail.transpiledCode;
        if (!this.#overrideEventListener) {
          await this.handleEvalInput(code);
        }
      }
    });
  }

  set funcInput(args: any[]) {
    this.#args = args;
  }

  setCodeFromCacheOrDefault() {
    this.code = localStorage.getItem(`build:${this.#name}`) ?? this.#stepRecord.template;
  }

  async runCachedCode() {
    try {
      if (this.#transpiledCode) {
        await this.handleEvalInput(this.#transpiledCode);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async handleEvalInput(transpiledCode?: string) {
    this.#emitter.emit(ValidationInProgress, this.#name, this.#stepCount);
    const code = transpiledCode ?? this.#element.getAttribute('code') ?? '';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const implementation = this.#stepRecord.implementation(
      code,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      ...this.#args,
    );

    if (this.#stepRecord.validate) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const results = await this.#stepRecord.validate(implementation, ...this.#args);
        console.log('results', results);
        this.#element.setAttribute(
          'validation-issues',
          JSON.stringify(results.valid ? [] : results.errors),
        );
        this.#isValid = results.valid;
        if (this.#isValid) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          this.#emitter.emit(Validated, results);
        }
      } catch (err) {
        console.log(err);
      }
    }

    this.#emitter.emit(ValidationComplete, this.#name, this.#stepCount, this.#isValid);
  }

  get isValid(): boolean {
    return this.#isValid;
  }
}
