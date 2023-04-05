declare module '*.tab' {
  const value: string;
  export default value;
}

type TablesName =
  | 'nodes'
  | 'node_property_keys'
  | 'node_property_values'
  | 'relationships'
  | 'relationship_property_keys'
  | 'relationship_property_values';

type Nanoid = string;

type BallotEntryTarget = {
  tableName: TablesName;
  rowId: Nanoid;
};

type VotesStatsRow = {
  ballot_entry_id: Nanoid;
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

interface Word {
  id?: string;
  name: string;
}
