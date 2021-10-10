export interface Id {
  S: string;
}

export interface Count {
  N: string;
}

export interface COUNTERTERRORIST {
  N: string;
}

export interface TERRORIST {
  N: string;
}

export interface M {
  count: Count;
  COUNTER_TERRORIST: COUNTERTERRORIST;
  TERRORIST: TERRORIST;
}

export interface Data {
  N: string;
  M: M;
}

export interface Result {
  id: Id;
  data: Data;
}

export interface RootObject {
  result: Result[];
}


