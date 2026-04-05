# Regras: Git & GitHub Workflow

## Commits Semânticos

### Formato obrigatório
```
tipo(#issue): descrição curta em minúsculas e modo imperativo
```

**Exemplos válidos:**
```
feat(#12): adiciona estado inicial no localStorage
fix(#18): corrige leitura de hábitos com array vazio
refactor(#21): extrai lógica de serialização para lib/storage
test(#15): adiciona testes BDD para useHabits
chore(#3): configura ESLint e Prettier
docs(#1): documenta ADRs no CLAUDE.md
```

### Tipos permitidos
| Tipo       | Quando usar                                              |
|------------|----------------------------------------------------------|
| `feat`     | Nova funcionalidade visível ao usuário                   |
| `fix`      | Correção de bug                                          |
| `refactor` | Mudança interna sem alterar comportamento                |
| `test`     | Criação ou ajuste de testes                              |
| `chore`    | Configuração, dependências, scripts de build             |
| `docs`     | Documentação (CLAUDE.md, READMEs, comentários de ADR)   |
| `style`    | Apenas formatação — sem mudança de lógica               |
| `perf`     | Otimização de performance mensurável                     |

### Regras inegociáveis
- Todo commit **deve** referenciar uma Issue (`#número`).
- Sem commits com mensagem genérica: `fix bug`, `updates`, `wip` são proibidos.
- A descrição é em **português**, modo imperativo, sem ponto final.
- Commits atômicos: um commit = uma mudança coesa. Nunca misturar feat + fix no mesmo commit.

---

## Branches

### Formato obrigatório
```
tipo/issue-descricao-curta-com-hifens
```

**Exemplos válidos:**
```
feat/12-estado-inicial-localstorage
fix/18-leitura-habitos-array-vazio
refactor/21-serialização-storage
test/15-testes-bdd-use-habits
```

### Regras
- Sempre criada a partir de `main` atualizada: `git checkout -b feat/12-... origin/main`
- Nunca commitar diretamente em `main`.
- Nome da branch em **minúsculas**, sem espaços ou underscores — apenas hifens.
- Deletar a branch local e remota após o merge do PR.

---

## Pull Requests

- Título segue o mesmo formato do commit: `feat(#12): adiciona estado inicial no localStorage`
- O PR **deve** estar vinculado à Issue (usar `Closes #12` na descrição).
- Nenhum PR é mergeado sem pelo menos uma revisão (mesmo que seja auto-review documentado).
- PRs de `refactor` e `test` não alteram comportamento — se alterarem, mudar o tipo para `feat` ou `fix`.
- Squash merge é preferido para manter o histórico linear.

---

## Issues

- Todo trabalho começa com uma Issue aberta — sem Issue, sem branch, sem commit.
- Labels mínimos: `tipo` (feat/bug/chore) + `status` (backlog/in-progress/review/done).
- A Issue é fechada automaticamente pelo PR via `Closes #N` — nunca fechar manualmente sem PR.
