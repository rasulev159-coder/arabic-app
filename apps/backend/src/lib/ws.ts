import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { verifyAccess } from './auth';
import { WsEvent } from '@arabic/shared';

// Map: challengeId → Set of connected sockets with user info
const rooms = new Map<string, Map<string, WebSocket>>();

export function setupWs(wss: WebSocketServer): void {
  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url ?? '', `http://localhost`);
    const token       = url.searchParams.get('token');
    const challengeId = url.searchParams.get('challengeId');

    if (!token || !challengeId) {
      ws.close(1008, 'Missing token or challengeId');
      return;
    }

    let userId: string;
    try {
      const payload = verifyAccess(token);
      userId = payload.userId;
    } catch {
      ws.close(1008, 'Invalid token');
      return;
    }

    // Join room
    if (!rooms.has(challengeId)) rooms.set(challengeId, new Map());
    rooms.get(challengeId)!.set(userId, ws);

    ws.on('close', () => {
      rooms.get(challengeId)?.delete(userId);
      if (rooms.get(challengeId)?.size === 0) rooms.delete(challengeId);
    });
  });
}

export function broadcastToRoom(challengeId: string, event: WsEvent, exceptUserId?: string): void {
  const room = rooms.get(challengeId);
  if (!room) return;
  const payload = JSON.stringify(event);
  room.forEach((ws, uid) => {
    if (uid !== exceptUserId && ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  });
}

export function sendToUser(challengeId: string, userId: string, event: WsEvent): void {
  const ws = rooms.get(challengeId)?.get(userId);
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(event));
  }
}
