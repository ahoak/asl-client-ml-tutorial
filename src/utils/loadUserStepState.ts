export type UserStepStateMap<T extends string> = Record<T, UserStepStateRecord<T>>;

export function loadUserStepState<T extends string>(
  stepNames: T[],
  storageKey: string,
): UserStepStateMap<T> {
  const stepImpls = stepNames.reduce((acc, item) => {
    acc[item] = {
      name: item,
      valid: false,
      code: '',
      transpiledCode: '',
    };
    return acc;
  }, {} as UserStepStateMap<T>);

  try {
    const storedDataRaw = localStorage.getItem(storageKey);
    if (storedDataRaw) {
      const storedData = JSON.parse(storedDataRaw) as UserStepStateMap<T>;
      (Object.keys(storedData) as T[]).forEach((name) => {
        if (stepImpls[name]) {
          Object.assign(stepImpls[name], storedData[name]);
        }
      });
    }
  } catch (e) {
    console.error('could not restore previous state', e);
  }
  return stepImpls;
}

export function saveUserStepState<T extends string>(state: Record<T, any>, storageKey: string) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

type UserStepStateRecord<T extends string> = {
  impl?: (...args: any[]) => any;
  name: T;
  code: string;
  transpiledCode: string;
  valid: boolean;
};
