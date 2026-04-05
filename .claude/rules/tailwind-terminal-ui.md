# Regras: Tailwind CSS & Terminal UI

## Paleta de Cores Oficial

| Token semântico     | Classe Tailwind         | Uso                                      |
|---------------------|-------------------------|------------------------------------------|
| `bg-surface`        | `bg-zinc-950`           | Fundo principal — preto de terminal      |
| `bg-surface-raised` | `bg-zinc-900`           | Cards, painéis, modais                   |
| `bg-surface-border` | `border-zinc-700`       | Bordas de containers                     |
| `text-primary`      | `text-green-400`        | Texto principal, prompts, sucesso        |
| `text-secondary`    | `text-zinc-400`         | Labels, texto auxiliar, placeholders     |
| `text-accent`       | `text-amber-400`        | Destaques, warnings, streak counter      |
| `text-danger`       | `text-red-400`          | Erros, hábitos não cumpridos             |
| `text-muted`        | `text-zinc-600`         | Texto desativado, archived               |
| `cursor-color`      | `text-green-400`        | Cursor piscante do terminal              |

### Regra de contraste
- Nunca usar texto claro (`text-white`) sem justificativa — preferir `text-zinc-100` no máximo.
- Nunca usar `bg-white` ou fundos claros — o app é **sempre dark mode**.
- Nunca adicionar `dark:` variants — o app não tem modo claro.

---

## Tipografia

```
font-mono   → obrigatório em TODO o app (configurar como default no tailwind.config.ts)
text-sm     → tamanho padrão de texto (0.875rem)
text-xs     → labels, timestamps, metadados
text-base   → títulos de seção
text-lg+    → usar com moderação — terminais são densos
```

### Configuração no `tailwind.config.ts`
```typescript
theme: {
  extend: {
    fontFamily: {
      mono: ["JetBrains Mono", "Fira Code", "Cascadia Code", "monospace"],
    },
  },
}
```

- Todo texto no app usa `font-mono` — não é necessário declarar explicitamente se configurado como padrão.
- Nunca usar `font-sans` ou `font-serif`.

---

## Bordas e Formas

- `rounded-none` é o padrão — terminais são quadrados.
- Máximo permitido: `rounded-sm` (2px) em elementos interativos para suavidade mínima.
- **Proibido:** `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full` (exceto em badges de status circulares).
- Bordas são `border border-zinc-700` — sem `shadow-*` decorativos.
- Separadores usam `border-t border-zinc-800` — sem `<hr>` sem classe.

---

## Componentes de Terminal — Padrões

### Prompt (linha de input)
```tsx
// Aparência: "> _" — cursor piscante
<div className="flex items-center gap-2 text-green-400 font-mono">
  <span className="select-none">❯</span>
  <input className="bg-transparent outline-none text-green-400 caret-green-400 w-full" />
</div>
```

### Card de Hábito
```tsx
<div className="border border-zinc-700 bg-zinc-900 p-3 font-mono">
  <span className="text-zinc-400 text-xs">[{index}]</span>
  <span className="text-green-400 ml-2">{habit.name}</span>
</div>
```

### Badge de Status
```tsx
// Completo
<span className="text-xs text-green-400 border border-green-400 px-1">DONE</span>
// Pendente  
<span className="text-xs text-zinc-500 border border-zinc-700 px-1">SKIP</span>
// Streak
<span className="text-xs text-amber-400 border border-amber-400 px-1">🔥 {streak}</span>
```

### Mensagens de Sistema
```tsx
// Info
<p className="text-zinc-400 text-xs font-mono">// nenhum hábito encontrado</p>
// Erro
<p className="text-red-400 text-xs font-mono">ERROR: falha ao salvar hábito</p>
// Sucesso
<p className="text-green-400 text-xs font-mono">✓ hábito registrado com sucesso</p>
```

---

## Animações e Interatividade

- Animações são **mínimas** — terminais não têm transições fluidas.
- Permitido: `transition-colors duration-150` em hover states.
- **Proibido:** `animate-bounce`, `animate-spin` (exceto loading spinner de terminal), `scale-*` em hover.
- Cursor piscante: usar `animate-pulse` em `|` ou `▋` como indicador de foco.
- Loading state: usar texto animado `"loading..."` ou `"···"` — sem spinners circulares.

---

## Proibições de Estilo

| Proibido                    | Motivo                                      |
|-----------------------------|---------------------------------------------|
| `bg-white` / `bg-gray-50`   | App é dark-only                             |
| `rounded-lg` ou maior       | Quebra a estética de terminal               |
| `shadow-xl` ou decorativos  | Terminais não têm profundidade visual       |
| `font-sans` / `font-serif`  | Monospace obrigatório                       |
| Gradientes (`bg-gradient-*`)| Fora da paleta de terminal                  |
| Emojis decorativos em excesso| Usar apenas 🔥 para streak e ✓ para check  |

---

## Organização de Classes Tailwind

Ordem obrigatória (seguir Prettier Tailwind plugin):
```
layout → display → position → sizing → spacing → typography → colors → borders → effects → interactivity
```

Exemplo:
```tsx
className="flex items-center gap-2 w-full px-3 py-2 text-sm text-green-400 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors duration-150"
```
