
// This file provides polyfills for Node.js modules that might be needed in the browser

// EventEmitter polyfill
export class EventEmitter {
  private events: Record<string, Array<(...args: any[]) => void>> = {};

  on(event: string, listener: (...args: any[]) => void): this {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  emit(event: string, ...args: any[]): boolean {
    if (!this.events[event]) {
      return false;
    }
    this.events[event].forEach(listener => listener(...args));
    return true;
  }

  removeListener(event: string, listener: (...args: any[]) => void): this {
    if (!this.events[event]) {
      return this;
    }
    this.events[event] = this.events[event].filter(l => l !== listener);
    return this;
  }
}

// Util polyfill
export const util = {
  debuglog: (section: string) => {
    return (...args: any[]) => {
      if (process.env.NODE_DEBUG && process.env.NODE_DEBUG.includes(section)) {
        console.log(`${section} ${args.join(' ')}`);
      }
    };
  },
  inspect: (obj: any, options?: any) => {
    return JSON.stringify(obj, null, 2);
  }
};

// Expose these polyfills to the window object
declare global {
  interface Window {
    EventEmitter: typeof EventEmitter;
    util: typeof util;
  }
}

// Set up the polyfills on the window object
if (typeof window !== 'undefined') {
  window.EventEmitter = EventEmitter;
  window.util = util;
}

export default {
  EventEmitter,
  util
};
