import type { Emitter } from 'nanoevents';
import { createNanoEvents } from 'nanoevents';

import type { CodeStepChangeEvent, CodeStepComponent } from '../../components';
import type { CodeStepRecord } from './codeSteps';
import type { StepImplementationRecord } from './ModelBuilder';
const validated = 'validated';
interface Events {
  [validated]: (args: any) => void;
}

export class StepViewer {
  #stepCount = 0;
  #stepRecord: StepImplementationRecord;
  #element: Element;
  #name: string;
  #isValid = false;
  #args = [] as any[];
  #emitter: Emitter<Events>;

  constructor(props: {
    stepRecord: StepImplementationRecord;
    element: Element;
    name: string;
    stepCount?: number;
  }) {
    this.#stepCount = props.stepCount ?? 0;
    this.#stepRecord = props.stepRecord;
    this.#element = props.element;
    this.#name = props.name;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.#emitter = createNanoEvents<Events>();
    this.setEventListener();
  }

  set show(state: boolean) {
    if (state) {
      this.#element.setAttribute('style', 'display:initial;');
    } else {
      this.#element.setAttribute('style', 'display:none;');
    }
  }

  set code(value: string) {
    this.#element.setAttribute('code', value);
  }

  on<E extends keyof Events>(
    event: E,
    callback: Events[E],
  ): (this: Emitter<Events>, event: E, cb: (...args: any) => void) => void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return this.#emitter.on(event, callback);
  }

  setEventListener() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.#element.addEventListener('change', async (event: Event) => {
      const ce = event as CodeStepChangeEvent;
      localStorage.setItem(`build:${this.#name}`, ce.detail.code);

      const noSyntaxErrors = !ce.detail.hasSyntaxErrors;
      if (noSyntaxErrors) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const implementation = this.#stepRecord.implementation(
          ce.detail.transpiledCode,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          ...this.#args,
        );
        if (this.#stepRecord.validate) {
          const results = await this.#stepRecord.validate(implementation);
          this.#element.setAttribute(
            'validation-issues',
            JSON.stringify(results.valid ? [] : results.errors),
          );
          this.#isValid = results.valid;
          if (this.#isValid) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            this.#emitter.emit(validated, results);
          }
        }
      }
    });
  }

  get isValid(): boolean {
    return this.#isValid;
  }
}
