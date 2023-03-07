interface Table {
  id?: string;
  name: string;
  cells?: TableCell[];
}

interface TableCell {
  column?: string;
  row?: string;
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
