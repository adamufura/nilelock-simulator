import { io, type Socket } from "socket.io-client";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "https://furacomp-products-nilelock-backend.o9oxxq.easypanel.host";

let socket: Socket | null = null;
let publicSocket: Socket | null = null;

export function getApiBase(): string {
  return API_BASE;
}

export function connectSocket(token: string): Socket {
  if (socket?.connected) {
    socket.auth = { token };
    return socket;
  }
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
  socket = io(API_BASE, {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });
  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

/** Read-only campus displays: no JWT. */
export function connectPublicSocket(): Socket {
  if (publicSocket?.connected) return publicSocket;
  if (publicSocket) {
    publicSocket.removeAllListeners();
    publicSocket.disconnect();
    publicSocket = null;
  }
  publicSocket = io(`${API_BASE}/public`, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });
  return publicSocket;
}

export function disconnectPublicSocket(): void {
  if (publicSocket) {
    publicSocket.removeAllListeners();
    publicSocket.disconnect();
    publicSocket = null;
  }
}
