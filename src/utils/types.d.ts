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

interface IFile {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  fileHash: string;
}
interface UploadedFile {
  uploadFile: IFile;
}

interface IUser {
  user_id: string;
  kid: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  active: boolean;
  avatar_url?: string;
  is_email_verified: boolean;
  created_at: Date;
}

interface CreatedUser {
  createUser: IUser;
}

interface GetUser {
  getUser?: IUser;
}

interface UpdatedUser {
  updateUser: IUser;
}
