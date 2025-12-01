/**
 * Browser Push Notifications Manager
 * Handles permission requests and displays browser notifications
 */

export class NotificationManager {
  private static instance: NotificationManager;

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  /**
   * Check if browser supports notifications
   */
  isSupported(): boolean {
    return "Notification" in window;
  }

  /**
   * Get current permission status
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) {
      return "denied";
    }
    return Notification.permission;
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn("Browser does not support notifications");
      return "denied";
    }

    if (Notification.permission === "granted") {
      return "granted";
    }

    if (Notification.permission === "denied") {
      return "denied";
    }

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error("Failed to request notification permission:", error);
      return "denied";
    }
  }

  /**
   * Show a browser notification
   */
  async show(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.isSupported()) {
      console.warn("Browser does not support notifications");
      return;
    }

    const permission = await this.requestPermission();
    
    if (permission !== "granted") {
      console.warn("Notification permission not granted");
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: "/logo.png",
        badge: "/logo.png",
        ...options,
      });

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return new Promise((resolve) => {
        notification.onclick = () => {
          window.focus();
          notification.close();
          resolve();
        };

        notification.onclose = () => {
          resolve();
        };

        notification.onerror = () => {
          resolve();
        };
      });
    } catch (error) {
      console.error("Failed to show notification:", error);
    }
  }

  /**
   * Show notification for a specific type
   */
  async showNotification(
    type: "order" | "account" | "product" | "system" | "admin",
    title: string,
    message: string,
    link?: string
  ): Promise<void> {
    const icons = {
      order: "🛍️",
      account: "👤",
      product: "✨",
      system: "⚙️",
      admin: "🔒",
    };

    await this.show(title, {
      body: message,
      tag: type,
      icon: `/logo.png`,
      badge: `/logo.png`,
      data: { link },
      requireInteraction: false,
    });
  }
}

/**
 * Hook to use notification manager
 */
export function useNotifications() {
  const manager = NotificationManager.getInstance();

  return {
    isSupported: manager.isSupported(),
    permission: manager.getPermissionStatus(),
    requestPermission: () => manager.requestPermission(),
    showNotification: (
      type: "order" | "account" | "product" | "system" | "admin",
      title: string,
      message: string,
      link?: string
    ) => manager.showNotification(type, title, message, link),
  };
}
