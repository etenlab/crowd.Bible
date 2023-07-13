declare module '!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm' {}

declare module '*.tab' {
  const value: string;
  export default value;
}

type Nanoid = string;

type RelationshipDirection = 'from_node_id' | 'to_node_id';

type VotesStatsRow = {
  candidateId: Nanoid;
  upVotes: number;
  downVotes: number;
};

interface Table {
  id?: string;
  name: string;
  cells?: TableCell[];
}

interface TableCell {
  column?: string;
  row?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

interface Word {
  id?: string;
  name: string;
}
