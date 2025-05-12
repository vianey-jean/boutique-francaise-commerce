
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Polyfills for the modules used by simple-peer and socket.io
window.global = window;
if (typeof global === 'undefined') {
  (window as any).global = window;
}

// Ensure browser objects and methods are available
if (typeof process === 'undefined') {
  (window as any).process = { env: {} };
}

// Add events polyfill
if (typeof window.EventEmitter === 'undefined') {
  (window as any).EventEmitter = class EventEmitter {
    listeners = {};
    
    on(event: string, listener: Function) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(listener);
      return this;
    }
    
    emit(event: string, ...args: any[]) {
      if (!this.listeners[event]) return false;
      this.listeners[event].forEach((listener) => listener(...args));
      return true;
    }
    
    removeListener(event: string, listener: Function) {
      if (!this.listeners[event]) return this;
      this.listeners[event] = this.listeners[event].filter(l => l !== listener);
      return this;
    }
  };
}

// Add util polyfills
if (typeof window.util === 'undefined') {
  (window as any).util = {
    debuglog: () => () => {},
    inspect: (obj: any) => JSON.stringify(obj),
  };
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
