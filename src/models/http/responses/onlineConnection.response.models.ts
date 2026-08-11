export interface OnlineConnection {
  connection_id: string;
  user_id: number | null;
  name: string | null;
  email: string | null;
  ip_address: string;
  user_agent: string;
  connected_since: string;
  page: string | null;
}

export interface OnlineSnapshotMessage {
  event: 'snapshot';
  connections: OnlineConnection[];
}

export interface OnlineDiffMessage {
  event: 'diff';
  upserted: OnlineConnection[];
  removed: string[];
}

export type OnlineAdminMessage = OnlineSnapshotMessage | OnlineDiffMessage;
