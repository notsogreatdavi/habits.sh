# habits.sh — Cérebro do Projeto (CLAUDE.md)

## Visão Geral

**habits.sh** é um rastreador de hábitos para desenvolvedores com estética de terminal.
É um Web App PWA **sem backend** — toda a lógica roda no browser, com persistência exclusiva via `localStorage`.

- **Stack:** Next.js (App Router), React, TypeScript (Strict Mode), Tailwind CSS
- **Paradigma:** Local-First, Browser-Only, PWA
- **Estética:** Terminal — fontes monoespaçadas, paleta de cores escuras (verde/âmbar sobre fundo escuro)

---

## Regra de Ouro — Consulta Obrigatória

> Antes de qualquer geração de código, análise ou decisão arquitetural, você **deve** ler os arquivos em `.claude/rules/`.
> Eles contêm as convenções inegociáveis deste projeto. Não há exceções.

```
.claude/rules/
├── git-github-workflow.md      # Commits semânticos, branches, Issues
├── nextjs-architecture.md      # App Router, Server/Client Components
├── typescript-data-model.md    # Tipagem do JSON local, modelagem de dados
└── tailwind-terminal-ui.md     # Padrões de UI com estética de terminal
```

---

## Pilares Arquiteturais

### ADR-001 — Local-First (Browser-Only)

**Decisão:** Não existe backend, API route de CRUD, nem Server Action para dados.
**Motivação:** MVP com complexidade zero de infraestrutura; dados do usuário permanecem locais.
**Consequências:**
- `localStorage` é a única fonte da verdade.
- Toda leitura/escrita de dados acontece **exclusivamente dentro de Custom Hooks**.
- Pages e Components são consumidores passivos — nunca acessam `localStorage` diretamente.
- Nenhum `fetch`, `axios` ou chamada de rede para persistência de hábitos.

### ADR-002 — Custom Hooks como Camada de Dados

**Decisão:** A camada de persistência é abstraída por Custom Hooks (ex: `useHabits`, `useSettings`).
**Motivação:** Isolamento total entre UI e lógica de dados — equivalente ao Repository Pattern.
**Consequências:**
- Hooks vivem em `src/hooks/` e são a **única** interface com `localStorage`.
- Nenhum componente importa ou referencia `localStorage` diretamente.
- Hooks expõem estado tipado e funções de mutação — nunca strings cruas.
- Facilita testes unitários: mockar o hook isola completamente a UI.

### ADR-003 — Next.js App Router com Client Components

**Decisão:** Como os dados são exclusivamente client-side, a maioria dos componentes de feature será `"use client"`.
**Motivação:** `localStorage` e hooks de estado (`useState`, `useEffect`) não existem em Server Components.
**Consequências:**
- Layouts e páginas shell podem ser Server Components.
- Componentes que consomem hooks de dados **devem** declarar `"use client"`.
- Nunca usar Server Actions para persistência — isso violaria o ADR-001.
- Preferir composição: Server Component → Client Component boundary explícita.

---

## Filosofia de Desenvolvimento

| Princípio       | Aplicação prática                                                          |
|-----------------|---------------------------------------------------------------------------|
| **XP**          | Pair programming com IA, refactor contínuo, testes antes do código        |
| **Clean Code**  | Funções pequenas, nomes expressivos, sem comentários óbvios               |
| **SOLID**       | Hooks com responsabilidade única, componentes abertos para composição     |
| **BDD**         | Testes descritos em linguagem de comportamento (`given/when/then`)        |

---

## Rastreabilidade

- **Issues:** Todo trabalho tem uma Issue no GitHub como origem.
- **Commits:** Formato `tipo(#issue): descrição` — ex: `feat(#12): adiciona estado inicial no localStorage`
- **Branches:** Formato `tipo/issue-descricao` — ex: `feat/12-estado-inicial-localstorage`
- Detalhes completos em `.claude/rules/git-github-workflow.md`

---

## Estrutura de Diretórios Esperada

```
src/
├── app/                  # Next.js App Router (layouts, pages)
├── components/           # Componentes React puros (sem acesso a localStorage)
│   ├── ui/               # Primitivos de UI (Button, Input, etc.)
│   └── features/         # Componentes de feature (HabitList, HabitCard, etc.)
├── hooks/                # Custom Hooks — única camada de acesso ao localStorage
├── types/                # Tipos e interfaces TypeScript globais
└── lib/                  # Utilitários puros (sem side effects, sem estado)
```

---

## Comandos Disponíveis (`.claude/commands/`)

| Comando      | Propósito                                              |
|--------------|--------------------------------------------------------|
| `/review`    | Análise estática: hooks isolados, tipagem, padrões     |
| `/bdd`       | Geração de testes em formato BDD (given/when/then)     |
| `/refactor`  | Refatoração guiada por Clean Code e SOLID              |

---

*Este arquivo é o ponto de entrada. Para regras detalhadas, consulte `.claude/rules/`.*
