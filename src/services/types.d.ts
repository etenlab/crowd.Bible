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

type TStringUUID = string;

type TNodeTypes = 'word' | 'definition';
type TPropertyKeys =
  | 'lemma'
  | 'xlit'
  | 'pron'
  | 'derivation'
  | 'strongs_def'
  | 'kjv_def'
  | 'strongs_id'
  | 'text';
