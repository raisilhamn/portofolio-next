# Current Font Settings (before switching landing page to Inter)

## Font Families

| Role | Font | CSS Variable | Fallback |
|---|---|---|---|
| Serif (body) | Source Serif 4 | `--font-serif` | Georgia, "Times New Roman", serif |
| Sans-serif (headings/UI) | Source Sans 3 | `--font-sans` | "Helvetica Neue", Arial, sans-serif |
| Monospace (code/dates/tags) | Source Code Pro | `--font-mono` | "Courier New", monospace |

## Where Defined

### globals.css - `@theme inline` block (lines 14–16)

```
--font-serif: "Source Serif 4", Georgia, "Times New Roman", serif;
--font-sans: "Source Sans 3", "Helvetica Neue", Arial, sans-serif;
--font-mono: "Source Code Pro", "Courier New", monospace;
```

### globals.css - body (line 74)

```
font-family: var(--font-serif);
```

### layout.tsx - Google Fonts link (lines 36–39)

```html
<link
  href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,400;0,600;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;1,400;1,600&display=swap"
  rel="stylesheet"
/>
```

## Font Usage Convention

- **Body / prose text** - `var(--font-serif)` (Source Serif 4), inherited from `body`
- **Headings, labels, UI text** - Tailwind class `font-sans` (Source Sans 3)
- **Code, dates, tags, metadata** - Tailwind class `font-mono` (Source Code Pro)
- **Blog prose headings (`h1`–`h4`)** - `font-family: var(--font-sans)` in `.prose` rules
- **Blog prose code** - `font-family: var(--font-mono)` in `.prose code` rules

## Loaded Weights

| Font | Weights |
|---|---|
| Source Serif 4 | 400, 600, 700 (roman); 400 (italic); optical size 8..60 |
| Source Sans 3 | 400, 500, 600 (roman); 400, 600 (italic) |
| Source Code Pro | 400, 600 (roman); 400 (italic) |

## Notes

- Fonts are loaded via traditional `<link>` tags (not `next/font`).
- Tailwind v4 font tokens are defined via `--font-*` CSS custom properties in the `@theme inline` block.
- Font size is user-adjustable via `FontSizeControl` component (0.8×–1.4×, persisted to localStorage).
