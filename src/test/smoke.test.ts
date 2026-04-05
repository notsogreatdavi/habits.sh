import { describe, expect, it } from "vitest"
import "./localStorage-mock"

describe("test environment", () => {
  it("executes correctly", () => {
    expect(true).toBe(true)
  })

  it("has access to localStorage via mock", () => {
    localStorage.setItem("test", "habits.sh")
    expect(localStorage.getItem("test")).toBe("habits.sh")
    localStorage.removeItem("test")
  })
})
