# habits.sh

> Rastreador de hábitos para desenvolvedores — com estética de terminal.

```
❯ habits.sh ~
[01] Ler 30min ........................ ✓ DONE   🔥 7
[02] Exercício ........................ · SKIP
[03] Estudar TypeScript ............... ✓ DONE   🔥 3
```

---

## Sobre o Projeto

**habits.sh** é um web app PWA de rastreamento de hábitos pensado para desenvolvedores que passam o dia no terminal e querem uma ferramenta com a mesma estética — sem distrações, sem gamificação excessiva, só o essencial.

O app roda inteiramente no browser. Não há backend, não há conta, não há servidor. Seus dados ficam no seu dispositivo.

---

## Funcionalidades

- Criar e gerenciar hábitos diários e semanais
- Marcar hábitos como concluídos no dia
- Acompanhar streaks de dias consecutivos
- Arquivar hábitos sem perder o histórico
- Funciona offline (PWA instalável)
- Interface com estética de terminal — fonte mono, paleta escura, sem arredondamentos

---

## Stack

| Camada        | Tecnologia                              |
|---------------|-----------------------------------------|
| Framework     | Next.js 16 (App Router)                 |
| UI            | React 19                                |
| Linguagem     | TypeScript 5 (Strict Mode)              |
| Estilo        | Tailwind CSS v4                         |
| Persistência  | `localStorage` (Local-First, sem backend) |
| Testes        | Vitest + React Testing Library          |
| Fonte         | JetBrains Mono                          |

---

## Arquitetura

O projeto segue uma arquitetura **Local-First, Browser-Only**:

- **Sem backend** — nenhuma API, nenhum servidor, nenhuma chamada de rede para dados do app
- **Custom Hooks como camada de dados** — `localStorage` é acessado exclusivamente via hooks em `src/hooks/`, nunca diretamente nos componentes
- **Tipagem estrita** — todo dado lido do storage passa por type guards antes de ser usado
- **Migrações versionadas** — o schema tem campo `version` para suportar evoluções sem quebrar dados existentes

```
src/
├── app/                  # Next.js App Router
├── components/
│   ├── ui/               # Primitivos (TerminalButton, TerminalInput, Badge)
│   └── features/         # Componentes de feature (HabitList, HabitCard...)
├── hooks/                # Camada de dados (useHabits, useHabitStats)
├── types/                # Interfaces TypeScript (Habit, HabitStore...)
└── lib/                  # Utilitários puros (storage, habit-utils)
```

---

## Rodando Localmente

**Pré-requisitos:** Node.js 20+ e pnpm

```bash
# Clonar o repositório
git clone https://github.com/notsogreatdavi/habits.sh.git
cd habits.sh

# Instalar dependências
pnpm install

# Iniciar em modo de desenvolvimento
pnpm dev
```

Acesse `http://localhost:3000`.

### Outros comandos

```bash
pnpm build        # build de produção
pnpm lint         # ESLint
pnpm lint:fix     # ESLint com auto-fix
pnpm test         # Vitest em modo watch
pnpm test run     # Vitest (CI — roda uma vez e sai)
```

---

## Contribuindo

1. Toda contribuição começa com uma [Issue](https://github.com/notsogreatdavi/habits.sh/issues) aberta
2. Branch no formato `tipo/issue-descricao` — ex: `feat/12-adiciona-streak`
3. Commits semânticos vinculados à issue — ex: `feat(#12): adiciona cálculo de streak`
4. PR com `Closes #N` na descrição

---

## Licença

[MIT](LICENSE)
