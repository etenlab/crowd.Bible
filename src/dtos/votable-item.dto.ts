export interface Votable {
  upVotes: number;
  downVotes: number;
  candidateId: Nanoid | null;
}

export interface VotableContent extends Votable {
  id: Nanoid | null;
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
}

export interface VotableItem {
  title: VotableContent;
  contents: VotableContent[];
  contentElectionId: Nanoid | null;
}
