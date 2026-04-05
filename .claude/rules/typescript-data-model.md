# Regras: TypeScript & Modelagem de Dados

## Configuração Obrigatória (tsconfig.json)

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

Estas flags são inegociáveis — nunca desabilitar para "fazer compilar mais rápido".

---

## Modelagem de Entidades

Toda entidade persistida no `localStorage` deve ter uma interface explícita em `src/types/`.

### Convenções
- Interfaces para entidades de domínio (têm identidade): `interface Habit { ... }`
- Types para shapes de dados derivados ou union types: `type HabitStatus = "active" | "archived"`
- Nunca usar `class` para modelagem de dados — apenas interfaces/types.
- Prefixo `I` em interfaces é **proibido** (`IHabit` → use `Habit`).

### Exemplo de modelagem correta
```typescript
// src/types/habit.ts

export type HabitId = string  // branded type opcional: `& { readonly _brand: "HabitId" }`

export type HabitFrequency = "daily" | "weekly"

export interface Habit {
  readonly id: HabitId
  name: string
  frequency: HabitFrequency
  createdAt: string        // ISO 8601 — datas sempre como string no storage
  completedDates: string[] // ISO 8601 array
  archived: boolean
}

export interface HabitStore {
  readonly version: number  // para migrações futuras
  habits: Habit[]
}
```

---

## Leitura Segura do localStorage

O `localStorage` sempre retorna `string | null` — nunca assumir que o dado é válido.

### Padrão obrigatório de leitura
```typescript
// src/lib/storage.ts

import type { HabitStore } from "@/types/habit"

const STORAGE_KEY = "habits.sh:store"
const CURRENT_VERSION = 1

function isHabitStore(value: unknown): value is HabitStore {
  return (
    typeof value === "object" &&
    value !== null &&
    "version" in value &&
    "habits" in value &&
    Array.isArray((value as HabitStore).habits)
  )
}

export function readStore(): HabitStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { version: CURRENT_VERSION, habits: [] }

    const parsed: unknown = JSON.parse(raw)
    if (!isHabitStore(parsed)) return { version: CURRENT_VERSION, habits: [] }

    return parsed
  } catch {
    return { version: CURRENT_VERSION, habits: [] }
  }
}

export function writeStore(store: HabitStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}
```

### Regras
- Toda leitura de `localStorage` passa por um **type guard** — nunca usar `as HabitStore` diretamente.
- Erros de parse são silenciados com fallback para estado vazio — nunca deixar o app quebrar por dado corrompido.
- `JSON.parse` retorna `any` — sempre tipar a variável como `unknown` e validar antes de usar.

---

## Proibições de Tipagem

| Proibido                        | Alternativa correta                          |
|---------------------------------|----------------------------------------------|
| `any`                           | `unknown` + type guard                       |
| `as TipoQualquer` sem validação | Type guard explícito                         |
| `// @ts-ignore`                 | Corrigir o tipo ou usar `// @ts-expect-error` com comentário |
| `object` como tipo              | Interface explícita                          |
| `Function` como tipo            | Assinatura explícita `() => void`            |
| `{}` como tipo genérico         | `Record<string, unknown>` ou interface       |

---

## Geração de IDs

```typescript
// src/lib/id.ts
export function generateId(): string {
  return crypto.randomUUID()
}
```

- Nunca usar `Math.random()` para gerar IDs.
- Nunca usar timestamps como ID primário (colisão possível).
- `crypto.randomUUID()` está disponível em todos os browsers modernos e no Node 19+.

---

## Datas

- Datas são sempre armazenadas como strings ISO 8601: `new Date().toISOString()`
- Nunca serializar objetos `Date` diretamente no JSON — eles não deserializam como `Date`.
- Conversão para `Date` ocorre apenas na camada de apresentação, quando necessário.
- Comparações de data usam string comparison (ISO 8601 é lexicograficamente ordenável).

---

## Migrações de Schema

O campo `version` em `HabitStore` existe para suportar migrações futuras.

```typescript
// src/lib/storage.ts
function migrate(store: HabitStore): HabitStore {
  if (store.version === 1) return store
  // futuras migrações aqui
  return store
}
```

Toda função de leitura passa pelo `migrate()` antes de retornar — garantia de compatibilidade futura.
