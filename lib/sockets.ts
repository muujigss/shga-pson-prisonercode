// socket.ts
// ZkFingerprint агент нэг компьютер дээр бол 127.0.0.1 (docs/CLIENT_GUIDE.md 1, 8-р хэсэг)
const BASE_URL = process.env.NEXT_PUBLIC_FINGER_URL || 'ws://127.0.0.1:8089';
type Listener = (event: MessageEvent) => void;

// Дахин холбогдох хугацаа: 1с -> 2с -> 4с -> 5с (дээд тал) (гарын авлага 6-р хэсэг)
const RETRY_MIN_MS = 1000;
const RETRY_MAX_MS = 5000;

class ReconnectWebSocket {
  private socket: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private retryMs = RETRY_MIN_MS;

  private readonly url: string;

  public isConnected = false;

  private messageListeners = new Set<Listener>();
  private openListeners = new Set<() => void>();
  private closeListeners = new Set<(e: CloseEvent) => void>();

  constructor(url: string) {
    this.url = url;

    // browser дээр offline/online сонсох
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('🌐 INTERNET ONLINE');
        this.reconnectNow();
      });
    }

    this.connect();
  }

  public get state(): 'connecting' | 'open' | 'closed' {
    const readyState = this.socket?.readyState;
    if (readyState === WebSocket.OPEN) return 'open';
    if (readyState === WebSocket.CONNECTING) return 'connecting';
    return 'closed';
  }

  private connect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // already connecting/open
    if (this.state !== 'closed') return;

    console.log('🔌 TRY CONNECT:', this.url);

    let ws: WebSocket;
    try {
      ws = new WebSocket(this.url);
    } catch (err) {
      // Жишээ нь HTTPS хуудаснаас LAN ws:// хаяг руу (mixed content) хандахад шууд алдаа шиднэ
      console.log('⚠️ SOCKET CREATE FAILED', err);
      this.scheduleReconnect();
      return;
    }
    this.socket = ws;

    ws.onopen = () => {
      if (this.socket !== ws) return;
      console.log('✅ SOCKET OPEN');

      this.isConnected = true;
      this.retryMs = RETRY_MIN_MS;

      this.openListeners.forEach(cb => cb());
    };

    ws.onmessage = (event) => {
      if (this.socket !== ws) return;
      this.messageListeners.forEach(cb => cb(event));
    };

    ws.onclose = (event) => {
      if (this.socket !== ws) return;
      console.log('❌ SOCKET CLOSE:', event.code);

      this.isConnected = false;

      this.closeListeners.forEach(cb => cb(event));

      this.scheduleReconnect();
    };

    ws.onerror = (err) => {
      console.log('⚠️ SOCKET ERROR', err);

      // force close -> reconnect
      ws.close();
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;

    const delay = this.retryMs;
    this.retryMs = Math.min(this.retryMs * 2, RETRY_MAX_MS);

    console.log(`⏳ RECONNECT IN ${delay / 1000}s`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  // Хүлээлгүйгээр шууд дахин холбогдох (жишээ нь "Одоо холбогдох" товч)
  public reconnectNow() {
    this.retryMs = RETRY_MIN_MS;
    this.connect();
  }

  public send(data: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(data);
    } else {
      console.log('⚠️ SOCKET NOT CONNECTED');
    }
  }

  public addMessageListener(cb: Listener) {
    this.messageListeners.add(cb);

    return () => {
      this.messageListeners.delete(cb);
    };
  }

  public addOpenListener(cb: () => void) {
    this.openListeners.add(cb);

    return () => {
      this.openListeners.delete(cb);
    };
  }

  public addCloseListener(cb: (e: CloseEvent) => void) {
    this.closeListeners.add(cb);

    return () => {
      this.closeListeners.delete(cb);
    };
  }
}

let socketInstance: ReconnectWebSocket | null = null;

export const getSocket = () => {
  if (typeof window === 'undefined') return null;

  if (!socketInstance) {
    socketInstance = new ReconnectWebSocket(
      BASE_URL
    );
  }

  return socketInstance;
};
