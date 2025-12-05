import EventEmitter from "events";
import { io, Socket } from "socket.io-client";

import { AppConfig } from "@/config/app.config";

type WebSocketOptions = {
  namespace: string;
  query?: Record<string, number | string>;
  token?: string | null;
};

const CONNECTION_DELAY = 4200;

type SocketEventHandler = (...args: any[]) => void;

export default class WebSocket {
  /**
   * has to be a public field, since it's made an observable in some places
   */
  public connected = false;

  protected privateOptions: WebSocketOptions;

  protected socket: Socket | undefined;

  protected shouldConnect = true;

  protected reConnectInterval?: NodeJS.Timeout;

  /**
   * we're keeping track of runtime event handler assignments,
   * so we can reassign them once we reinitialize a new socket instance
   */
  protected eventHandlersMap: Map<string, SocketEventHandler[]> = new Map();

  constructor(options: WebSocketOptions) {
    this.privateOptions = options;
    this.connectSocket();
  }

  public set options(options: WebSocketOptions) {
    this.privateOptions = options;
    /**
     * we initialize a new socket instance if the setting change
     */
    this.connectSocket();
  }

  /**
   * @description attach event handler
   */
  public on = (eventName: string, handler: SocketEventHandler) => {
    this.socket?.on(eventName, handler);

    if (this.eventHandlersMap.has(eventName)) {
      const existingHandlers = this.eventHandlersMap.get(eventName);
      if (!existingHandlers) {
        this.eventHandlersMap.set(eventName, [handler]);
        return;
      }
      this.eventHandlersMap.set(eventName, [...existingHandlers, handler]);
      return;
    }
    this.eventHandlersMap.set(eventName, [handler]);
  };

  /**
   * @description remove event handler
   */
  public off = (eventName: string, handler?: SocketEventHandler) => {
    this.socket?.off(eventName, handler);
    if (this.eventHandlersMap.has(eventName)) {
      if (!handler) {
        this.eventHandlersMap.delete(eventName);
        return;
      }
      const existingHandlers = this.eventHandlersMap.get(eventName);
      const filteredHandlers = existingHandlers?.filter((h) => h !== handler) || [];

      if (filteredHandlers?.length <= 0) {
        this.eventHandlersMap.delete(eventName);
        return;
      }

      this.eventHandlersMap.set(eventName, filteredHandlers);
    }
  };

  /**
   * @description disconnect from socket
   */
  public disconnect = () => {
    this.shouldConnect = false;
    this.disconnectCurrentSocketInstance();
    this.clearEventHandlersMap();
    if (this.reConnectInterval) {
      clearInterval(this.reConnectInterval);
      this.reConnectInterval = undefined;
    }
  };

  /**
   * @description remove all event listeners
   */
  public removeAllListeners = () => {
    this.removeAllCurrentSocketListeners();
    this.clearEventHandlersMap();
  };

  protected removeAllCurrentSocketListeners = () => {
    (this.socket as unknown as EventEmitter)?.removeAllListeners?.();
  };

  protected clearEventHandlersMap = () => {
    this.eventHandlersMap.forEach((_handler, eventName) => {
      this.eventHandlersMap.delete(eventName);
    });
  };

  protected connectSocket = () => {
    this.disconnectCurrentSocketInstance();
    if (!this.shouldConnect) {
      return;
    }

    const { query } = this.privateOptions;
    this.socket = io(`${AppConfig.api.url}`, {
      withCredentials: true,
      query,
      transports: ["websocket"],
      forceNew: true,
      // we handle reconnection ourselves on the connect error event
      reconnection: false,
      auth: {
        Authorization: `Bearer ${this.privateOptions.token}`,
      },
    });

    this.socket.on("connect_error", this.handleConnectError);
    this.socket.on("connect", this.handleConnect);
    this.socket.on("disconnect", this.handleDisconnect);
    this.reAssignEventHandlersToNewSocketInstance();
    this.reConnectInterval = undefined;
  };

  public emit = <T>(eventName: string, params?: any, callback?: (response: T) => void) => {
    this.socket?.emit?.(eventName, params, callback);
  };

  public emitAsync = async <T>(eventName: string, params?: any): Promise<T> => {
    return new Promise((resolve) => {
      this.socket?.emit(eventName, params, (response: T) => {
        resolve(response);
      });
    });
  };

  public setAuthToken = (token: string | null) => {
    this.privateOptions.token = token;
  };

  protected reAssignEventHandlersToNewSocketInstance() {
    this.eventHandlersMap.forEach((eventHandlers, eventName) => {
      eventHandlers.forEach((handler) => {
        this.socket?.on(eventName, handler);
      });
    });
  }

  protected handleConnect = () => {
    this.connected = true;
  };

  protected handleDisconnect = () => {
    this.connected = false;
    this.initiateDelayedReConnection();
  };

  protected handleConnectError = () => {
    this.initiateDelayedReConnection();
  };

  protected initiateDelayedReConnection = () => {
    this.reConnectInterval = setTimeout(() => {
      /**
       * When the connection fails or disconnects, we reinitialize it
       * This was the only way we found to refresh the http only credential of the socket instance
       */
      this.connectSocket();
    }, CONNECTION_DELAY);
  };

  protected disconnectCurrentSocketInstance = () => {
    this.connected = false;
    this.removeAllCurrentSocketListeners();
    this.socket?.disconnect?.();
    if (this.reConnectInterval) {
      clearInterval(this.reConnectInterval);
      this.reConnectInterval = undefined;
    }
  };
}
