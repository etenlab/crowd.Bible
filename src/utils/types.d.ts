declare module '*.tab' {
  const value: string;
  export default value;
}

type TableNameType =
  | 'nodes'
  | 'node_property_keys'
  | 'node_property_values'
  | 'relationships'
  | 'relationship_property_keys'
  | 'relationship_property_values';

type NanoidType = string;

type BallotEntryTargetType = {
  tableName: TableNameType;
  rowId: NanoidType;
};

type VotesStatsRow = {
  ballot_entry_id: NanoidType;
  up: number;
  down: number;
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

interface Document {
  id?: string;
  name: string;
}

interface Word {
  id?: string;
  name: string;
}
