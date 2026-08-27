/// <reference types="vite/client" />

interface Window {
  __SERVER_FORWARD_CONSOLE__?: {
    log: typeof console.log
    warn: typeof console.warn
    error: typeof console.error
    info: typeof console.info
    debug: typeof console.debug
  }
}
