export interface DBList {
  list_id: number;
  title: string;
  time_created: Date;
  time_modified: Date;
}

export interface DBEntry {
  entry_id: number;
  name: string;
  score: number;
  time_created: Date;
  time_modified: Date;
}
