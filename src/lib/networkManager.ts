import { db } from './firebase';
import { enableNetwork, disableNetwork, waitForPendingWrites } from 'firebase/firestore';

class NetworkManager {
  private static instance: NetworkManager;
  private isOnline: boolean = navigator.onLine;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private listeners: Set<(online: boolean) => void> = new Set();

  private constructor() {
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  public static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  public addListener(listener: (online: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  private async handleOnline(): Promise<void> {
    this.isOnline = true;
    this.notifyListeners();
    await this.reconnect();
  }

  private async handleOffline(): Promise<void> {
    this.isOnline = false;
    this.notifyListeners();
    await this.disconnect();
  }

  private async reconnect(): Promise<void> {
    try {
      await enableNetwork(db);
      this.reconnectAttempts = 0;
      console.log('Successfully reconnected to Firebase');
    } catch (error) {
      console.error('Error reconnecting to Firebase:', error);
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        setTimeout(() => this.reconnect(), delay);
      }
    }
  }

  private async disconnect(): Promise<void> {
    try {
      await disableNetwork(db);
      console.log('Successfully disconnected from Firebase');
    } catch (error) {
      console.error('Error disconnecting from Firebase:', error);
    }
  }

  public async waitForSync(): Promise<void> {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }
    try {
      await waitForPendingWrites(db);
    } catch (error) {
      console.error('Error waiting for sync:', error);
      throw error;
    }
  }

  public getConnectionState(): boolean {
    return this.isOnline;
  }
}

export const networkManager = NetworkManager.getInstance();
export default networkManager;