# Skill: TypeScript — Verificação de Tipos

## Propósito

Executar o compilador TypeScript em modo `--noEmit` para detectar erros de tipo **sem gerar arquivos**. Esta verificação é complementar ao ESLint e detecta classes de erro que o linter não cobre (tipos incompatíveis, propriedades inexistentes, retornos incorretos).

---

## Pré-condições

```bash
# Verificar se tsconfig.json existe e tem strict mode
cat tsconfig.json | grep '"strict"'
```

O `tsconfig.json` deve ter obrigatoriamente:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true
  }
}
```

Se `"strict": false` ou ausente → **interrompa e sinalize ao usuário**. Strict mode é inegociável (ADR de TypeScript).

---

## Execução

### Verificação completa do projeto
```bash
pnpm exec tsc --noEmit
# ou
npx tsc --noEmit
```

### Verificação com output detalhado (para debugging)
```bash
pnpm exec tsc --noEmit --pretty
```

### Verificação em modo watch (durante desenvolvimento)
```bash
pnpm exec tsc --noEmit --watch
```

---

## Interpretação de Erros

### Formato do output do TSC
```
src/hooks/useHabits.ts(23,7): error TS2322: Type 'string | null' is not assignable to type 'string'.
```
Leitura: `arquivo(linha,coluna): código — mensagem`

---

### Erros Comuns e Como Resolver

#### TS2322 — Type mismatch
```
error TS2322: Type 'string | null' is not assignable to type 'string'.
```
→ `localStorage.getItem()` retorna `string | null`. Nunca assumir que é `string`.
```typescript
// Errado
const raw: string = localStorage.getItem(KEY)

// Correto
const raw = localStorage.getItem(KEY)  // string | null
if (!raw) return defaultValue
```

#### TS2339 — Property does not exist
```
error TS2339: Property 'completedAt' does not exist on type 'Habit'.
```
→ A interface `Habit` em `src/types/habit.ts` não tem essa propriedade. Adicionar na interface ou corrigir o acesso.

#### TS7006 — Parameter implicitly has 'any' type
```
error TS7006: Parameter 'e' implicitly has an 'any' type.
```
→ Tipar o parâmetro explicitamente:
```typescript
// Errado
.map(e => e.name)

// Correto
.map((e: Habit) => e.name)
// ou deixar TypeScript inferir de um array tipado
```

#### TS2345 — Argument type mismatch
```
error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
```
→ Resultado de `noUncheckedIndexedAccess`. Ao acessar array por índice, o resultado é `T | undefined`.
```typescript
// Errado
const first = habits[0]
doSomething(first) // TS erro: first pode ser undefined

// Correto
const first = habits[0]
if (first) doSomething(first)
// ou
habits.at(0) // ainda retorna T | undefined, mas é intencional
```

#### TS2454 — Variable used before assignment
```
error TS2454: Variable 'result' is used before being assigned.
```
→ Reestruturar o fluxo ou inicializar com valor padrão.

#### TS18048 — Value possibly undefined (exactOptionalPropertyTypes)
```
error TS18048: 'habit.archivedAt' is possibly 'undefined'.
```
→ Verificar antes de usar:
```typescript
if (habit.archivedAt !== undefined) {
  // aqui TypeScript sabe que é string
}
```

---

## Erros que NÃO devem ser suprimidos

Nunca usar para suprimir erros de tipo:
- `// @ts-ignore` (proibido — ver `.claude/rules/typescript-data-model.md`)
- Cast direto sem type guard: `value as Habit`
- Adicionar `!` non-null assertion sem garantia: `value!`

**Único caso aceito para `@ts-expect-error`:**
```typescript
// @ts-expect-error -- biblioteca X não tem tipos corretos, issue: #NÚMERO
externalLibCall(param)
```

---

## Checklist de Conclusão

```
## Resultado do TypeCheck

- Erros: N
- Arquivos verificados: N

Status: [PASSOU / FALHOU]
```

- **0 erros** → PASSOU. Seguro para commit.
- **Qualquer erro** → FALHOU. Não commitar. Corrigir todos os erros antes.

TypeScript não tem "warnings" — qualquer output é erro e bloqueia.
