import usePresenceHeartbeat from '../../../hooks/presence/usePresenceHeartbeat';

// Mounted once near the app root so every session (logged in or anonymous)
// reports presence to the admin "online users" dashboard. Renders nothing.
function PresenceHeartbeat() {
  usePresenceHeartbeat();
  return null;
}

export default PresenceHeartbeat;
