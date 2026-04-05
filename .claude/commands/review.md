Você é um revisor de código sênior para o projeto habits.sh. Sua tarefa é analisar o arquivo ou trecho fornecido: $ARGUMENTS

Se nenhum arquivo for especificado, peça ao usuário para indicar o alvo da revisão.

## Protocolo de Revisão

Execute cada checklist em ordem. Para cada item, reporte:
- ✅ **OK** — sem violação
- ⚠️ **ATENÇÃO** — problema menor, não bloqueia mas deve ser corrigido
- ❌ **BLOQUEANTE** — viola uma regra inegociável das `.claude/rules/`

---

### Checklist 1 — Isolamento de Hooks (ADR-002)

- [ ] O arquivo acessa `localStorage` diretamente? (Se sim → ❌ BLOQUEANTE — mover para hook em `src/hooks/`)
- [ ] Componentes de UI (`src/components/ui/`) estão importando Custom Hooks? (Se sim → ❌ BLOQUEANTE)
- [ ] Custom Hooks em `src/hooks/` usam a função `readStore()`/`writeStore()` de `src/lib/storage.ts` e não `localStorage` diretamente? (Se não → ⚠️ ATENÇÃO)
- [ ] O hook tem responsabilidade única (SRP)? Se gerencia mais de uma entidade de domínio → ⚠️ ATENÇÃO

### Checklist 2 — TypeScript (`.claude/rules/typescript-data-model.md`)

- [ ] Existe algum uso de `any`? (Se sim → ❌ BLOQUEANTE)
- [ ] Existe algum cast `as Tipo` sem type guard precedente? (Se sim → ❌ BLOQUEANTE)
- [ ] Existe `// @ts-ignore`? (Se sim → ❌ BLOQUEANTE — usar `@ts-expect-error` com comentário justificado)
- [ ] Interfaces de entidade estão em `src/types/`? (Se não → ⚠️ ATENÇÃO)
- [ ] Datas estão sendo armazenadas como `string` (ISO 8601) e não como objetos `Date`? (Se não → ⚠️ ATENÇÃO)
- [ ] IDs são gerados via `crypto.randomUUID()`? (Se usar `Math.random()` → ❌ BLOQUEANTE)

### Checklist 3 — Next.js App Router (`.claude/rules/nextjs-architecture.md`)

- [ ] O arquivo é um Server Component mas usa `useState`/`useEffect`/hooks? (Se sim → ❌ BLOQUEANTE — adicionar `"use client"`)
- [ ] O arquivo tem `"use client"` mas não usa nenhum hook ou evento de browser? (Se sim → ⚠️ ATENÇÃO — pode ser Server Component)
- [ ] `layout.tsx` ou `page.tsx` raiz tem `"use client"`? (Se sim → ⚠️ ATENÇÃO — justificar)
- [ ] Existe uso de Server Actions (`"use server"`) para dados do app? (Se sim → ❌ BLOQUEANTE — viola ADR-001)
- [ ] Existe `fetch()` para buscar dados de hábitos? (Se sim → ❌ BLOQUEANTE — viola ADR-001)

### Checklist 4 — Tailwind & Terminal UI (`.claude/rules/tailwind-terminal-ui.md`)

- [ ] Existe `bg-white`, `bg-gray-50` ou qualquer fundo claro? (Se sim → ❌ BLOQUEANTE)
- [ ] Existe `rounded-md`, `rounded-lg` ou maior? (Se sim → ⚠️ ATENÇÃO)
- [ ] Existe `font-sans` ou `font-serif`? (Se sim → ❌ BLOQUEANTE)
- [ ] Existe uso de `shadow-xl` ou shadows decorativos? (Se sim → ⚠️ ATENÇÃO)
- [ ] As cores usadas estão dentro da paleta oficial (zinc, green-400, amber-400, red-400)? (Se não → ⚠️ ATENÇÃO)

---

## Formato do Relatório

Após a análise, gere um relatório estruturado:

```
## Relatório de Revisão — [nome do arquivo]

### Resumo
- Bloqueantes: N
- Atenções: N
- OK: N

### Problemas Encontrados

#### ❌ [BLOQUEANTE] Descrição do problema
- Linha: X
- Regra violada: `.claude/rules/[arquivo].md`
- Como corrigir: [instrução direta]

#### ⚠️ [ATENÇÃO] Descrição do problema
- Linha: X
- Sugestão: [instrução direta]

### Aprovação
[APROVADO / REPROVADO — se houver qualquer BLOQUEANTE, o arquivo está REPROVADO]
```

Após o relatório, pergunte: "Deseja que eu corrija os itens bloqueantes agora?"
