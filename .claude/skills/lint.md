# Skill: ESLint — Análise Estática

## Propósito

Executar o ESLint para detectar violações de estilo, padrões de React Hooks e erros de Next.js **antes** de qualquer commit ou PR. Esta skill é um portão de qualidade obrigatório.

---

## Pré-condições

Verifique se o projeto tem ESLint configurado antes de executar:

```bash
# Verificar se existe configuração ESLint
ls .eslintrc* eslint.config* 2>/dev/null || echo "ESLint não configurado"

# Verificar se o script está no package.json
cat package.json | grep '"lint"'
```

Se não existir configuração, **interrompa e informe o usuário** — não execute `eslint .` sem config.

---

## Configuração Esperada do Projeto

O `package.json` deve ter o script:
```json
{
  "scripts": {
    "lint": "next lint",
    "lint:fix": "next lint --fix"
  }
}
```

O arquivo `.eslintrc.json` (ou `eslint.config.mjs`) deve incluir:
```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": "warn"
  }
}
```

Se estas regras estiverem ausentes, **sinalize ao usuário** antes de continuar.

---

## Execução

### Lint completo (modo CI — sem auto-fix)
```bash
pnpm lint
# ou
npm run lint
```

### Lint com auto-fix (apenas para erros de formatação/style)
```bash
pnpm lint:fix
```

### Lint em arquivo específico
```bash
pnpm exec next lint -- --file src/hooks/useHabits.ts
```

---

## Interpretação de Output

### Erro (bloqueia commit)
```
./src/hooks/useHabits.ts
  12:5  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
```
→ **Ação obrigatória:** Corrigir antes de prosseguir. Referência: `.claude/rules/typescript-data-model.md`.

### Warning (não bloqueia, mas deve ser resolvido)
```
./src/hooks/useHabits.ts
  34:6  Warning: React Hook useEffect has a missing dependency: 'loadStore'.  react-hooks/exhaustive-deps
```
→ **Ação recomendada:** Adicionar a dependência ou usar `useCallback`. Não ignorar com `// eslint-disable`.

### Erro de `no-restricted-globals` ou acesso direto ao browser
```
./src/components/features/HabitList.tsx
  8:3  Error: Unexpected use of 'localStorage'.  no-restricted-globals
```
→ **Ação obrigatória:** Mover acesso para hook em `src/hooks/`. Viola ADR-002.

---

## Regras sobre `eslint-disable`

- `// eslint-disable-next-line` é **proibido** sem comentário explicando o motivo e a Issue relacionada.
- `// eslint-disable` (arquivo inteiro) é **sempre proibido**.
- A única exceção aceita: arquivos gerados automaticamente (ex: `src/generated/`).

**Formato obrigatório quando necessário:**
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- JSON.parse retorna any por design, validado pelo type guard abaixo
const parsed: unknown = JSON.parse(raw) as unknown
```

---

## Checklist de Conclusão

Após executar o lint, reporte:

```
## Resultado do Lint

- Erros: N (bloqueantes)
- Warnings: N
- Arquivos analisados: N

Status: [PASSOU / FALHOU]
```

Se **FALHOU**: não prosseguir com commit. Corrigir todos os erros antes.
Se **PASSOU com warnings**: registrar os warnings e criar Issue para resolução se não forem triviais.
