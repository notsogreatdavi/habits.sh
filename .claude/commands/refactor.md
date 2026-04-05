Você é um engenheiro sênior especialista em Clean Code e SOLID para o projeto habits.sh. Sua tarefa é refatorar: $ARGUMENTS

Se nenhum arquivo for especificado, peça ao usuário para indicar o alvo.

## Regra de Ouro da Refatoração

> Refatoração não altera comportamento externo — apenas melhora a estrutura interna.
> Antes de qualquer mudança, confirme com o usuário quais problemas foram identificados e apresente o plano.
> **Nunca refatorar silenciosamente.**

---

## Fase 1 — Diagnóstico

Leia o arquivo e identifique violações nas seguintes categorias:

### A) Responsabilidade Única (SRP)
- O hook/componente/função faz mais de uma coisa?
- Existe lógica de negócio misturada com lógica de apresentação?
- O arquivo tem mais de ~150 linhas? (sinal de acúmulo de responsabilidades)

### B) Isolamento de Camadas (ADR-001 e ADR-002)
- Componente acessa `localStorage` diretamente? → mover para hook
- Hook contém lógica de formatação/display? → mover para componente ou `lib/`
- Função em `lib/` tem side effects (escreve no storage, chama hooks)? → extrair ou mover

### C) Tipagem TypeScript
- Existe `any`, cast sem guard, ou tipo implícito `{}` ou `object`?
- Interface de entidade está fora de `src/types/`?
- Existe tipo duplicado definido em múltiplos arquivos?

### D) Complexidade Desnecessária
- Existe lógica condicional que poderia ser uma função nomeada?
- Existe `useEffect` com múltiplas responsabilidades?
- Existe estado derivado calculado com `useState` quando poderia ser `useMemo`?

---

## Fase 2 — Plano de Refatoração

Apresente ao usuário o plano **antes de executar**:

```
## Plano de Refatoração — [nome do arquivo]

### Problemas identificados
1. [descrição do problema + princípio violado]
2. ...

### Mudanças propostas
1. [ação concreta: "extrair função X para src/lib/Y.ts"]
2. [ação concreta: "dividir useHabits em useHabits + useHabitStats"]
3. ...

### O que NÃO será alterado
- [comportamento externo preservado]
- [interface pública do hook/componente mantida]

Posso prosseguir com estas mudanças?
```

---

## Fase 3 — Execução (somente após aprovação)

### Padrões de Extração

**Hook com múltiplas responsabilidades → dividir:**
```typescript
// Antes: useHabits gerencia hábitos E calcula estatísticas
// Depois:
// src/hooks/useHabits.ts     → CRUD de hábitos
// src/hooks/useHabitStats.ts → cálculo de streaks e métricas
```

**Lógica pura dentro de hook → extrair para lib/:**
```typescript
// Antes: lógica de formatação dentro do hook
const formatted = habits.map(h => ({
  ...h,
  displayDate: new Date(h.createdAt).toLocaleDateString("pt-BR")
}))

// Depois: função pura em src/lib/habit-utils.ts
export function formatHabitDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("pt-BR")
}
```

**useEffect com múltiplas responsabilidades → separar:**
```typescript
// Antes: um useEffect faz hidratação + subscription + cleanup
useEffect(() => { /* 3 coisas */ }, [])

// Depois: três useEffects com responsabilidade única cada
useEffect(() => { /* hidratação */ }, [])
useEffect(() => { /* subscription */ }, [dep])
useEffect(() => { /* cleanup */ }, [])
```

**Estado derivado com useState → usar useMemo:**
```typescript
// Antes:
const [activeHabits, setActiveHabits] = useState(habits.filter(h => !h.archived))
useEffect(() => setActiveHabits(habits.filter(h => !h.archived)), [habits])

// Depois:
const activeHabits = useMemo(() => habits.filter(h => !h.archived), [habits])
```

---

## Fase 4 — Validação Pós-Refatoração

Após as mudanças, execute automaticamente o `/review` no arquivo refatorado para confirmar que nenhuma regra foi violada.

Reporte ao usuário:
```
## Resultado da Refatoração

### Mudanças aplicadas
- [lista do que foi feito]

### Validação /review
- [resultado da checklist de review]

### Próximos passos sugeridos
- [ ] Rodar testes existentes para confirmar que o comportamento não mudou
- [ ] Atualizar testes se a interface pública do hook/componente mudou
- [ ] Commitar com: refactor(#ISSUE): [descrição]
```
