export interface validation {
  index: number;
  meta: {
    title: string;
    description: string;
  };
  call(store: any): any;
  restore?(store: any): any;
}

export interface logs extends Omit<validation, "call"> {
  storeBefore: {};
  storeAfter?: {};
  error: null | {
    name: string,
    message: string,
    info: string
  } | string;
}


export interface dispatch<T> {
  dispatch(scenario: T): Promise<T>;
}
