export declare type Position = number[];

export type PersonInfoType = {
  name: string;
  no: string;
  color: number[];
  category: string;
  position: Position;
  distance: number;
};

export type PersonResult = {
  time1: number;
  time2: number;
  distance1: number;
  distance2: number;
  distanceDiff: number;
  speed: number;
};

export type PersonResultParent = {
  ranking?: string;
  isDnf: boolean;
  name: string;
  firstName: string;
  lastName: string;
  no: string;
  category: string;
  種目: string;
  color: number[];
  results: PersonResult[];
};
