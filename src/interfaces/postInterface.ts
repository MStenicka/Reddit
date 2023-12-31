export interface Post {
  id?: number;
  title: string;
  url: string;
  timestamp: number;
  score: number;
  owner?: string;
  vote?: number;
}
