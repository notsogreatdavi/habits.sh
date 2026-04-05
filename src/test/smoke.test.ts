import { installLocalStorageMock, localStorageMock } from "./localStorage-mock"

installLocalStorageMock()

describe("test environment", () => {
  it("executes correctly", () => {
    expect(true).toBe(true)
  })

  it("has access to localStorage via mock", () => {
    localStorageMock.setItem("test", "habits.sh")
    expect(localStorageMock.getItem("test")).toBe("habits.sh")
    localStorageMock.removeItem("test")
  })
})
