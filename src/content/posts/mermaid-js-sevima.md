---
title: "Diagram as Code — Getting Started with Mermaid JS"
date: "2026-05-28"
excerpt: "Mermaid JS lets you create diagrams with plain text. Here is how it works, what you can build, and why diagram-as-code beats drag-and-drop tools."
tags: ["tools", "visualization", "tutorial"]
---

## What Is Mermaid JS?

Mermaid JS is a JavaScript library that renders diagrams from Markdown-like text definitions. Instead of dragging boxes and arrows in a GUI tool, you write:

```
flowchart LR
    A --> B
```

And Mermaid turns it into an SVG diagram. The diagram lives alongside your code, under version control, reviewable in pull requests.

---

## The Syntax

### Flowcharts

Flowcharts connect nodes with edges. Nodes can be rectangles, rounded boxes, diamonds (decisions), or circles (start/end):

```mermaid
flowchart TD
    Anyone([Anyone]) --> ShortURL["Access /s/{slug}"]
    ShortURL --> Lookup["Query links table<br/>by slug"]
    
    Lookup -->|"Not found"| CheckAlias["Query slug_aliases<br/>by oldSlug"]
    CheckAlias -->|"Found alias"| ResolveAlias["Resolve to new link"]
    CheckAlias -->|"Not found"| NotFound["404 Not Found"]
    ResolveAlias --> Lookup2["Lookup new link"]
    
    Lookup -->|"Found"| StatusCheck{Check Status}
    Lookup2 --> StatusCheck
    
    StatusCheck -->|"expired"| ExpiredPage["Expired Page<br/>Public link > 7 days"]
    StatusCheck -->|"suspended"| SuspendedPage["Suspended Page<br/>Under review"]
    StatusCheck -->|"disabled"| DisabledPage["Disabled Page<br/>By admin"]
    StatusCheck -->|"active"| ValidCheck{Valid destination?}
    
    ValidCheck -->|"Invalid protocol"| InvalidPage["Invalid Link Page"]
    ValidCheck -->|"Valid URL"| Collect["Collect Analytics:<br/>- country (IP lookup)<br/>- referrer domain<br/>- user agent family<br/>- ipHash (SHA-256 + daily salt)"]
    
    Collect --> SaveClick["Insert to clicks table"]
    SaveClick --> Turso[(Turso / SQLite)]
    
    SaveClick --> TypeCheck{Link Type?}
    TypeCheck -->|"account"| DirectRedirect["301 Redirect<br/>to destination"]
    TypeCheck -->|"public"| Disclaimer["Disclaimer Page<br/>+ destination preview"]
    
    Disclaimer -->|"Auto-redirect after 5s"| AutoRedirect["Redirect to destination"]
    Disclaimer -->|"Report this link"| ReportFlow["Go to /report"]
```

Notice the syntax: `Node -->|"edge label"| OtherNode`. The direction is set by `TD` (top-down), `LR` (left-right), or `BT` (bottom-top). Use `[]` for rectangles, `{}` for diamonds, `()` for rounded nodes, and `([...])` for stadium-shaped nodes.

### Sequence Diagrams

Great for API call flows between services:

```
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
```

### Class Diagrams

Model domain objects and their relationships:

```
classDiagram
    class Animal {
        +String name
        +move()
    }
    class Dog {
        +bark()
    }
    Animal <|-- Dog
```

### Entity-Relationship Diagrams

Visualize database schemas:

```
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
```

### State Diagrams

Track state transitions:

```
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : submit
    Processing --> Completed : done
    Processing --> Idle : reset
```

### Gantt Charts

Sprint timelines and project planning:

```
gantt
    title Sprint 1
    dateFormat  YYYY-MM-DD
    section Backend
    Auth API        :done, a1, 2026-03-01, 3d
    Payment module  :active, a2, 2026-03-04, 5d
```

---

## How to Use Mermaid

Three common approaches:

1. **In-browser rendering** — include the Mermaid CDN script. Any `<pre class="mermaid">` block on the page is automatically rendered.
2. **Markdown integration** — platforms like GitHub, GitLab, and Notion render ` ```mermaid ` blocks natively. Just paste the code and the diagram appears.
3. **CLI tool** — `npx @mermaid-js/mermaid-cli` converts `.mmd` files to PNG/SVG for use in documents or presentations.

In this blog, Mermaid code blocks are rendered live using the Mermaid JS library — what you see above is generated directly from the source text.

---

## Why Diagram as Code

- **Version control** — every diagram change has a git history. You can see when and why a node was added or removed.
- **Reviewable diffs** — a Mermaid diff is plain text. Changing a label or adding an edge shows up clearly in a pull request.
- **No lock-in** — Mermaid files work in GitHub, GitLab, Notion, and any Markdown renderer.
- **Speed** — writing `A --> B{"Condition"} -->|"edge"| C` takes seconds. No GUI tool can match that.
- **Documentation stays in sync** — the diagram lives in the same repo as the code. When the code changes, the diagram changes in the same PR.

---

Mermaid JS turns diagrams from artifacts you tolerate into tools you actually use. Pick a diagram type, write the syntax, and commit it alongside your code.
