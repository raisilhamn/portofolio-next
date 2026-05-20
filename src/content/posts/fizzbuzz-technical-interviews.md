---
title: "FizzBuzz and the Problem With Technical Interviews"
date: "2026-04-22"
excerpt: "Why a simple children's game became the most controversial filter in software hiring — and what it says about the process."
tags: ["programming", "interviews", "opinion"]
---

## The Problem That Launched a Thousand Rants

Print numbers 1 to 100. For multiples of 3, print "Fizz" instead of the number. For multiples of 5, print "Buzz". For multiples of both, print "FizzBuzz".

That is it. A children's counting game from the UK repurposed as a software engineering litmus test. If you cannot write this program, the argument goes, you cannot write code at all.

```php
<?php

function fizzbuzz(int $limit = 100): void {
    for ($i = 1; $i <= $limit; $i++) {
        if ($i % 15 === 0) {
            echo "FizzBuzz\n";
        } elseif ($i % 3 === 0) {
            echo "Fizz\n";
        } elseif ($i % 5 === 0) {
            echo "Buzz\n";
        } else {
            echo $i . "\n";
        }
    }
}

fizzbuzz();
```

Straightforward. But like all simple things, everybody has an opinion.

## Why It Spread

The original blog post that popularised FizzBuzz as a hiring filter claimed that a significant percentage of supposedly qualified candidates could not solve it. The implication was damning: the interview pipeline was letting through people who could not program their way out of a paper bag.

Hiring managers loved this. Here was a five-minute test that promised to separate the signal from the noise with no ambiguity. You either wrote the solution or you did not.

### A Cleaner Variant

A common alternative collects results into an array for testing or further processing:

```php
<?php

function fizzbuzz_array(int $limit = 100): array {
    $result = [];

    for ($i = 1; $i <= $limit; $i++) {
        $output = '';

        if ($i % 3 === 0) $output .= 'Fizz';
        if ($i % 5 === 0) $output .= 'Buzz';

        $result[] = $output === '' ? (string) $i : $output;
    }

    return $result;
}

foreach (fizzbuzz_array() as $line) {
    echo $line . "\n";
}
```

This avoids the `% 15` magic number and reads more declaratively: let the conditions compose naturally.

## The Real Problem

FizzBuzz reveals something, but not what people think it does.

Someone who freezes on FizzBuzz in an interview might be nervous. They might be a non-native English speaker processing the problem statement in a second language. They might have spent the last five years working on embedded systems or database internals where loops look different. Or they might simply be a bad programmer.

The test cannot distinguish between these cases. It produces a binary outcome and invites a binary interpretation.

### An Even Shorter Version

PHP 8.1+ supports enums and arrow functions, making the intent even tighter:

```php
<?php

$fizzbuzz = array_map(fn($n) => match (true) {
    $n % 15 === 0 => 'FizzBuzz',
    $n % 3 === 0  => 'Fizz',
    $n % 5 === 0  => 'Buzz',
    default       => (string) $n,
}, range(1, 100));

echo implode("\n", $fizzbuzz);
```

Elegant, but would a candidate who writes this pass your interview? If you only expected the beginner version, you might mark them down for being "too clever." That is its own problem.

## What It Actually Tests

FizzBuzz tests approximately three things:

1. **Basic syntax familiarity** &mdash; can you write a loop and a conditional in the language?
2. **Operator knowledge** &mdash; do you know what `%` does?
3. **Order-of-operations reasoning** &mdash; can you order your conditionals correctly?

It does not test system design. It does not test debugging. It does not test collaboration, code review, testing, or any of the skills that actually matter in day-to-day software development.

### One-Liner (Because Someone Will Write It)

```php
<?php

foreach (range(1, 100) as $i) {
    echo ($i % 15 === 0 ? 'FizzBuzz' : ($i % 3 === 0 ? 'Fizz' : ($i % 5 === 0 ? 'Buzz' : $i))) . "\n";
}
```

Readable? No. Does it work? Yes. Would you want to maintain it? Also no.

## A Better Signal

If you must use a simple screening exercise, pair it with something that tests actual engineering judgment:

- Ask the candidate to extend it (what if there is a fourth word for multiples of 7?)
- Ask them to test it (how would you verify correctness for limit = 10^6?)
- Ask them to refactor it (extract the rule mapping, make it configurable)

The difference between a candidate who can write FizzBuzz and one who can build software is not whether they get the right answer. It is what they do after they get it.

```php
<?php

// Configurable FizzBuzz — the "extend me" version
$rules = [
    3 => 'Fizz',
    5 => 'Buzz',
];

foreach (range(1, 100) as $i) {
    $output = '';
    foreach ($rules as $divisor => $word) {
        if ($i % $divisor === 0) $output .= $word;
    }
    echo ($output === '' ? $i : $output) . "\n";
}
```

---

FizzBuzz is not a bad filter. It is just an incomplete one. Like any single data point in hiring, it is useful only when combined with others. The best engineers I know would solve it in thirty seconds and then spend the next ten minutes asking you why you asked.
