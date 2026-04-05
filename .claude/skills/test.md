# Skill: Vitest — Execução de Testes

## Propósito

Executar a suíte de testes com Vitest para validar que hooks, componentes e funções puras se comportam conforme especificado em BDD. Esta skill cobre execução, interpretação de falhas e cobertura de código.

---

## Pré-condições

```bash
# Verificar se Vitest está instalado
cat package.json | grep '"vitest"'

# Verificar se existe configuração
ls vitest.config* 2>/dev/null || echo "Usando configuração do vite.config.ts"
```

### Configuração esperada (`vitest.config.ts` ou dentro do `vite.config.ts`)
```typescript
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

### Setup file obrigatório (`src/test/setup.ts`)
```typescript
import "@testing-library/jest-dom"
```

---

## Execução

### Todos os testes (modo CI — roda uma vez e sai)
```bash
pnpm test run
# ou
pnpm exec vitest run
```

### Modo watch (durante desenvolvimento)
```bash
pnpm test
# ou
pnpm exec vitest
```

### Arquivo específico
```bash
pnpm exec vitest run src/hooks/useHabits.test.ts
```

### Com cobertura de código
```bash
pnpm exec vitest run --coverage
```

### Filtrar por nome de teste (padrão de string)
```bash
pnpm exec vitest run --reporter=verbose -t "given no habits exist"
```

---

## Interpretação de Output

### Teste passando
```
✓ src/hooks/useHabits.test.ts (4 tests) 12ms
  ✓ useHabits > given no habits exist > when initialized > then returns empty array
  ✓ useHabits > given no habits exist > when addHabit called > then adds to list
  ✓ useHabits > given no habits exist > when addHabit called > then persists to localStorage
  ✓ useHabits > given one habit > when removeHabit called > then removes from list
```

### Teste falhando
```
✗ src/hooks/useHabits.test.ts > useHabits > given no habits exist > when addHabit called > then persists to localStorage

AssertionError: expected "spy" to have been called once, but got 0 times

  - Expected: 1
  + Received: 0

  at src/hooks/useHabits.test.ts:42:38
```

**Como diagnosticar:**
1. Ler a mensagem de erro completa — o Vitest mostra diff quando disponível.
2. Ir para a linha indicada no arquivo de teste.
3. Verificar se o mock foi configurado corretamente antes do `act()`.
4. Verificar se o `act()` envolve a mutação de estado.

---

## Falhas Comuns e Soluções

### `localStorage is not defined`
```
ReferenceError: localStorage is not defined
```
→ O ambiente `jsdom` não está configurado, ou o `setupFiles` não foi aplicado.
→ Verificar `vitest.config.ts`: `environment: "jsdom"` deve estar presente.

### `Warning: An update to X inside a test was not wrapped in act(...)`
```
Warning: An update to useHabits inside a test was not wrapped in act(...)
```
→ Qualquer mutação de estado dentro de um teste deve ser envolvida em `act()`:
```typescript
// Errado
result.current.addHabit({ name: "Ler", frequency: "daily" })

// Correto
act(() => {
  result.current.addHabit({ name: "Ler", frequency: "daily" })
})
```

### `Cannot find module '@/hooks/useHabits'`
```
Error: Cannot find module '@/hooks/useHabits'
```
→ O alias `@` não está configurado no `vitest.config.ts`.
→ Adicionar o `alias` apontando para `./src`.

### Teste flaky (passa às vezes, falha outras)
→ Geralmente causado por dependência de ordem de execução ou estado compartilhado.
→ Verificar se o `beforeEach` limpa o mock do `localStorage`:
```typescript
beforeEach(() => {
  localStorageMock.clear()
  vi.clearAllMocks()
})
```

### `expect(element).toBeInTheDocument()` falha mesmo o elemento existindo
→ O `@testing-library/jest-dom` não foi importado no `setup.ts`.
→ Adicionar `import "@testing-library/jest-dom"` no arquivo de setup.

---

## Cobertura de Código

```bash
pnpm exec vitest run --coverage
```

### Thresholds recomendados (`vitest.config.ts`)
```typescript
coverage: {
  provider: "v8",
  reporter: ["text", "lcov"],
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 70,
  },
  include: ["src/hooks/**", "src/lib/**"],
  exclude: ["src/types/**", "src/app/**", "src/test/**"],
}
```

**Prioridades de cobertura:**
1. `src/hooks/` — cobertura máxima (são a camada de dados crítica)
2. `src/lib/` — funções puras, 100% alcançável
3. `src/components/` — cobertura de comportamento, não de renderização

---

## Checklist de Conclusão

```
## Resultado dos Testes

- Passando: N
- Falhando: N
- Ignorados (skip): N
- Cobertura: N% linhas / N% funções

Status: [PASSOU / FALHOU]
```

- **0 falhas** → PASSOU. Seguro para commit.
- **Qualquer falha** → FALHOU. Não commitar. Investigar root cause — nunca usar `.skip` para silenciar falhas reais.

### Sobre `it.skip` e `it.todo`
- `it.skip` é permitido **temporariamente** durante desenvolvimento de uma feature, com comentário de Issue.
- `it.todo` é permitido para documentar comportamentos planejados não implementados.
- Nunca commitar `it.skip` em testes que **antes passavam** — isso é regressão silenciosa.
