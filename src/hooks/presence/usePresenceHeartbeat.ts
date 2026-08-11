import { useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { appContext } from '../../context/AppContext';
import { getWsUrl } from '../../services/api/websocket';

const HEARTBEAT_INTERVAL_MS = 25_000;
const RECONNECT_DELAY_MS = 3_000;

// Reports this session's presence + current page to the backend so it shows
// up on the admin "online users" dashboard. Fire-and-forget: the server
// never sends anything back on this socket. Anonymous sessions are allowed -
// the token query param is only appended when one is available.
function usePresenceHeartbeat() {
  const { accessToken } = useContext(appContext);
  const { pathname } = useLocation();

  const pageRef = useRef(pathname);
  const tokenRef = useRef(accessToken);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
    let heartbeatInterval: ReturnType<typeof setInterval> | undefined;
    let reconnectTimeout: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;

    function sendPage() {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ page: pageRef.current }));
      }
    }

    function connect() {
      const base = getWsUrl('/api/online/ws');
      const url = tokenRef.current ? `${base}?token=${tokenRef.current}` : base;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        sendPage();
        heartbeatInterval = setInterval(sendPage, HEARTBEAT_INTERVAL_MS);
      };

      ws.onclose = () => {
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        wsRef.current = null;
        if (!stopped) {
          reconnectTimeout = setTimeout(connect, RECONNECT_DELAY_MS);
        }
      };
    }

    connect();

    return () => {
      stopped = true;
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      wsRef.current?.close();
      wsRef.current = null;
    };
    // Connects once for the whole app session - reconnects are handled
    // internally, and page changes are pushed via the effect below instead
    // of tearing the socket down and reopening it.
  }, []);

  useEffect(() => {
    pageRef.current = pathname;
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ page: pathname }));
    }
  }, [pathname]);
}

export default usePresenceHeartbeat;
