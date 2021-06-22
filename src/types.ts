export interface APICategory {
  code: number;
  name: string;
}

export interface Category extends APICategory {
  code: number;
  name: string;
  level: number;
}
