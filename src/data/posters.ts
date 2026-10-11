import records from './posters.json';
export interface Poster {
  id: string;
  src: string;
  width: number;
  height: number;
  kind: string;
  credit: string;
  sourcePage: string;
  filePage?: string;
  sourceRightsStatement: string;
  usageBasis: string;
  reviewed: string;
}
export const posters = records as Poster[];
export const posterFor = (id?: string) => posters.find((p) => p.id === id);
