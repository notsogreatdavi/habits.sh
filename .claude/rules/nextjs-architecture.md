# Regras: Next.js App Router Architecture

## Árvore de Decisão — Server vs Client Component

```
O componente usa algum dos itens abaixo?
│
├── useState / useReducer / useContext        → "use client"
├── useEffect / useLayoutEffect               → "use client"
├── Custom Hook (useHabits, useSettings...)   → "use client"
├── localStorage / sessionStorage            → "use client"
├── Eventos do browser (onClick, onChange...) → "use client"
│
└── Nenhum dos acima?
    └── Pode ser Server Component (sem diretiva)
```

**Regra prática:** Em habits.sh, praticamente todos os componentes de feature serão `"use client"` — isso é esperado e correto, não um anti-pattern.

---

## Estrutura de Arquivos no App Router

```
src/app/
├── layout.tsx          # Root layout — Server Component (shell HTML, metadata)
├── page.tsx            # Home — pode ser Server Component se só renderizar Client filhos
├── globals.css         # Estilos globais
└── [feature]/
    ├── layout.tsx      # Layout da feature — Server Component
    └── page.tsx        # Page — delega rendering para Client Components
```

### Regras de layout e page
- `layout.tsx` e `page.tsx` na raiz são Server Components — não adicionar `"use client"` neles sem motivo forte.
- Pages **não** contêm lógica de negócio — elas importam e renderizam Client Components de feature.
- Metadata (`export const metadata`) só funciona em Server Components — nunca em arquivos com `"use client"`.

---

## Diretiva "use client"

- Declarar **no topo do arquivo**, antes de qualquer import.
- Aplicar no componente mais próximo da folha que precisa de estado — não subir `"use client"` desnecessariamente para layouts.
- Um arquivo com `"use client"` transforma **todo o seu subgraph** em client — seja deliberado.

**Correto:**
```tsx
// src/components/features/HabitList.tsx
"use client"

import { useHabits } from "@/hooks/useHabits"
```

**Errado:**
```tsx
// src/app/layout.tsx
"use client"  // ← nunca fazer isso no root layout
```

---

## Proibições Explícitas

- **Nunca** usar Server Actions (`"use server"`) para persistência de hábitos — isso viola ADR-001.
- **Nunca** criar API Routes (`src/app/api/`) para CRUD de dados do app — não há backend.
- **Nunca** usar `fetch` dentro de hooks ou componentes para buscar dados de hábitos.
- **Nunca** acessar `localStorage` fora de um Custom Hook (viola ADR-002).
- **Nunca** usar `useEffect` para hidratar estado a partir de props que deveriam vir do hook.

---

## Hidratação e SSR

Como os dados vêm do `localStorage` (client-only), existe risco de hydration mismatch.

### Padrão obrigatório para evitar mismatch:
```tsx
const [isClient, setIsClient] = useState(false)

useEffect(() => {
  setIsClient(true)
}, [])

if (!isClient) return <TerminalSkeleton /> // placeholder de terminal
```

Alternativamente, usar `dynamic` com `ssr: false` para componentes pesadamente dependentes de browser:
```tsx
const HabitDashboard = dynamic(() => import("@/components/features/HabitDashboard"), {
  ssr: false,
  loading: () => <TerminalSkeleton />,
})
```

---

## Organização de Componentes

```
src/components/
├── ui/           # Primitivos reutilizáveis (TerminalButton, TerminalInput, Badge)
│                 # Sem lógica de negócio, sem acesso a hooks de dados
└── features/     # Componentes de feature (HabitList, HabitCard, AddHabitForm)
                  # Consomem Custom Hooks, sempre "use client"
```

- Componentes `ui/` são agnósticos de domínio — recebem tudo via props.
- Componentes `features/` podem chamar hooks diretamente.
- Nunca importar um componente `features/` dentro de um componente `ui/`.
