// socket.ts
type Listener = (event: MessageEvent) => void;

class ReconnectWebSocket {
  private socket: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;

  private readonly url: string;
  private readonly reconnectDelay = 3000;

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
        this.connect();
      });
    }

    this.connect();
  }

  private connect() {
    // already connecting/open
    if (
      this.socket &&
      (
        this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING
      )
    ) {
      return;
    }

    console.log('🔌 TRY CONNECT:', this.url);

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('✅ SOCKET OPEN');

      this.isConnected = true;

      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }

      this.openListeners.forEach(cb => cb());
    };

    this.socket.onmessage = (event) => {
      this.messageListeners.forEach(cb => cb(event));
    };

    this.socket.onclose = (event) => {
      console.log('❌ SOCKET CLOSE:', event.code);

      this.isConnected = false;

      this.closeListeners.forEach(cb => cb(event));

      this.reconnect();
    };

    this.socket.onerror = (err) => {
      console.log('⚠️ SOCKET ERROR', err);

      // force close -> reconnect
      this.socket?.close();
    };
  }

  private reconnect() {
    if (this.reconnectTimer) return;

    console.log(`⏳ RECONNECT IN ${this.reconnectDelay / 1000}s`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, this.reconnectDelay);
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
      'ws://192.168.1.125:8089'
    );
  }

  return socketInstance;
};
