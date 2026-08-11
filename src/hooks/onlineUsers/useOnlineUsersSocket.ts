import { useContext, useEffect, useRef, useState } from 'react';
import { appContext } from '../../context/AppContext';
import { getWsUrl } from '../../services/api/websocket';
import {
  OnlineAdminMessage,
  OnlineConnection,
} from '../../models/http/responses/onlineConnection.response.models';

const RECONNECT_DELAY_MS = 3_000;
const UNAUTHORIZED_CLOSE_CODE = 1008;

// Consumes the admin-only "who's online" socket: one snapshot on connect,
// then batched upsert/remove diffs. Reconnecting always gets a fresh
// snapshot, so no state needs to persist across reconnects.
function useOnlineUsersSocket() {
  const { accessToken } = useContext(appContext);
  const [connections, setConnections] = useState<OnlineConnection[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const connectionsMapRef = useRef<Map<string, OnlineConnection>>(new Map());

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;

    function applySnapshot(list: OnlineConnection[]) {
      const map = new Map(list.map((c) => [c.connection_id, c]));
      connectionsMapRef.current = map;
      setConnections(Array.from(map.values()));
    }

    function applyDiff(upserted: OnlineConnection[], removed: string[]) {
      const map = connectionsMapRef.current;
      upserted.forEach((c) => map.set(c.connection_id, c));
      removed.forEach((id) => map.delete(id));
      setConnections(Array.from(map.values()));
    }

    function connect() {
      const base = getWsUrl('/api/admin/online/ws');
      const url = accessToken ? `${base}?token=${accessToken}` : base;
      ws = new WebSocket(url);

      ws.onopen = () => setIsConnected(true);

      ws.onmessage = (event) => {
        const message: OnlineAdminMessage = JSON.parse(event.data);
        if (message.event === 'snapshot') {
          applySnapshot(message.connections);
        } else if (message.event === 'diff') {
          applyDiff(message.upserted, message.removed);
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        if (stopped || event.code === UNAUTHORIZED_CLOSE_CODE) {
          return;
        }
        reconnectTimeout = setTimeout(connect, RECONNECT_DELAY_MS);
      };
    }

    connect();

    return () => {
      stopped = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      ws?.close();
    };
  }, [accessToken]);

  return { connections, isConnected };
}

export default useOnlineUsersSocket;
