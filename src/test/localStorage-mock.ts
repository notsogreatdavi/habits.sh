import { vi, type MockedFunction } from "vitest"

export interface LocalStorageMock {
  getItem: MockedFunction<(key: string) => string | null>
  setItem: MockedFunction<(key: string, value: string) => void>
  removeItem: MockedFunction<(key: string) => void>
  clear: MockedFunction<() => void>
}

export const localStorageMock: LocalStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

export function installLocalStorageMock() {
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
  })
}
