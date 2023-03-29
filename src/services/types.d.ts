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
