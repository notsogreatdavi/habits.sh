describe("ambiente de testes", () => {
  it("executa corretamente", () => {
    expect(true).toBe(true)
  })

  it("reconhece matchers do jest-dom", () => {
    const div = document.createElement("div")
    document.body.appendChild(div)
    expect(div).toBeInTheDocument()
    document.body.removeChild(div)
  })
})
