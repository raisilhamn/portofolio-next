---
title: "Lambda Calculus for the Impatient"
date: "2026-02-03"
excerpt: "A concise introduction to the lambda calculus - functions, application, and the Church numerals."
tags: ["theory", "programming-languages", "math"]
---

## Introduction

The lambda calculus is a formal system for expressing computation. It is Turing-complete, yet its syntax fits on a single line:

```
<expr> ::= <name> | \\<name>.<expr> | <expr> <expr>
```

That is it. We have variables, abstraction (function definition), and application (function call).

## The Three Rules

### 1. Alpha Conversion (alpha-conversion)

Bound variables can be renamed freely:

```
(\x. x) == (\y. y)
```

### 2. Beta Reduction (beta-reduction)

Applying a function substitutes the argument:

```
(\x. M) N  -->  M[x := N]
```

### 3. Eta Conversion (eta-conversion)

Functions that behave the same are the same:

```
\x. f x  ==  f   (if x not free in f)
```

## Church Numerals

We can encode natural numbers as functions:

```
0 := \\f.\\x. x
1 := \\f.\\x. f x
2 := \\f.\\x. f (f x)
3 := \\f.\\x. f (f (f x))
```

Successor, addition, and multiplication follow naturally:

```
SUCC := \\n.\\f.\\x. f (n f x)
ADD  := \\m.\\n.\\f.\\x. m f (n f x)
MULT := \\m.\\n.\\f. m (n f)
```

## Why It Matters

The lambda calculus is the theoretical foundation of functional programming languages. Haskell, ML, and even closures in JavaScript and Python trace their lineage back to Church's system.

Understanding it gives you a deeper appreciation for:

- **Scope and binding** &mdash; lexical scoping is alpha conversion
- **Higher-order functions** &mdash; functions returning functions
- **Currying** &mdash; multi-argument functions as nested single-argument functions

## Further Reading

- *Types and Programming Languages* by Benjamin C. Pierce
- *The Lambda Calculus* by H.P. Barendregt
- *Structure and Interpretation of Computer Programs* by Abelson & Sussman
