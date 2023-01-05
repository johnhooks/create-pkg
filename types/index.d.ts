export type Context = {
  cwd: string;
  template: string;
  root: boolean;
  name: string;
  scope?: string;
  author?: {
    email?: string;
    name?: string;
    url?: string;
    [index: string]: any;
  };
  [index: string]: any;
};
