export interface VotableContent {
  content: string;
  upVotes: number;
  downVotes: number;
  id: Nanoid | null;
  candidateId: Nanoid | null;
}

export interface VotableItem {
  title: VotableContent;
  contents: VotableContent[];
  contentElectionId: Nanoid | null;
}
