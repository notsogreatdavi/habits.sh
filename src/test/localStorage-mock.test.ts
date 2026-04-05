import { installLocalStorageMock, localStorageMock } from "./localStorage-mock"

beforeAll(() => {
  installLocalStorageMock()
})

beforeEach(() => {
  localStorageMock.clear()
  vi.clearAllMocks()
})

describe("localStorageMock", () => {
  describe("given an empty store", () => {
    describe("when setItem is called", () => {
      it("then stores the value", () => {
        localStorageMock.setItem("key", "value")
        expect(localStorageMock.getItem("key")).toBe("value")
      })

      it("then records the call", () => {
        localStorageMock.setItem("key", "value")
        expect(localStorageMock.setItem).toHaveBeenCalledWith("key", "value")
      })
    })

    describe("when getItem is called with an unknown key", () => {
      it("then returns null", () => {
        expect(localStorageMock.getItem("unknown")).toBeNull()
      })
    })
  })

  describe("given a store with one item", () => {
    beforeEach(() => {
      localStorageMock.setItem("key", "value")
      vi.clearAllMocks()
    })

    describe("when removeItem is called", () => {
      it("then the item is no longer retrievable", () => {
        localStorageMock.removeItem("key")
        expect(localStorageMock.getItem("key")).toBeNull()
      })
    })

    describe("when clear is called", () => {
      it("then the store is empty", () => {
        localStorageMock.clear()
        expect(localStorageMock.getItem("key")).toBeNull()
      })
    })
  })
})
