---
title: "SQL Technical Test: Mistakes, Lessons, and What I Relearned"
date: "2026-06-02"
excerpt: "After bombing a live SQL technical test: thanks to DBeaver's autocomplete addiction: I go back to fundamentals: order of execution, JOINs, every SQL keyword, and a full practice test with answers."
tags: ["sql", "interviews", "database", "learning"]
---

## The DBeaver Autocomplete Trap

I've been writing SQL in DBeaver for years. The autocomplete help me a lot in my previous job. I stop memorizing and start just... clicking.
Then I had a job interview with a live coding test. No autocomplete. A docs editor, a question on screen, and someone watching me.
My hands went cold. I started a query and immediately hit a wall. I sat there staring at it. I knew what the query needed to do. I just couldn't get my fingers to type it out without DBeaver holding my hand. I rushed, second-guessed myself, rewrote the same line three times. 

So this is my post-mortem. 

---

## SQL Order of Execution

The single most important mental model for writing SQL is understanding that the clauses execute in a **different order than they are written**.

### You Write

```sql
SELECT   column, AGGREGATE(column)   -- 5th
FROM     table                       -- 1st
JOIN     other_table ON condition    -- 1st (alongside FROM)
WHERE    condition                   -- 2nd
GROUP BY column                      -- 3rd
HAVING   aggregate_condition         -- 4th
ORDER BY column                      -- 6th
LIMIT    n;                          -- 7th
```

### The Engine Executes

| Step | Clause | What Happens |
|------|--------|-------------|
| 1 | `FROM` + `JOIN` | Load tables, perform joins, build the working dataset |
| 2 | `WHERE` | Filter rows before aggregation |
| 3 | `GROUP BY` | Partition rows into groups |
| 4 | `HAVING` | Filter groups after aggregation |
| 5 | `SELECT` | Choose columns, compute expressions, apply aliases |
| 6 | `ORDER BY` | Sort the result set (aliases now available) |
| 7 | `LIMIT` / `OFFSET` | Trim the result set |

### Why This Matters

A few consequences of this order:

- **Aliases work in `ORDER BY` but not in `WHERE`.** `WHERE` runs before `SELECT`, so the alias does not exist yet. `ORDER BY` runs after `SELECT`, so aliases are available.

```sql
-- WRONG: "total" alias does not exist during WHERE
SELECT SUM(qty) AS total FROM sales WHERE total > 100;

-- CORRECT
SELECT SUM(qty) AS total FROM sales GROUP BY product_id HAVING SUM(qty) > 100;
```

- **`HAVING` is for aggregates, `WHERE` is for rows.** `WHERE` cannot use aggregate functions; `HAVING` can.

- **`JOIN` conditions affect the base dataset.** A `LEFT JOIN` with a poorly placed `WHERE` clause can silently turn into an `INNER JOIN` by filtering out null rows.

---

## JOIN Types Explained

Joins combine rows from two or more tables based on a related column.

### INNER JOIN

Returns only rows where the join condition matches in **both** tables.

```
Table A: {1, 2, 3}    Table B: {2, 3, 4}
A INNER JOIN B => {2, 3}
```

**Example 1: Basic two-table join**

```sql
SELECT customer.name, invoice.total
FROM customer
INNER JOIN invoice ON customer.id = invoice.customer_id;
```

**Example 2: Three-table join**

```sql
SELECT c.name, i.total, p.name AS product
FROM customer c
INNER JOIN invoice i ON c.id = i.customer_id
INNER JOIN product p ON i.product_id = p.id;
```

**Example 3: Join with WHERE filter**

```sql
SELECT c.name, i.total, i.date
FROM customer c
INNER JOIN invoice i ON c.id = i.customer_id
WHERE i.total > 100000 AND c.city = 'JKT';
```

**Example 4: Join with GROUP BY and aggregate**

```sql
SELECT c.name, COUNT(i.id) AS total_invoices, SUM(i.total) AS total_spent
FROM customer c
INNER JOIN invoice i ON c.id = i.customer_id
GROUP BY c.name;
```

**Example 5: Self-join (join a table to itself)**

```sql
SELECT e.name AS employee, m.name AS manager
FROM employee e
INNER JOIN employee m ON e.manager_id = m.id;
```

---

### LEFT JOIN (LEFT OUTER JOIN)

Returns **all rows from the left table** plus matching rows from the right table. Unmatched right columns become `NULL`.

```
A LEFT JOIN B => {(1, null), (2, 2), (3, 3)}
```

**Example 1: Basic left join**

```sql
SELECT customer.name, invoice.total
FROM customer
LEFT JOIN invoice ON customer.id = invoice.customer_id;
-- Shows ALL customers, even those with no invoices
```

**Example 2: Find customers with NO invoices (anti-join pattern)**

```sql
SELECT customer.name
FROM customer
LEFT JOIN invoice ON customer.id = invoice.customer_id
WHERE invoice.id IS NULL;
```

**Example 3: LEFT JOIN with aggregation**

```sql
SELECT c.name, COALESCE(SUM(i.total), 0) AS total_spent
FROM customer c
LEFT JOIN invoice i ON c.id = i.customer_id
GROUP BY c.name;
-- COALESCE turns NULL sums into 0 for customers with no purchases
```

**Example 4: Multiple LEFT JOINs chained**

```sql
SELECT c.name, i.total, p.name AS product, s.name AS shipper
FROM customer c
LEFT JOIN invoice i ON c.id = i.customer_id
LEFT JOIN product p ON i.product_id = p.id
LEFT JOIN shipment s ON i.id = s.invoice_id;
```

**Example 5: LEFT JOIN vs INNER JOIN side-by-side**

```sql
-- INNER: only customers who bought something
SELECT c.name FROM customer c INNER JOIN invoice i ON c.id = i.customer_id;

-- LEFT: ALL customers, nulls where no invoice exists
SELECT c.name FROM customer c LEFT JOIN invoice i ON c.id = i.customer_id;
```

---

### RIGHT JOIN (RIGHT OUTER JOIN)

Same as LEFT JOIN but reversed: all rows from the right table.

**Example 1: Basic right join**

```sql
SELECT customer.name, invoice.total
FROM customer
RIGHT JOIN invoice ON customer.id = invoice.customer_id;
-- Shows ALL invoices, even orphaned ones
```

**Example 2: Find orphaned invoices (no matching customer)**

```sql
SELECT invoice.id, invoice.total
FROM customer
RIGHT JOIN invoice ON customer.id = invoice.customer_id
WHERE customer.id IS NULL;
```

**Example 3: RIGHT JOIN with filter on left table**

```sql
SELECT c.name, i.total
FROM customer c
RIGHT JOIN invoice i ON c.id = i.customer_id
WHERE i.date >= '2026-01-01';
```

**Example 4: Three-table RIGHT JOIN chain**

```sql
SELECT s.name AS supplier, p.name AS product, i.total
FROM supplier s
RIGHT JOIN product p ON s.id = p.supplier_id
RIGHT JOIN invoice i ON p.id = i.product_id;
```

**Example 5: Rewriting RIGHT JOIN as LEFT JOIN (preferred style)**

```sql
-- RIGHT JOIN (less common, harder to read)
SELECT c.name, i.total FROM customer c RIGHT JOIN invoice i ON c.id = i.customer_id;

-- Same query as LEFT JOIN (preferred)
SELECT c.name, i.total FROM invoice i LEFT JOIN customer c ON c.id = i.customer_id;
```

---

### FULL OUTER JOIN

Returns all rows from both tables. Unmatched sides become `NULL`.

```
A FULL OUTER JOIN B => {(1, null), (2, 2), (3, 3), (null, 4)}
```

**Example 1: Basic full outer join**

```sql
SELECT c.name, i.total
FROM customer c
FULL OUTER JOIN invoice i ON c.id = i.customer_id;
```

**Example 2: Find mismatches on BOTH sides**

```sql
SELECT c.name, i.id AS invoice_id
FROM customer c
FULL OUTER JOIN invoice i ON c.id = i.customer_id
WHERE c.id IS NULL OR i.id IS NULL;
-- Shows customers without invoices AND invoices without customers
```

**Example 3: FULL OUTER with COALESCE for cleaner output**

```sql
SELECT
    COALESCE(c.name, 'NO CUSTOMER') AS customer,
    COALESCE(i.id::text, 'NO INVOICE') AS invoice
FROM customer c
FULL OUTER JOIN invoice i ON c.id = i.customer_id;
```

**Example 4: FULL OUTER joining three tables (PostgreSQL)**

```sql
SELECT COALESCE(c.name, '?') AS customer,
       COALESCE(p.name, '?') AS product,
       COALESCE(i.total::text, '?') AS total
FROM customer c
FULL OUTER JOIN invoice i ON c.id = i.customer_id
FULL OUTER JOIN product p ON i.product_id = p.id;
```

**Example 5: FULL OUTER vs UNION ALL simulation (for databases without FULL OUTER)**

```sql
-- MySQL workaround: simulate FULL OUTER JOIN with UNION
SELECT c.name, i.total FROM customer c LEFT JOIN invoice i ON c.id = i.customer_id
UNION
SELECT c.name, i.total FROM customer c RIGHT JOIN invoice i ON c.id = i.customer_id;
```

---

### CROSS JOIN

Cartesian product: every row from the left paired with every row from the right. Rarely what you want.

**Example 1: Basic cross join**

```sql
SELECT * FROM colors CROSS JOIN sizes;
-- 5 colors × 3 sizes = 15 rows
```

**Example 2: Cross join with WHERE to simulate INNER JOIN (old-style)**

```sql
SELECT c.name, i.total
FROM customer c
CROSS JOIN invoice i
WHERE c.id = i.customer_id;
-- Functionally identical to INNER JOIN, but less readable
```

**Example 3: Generate a number series (useful trick)**

```sql
SELECT a.n * 10 + b.n AS number
FROM (VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9)) AS a(n)
CROSS JOIN (VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9)) AS b(n)
ORDER BY number;
-- Generates numbers 0-99
```

**Example 4: Cross join to fill missing combinations**

```sql
SELECT d.date, p.name AS product
FROM (SELECT DISTINCT date FROM sales) d
CROSS JOIN product p
ORDER BY d.date, p.name;
-- All possible date/product pairs, even those with no sales
```

**Example 5: Cross join with LATERAL (PostgreSQL)**

```sql
SELECT c.name, top_sales.total
FROM customer c
CROSS JOIN LATERAL (
    SELECT total FROM invoice
    WHERE customer_id = c.id
    ORDER BY total DESC
    LIMIT 1
) top_sales;
-- For each customer, fetch their single largest invoice
```

### What Does a Bare `JOIN` Do?

Writing just `JOIN` without any qualifier: e.g. `FROM a JOIN b ON a.id = b.id`: defaults to **`INNER JOIN`** in PostgreSQL (and in MySQL, SQLite, and SQL Server). These two are identical:

```sql
SELECT * FROM customer JOIN invoice ON customer.id = invoice.customer_id;
SELECT * FROM customer INNER JOIN invoice ON customer.id = invoice.customer_id;
```

This is true in the SQL standard as well: `JOIN` is shorthand for `INNER JOIN`. However, you cannot write just `INNER` without `JOIN`: `FROM a INNER b ON ...` is a syntax error.

Because the bare `JOIN` is ambiguous to read (does the author mean INNER? did they forget LEFT?), most style guides recommend always writing the full keyword: `INNER JOIN`, `LEFT JOIN`, etc.

### Quick Reference

| Join | Left rows | Right rows | Match rows |
|------|-----------|------------|------------|
| `JOIN` (bare) | Same as `INNER JOIN` | Same as `INNER JOIN` | Same as `INNER JOIN` |
| `INNER JOIN` | Only matched | Only matched | Both |
| `LEFT JOIN` | All | Only matched | Both |
| `RIGHT JOIN` | Only matched | All | Both |
| `FULL OUTER JOIN` | All | All | Both |
| `CROSS JOIN` | All | All | All (cartesian) |

---

## All SQL Keywords (Grouped by Category)

A quick way to keep them straight:

| Category | Full Name | What It Does | Keywords |
|----------|-----------|--------------|----------|
| **DDL** | Data Definition Language | Modify database **structure** (objects) | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` |
| **DML** | Data Manipulation Language | Modify **data** inside tables | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| **DCL** | Data Control Language | Control **access** (permissions) | `GRANT`, `REVOKE` |
| **TCL** | Transaction Control Language | Control **transactions** | `COMMIT`, `ROLLBACK`, `SAVEPOINT` |

Common trap: `DELETE` (DML) removes rows; `DROP` (DDL) removes entire tables. `TRUNCATE` (DDL) removes all rows quickly but cannot be rolled back in some databases.

### DDL: Data Definition Language

These define and modify the **structure** of database objects.

**`CREATE`**

```sql
-- 1. Create a basic table
CREATE TABLE customer (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create a table with foreign key
CREATE TABLE invoice (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customer(id),
    total DECIMAL(12, 2),
    date DATE NOT NULL
);

-- 3. Create a view
CREATE VIEW customer_summary AS
SELECT c.name, c.city, COUNT(i.id) AS invoice_count, SUM(i.total) AS total_spent
FROM customer c
LEFT JOIN invoice i ON c.id = i.customer_id
GROUP BY c.id, c.name, c.city;

-- 4. Create an index
CREATE INDEX idx_invoice_customer ON invoice(customer_id);
CREATE INDEX idx_invoice_date ON invoice(date);

-- 5. Create a database (requires superuser)
CREATE DATABASE sales_db OWNER app_user ENCODING 'UTF8';
```

**`ALTER`**

```sql
-- 1. Add a column
ALTER TABLE customer ADD COLUMN phone VARCHAR(20);

-- 2. Drop a column
ALTER TABLE customer DROP COLUMN phone;

-- 3. Rename a column
ALTER TABLE customer RENAME COLUMN city TO kota;

-- 4. Change a column's data type
ALTER TABLE customer ALTER COLUMN name TYPE VARCHAR(200);

-- 5. Add a constraint
ALTER TABLE invoice ADD CONSTRAINT fk_customer
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE;

-- 6. Add a default value
ALTER TABLE invoice ALTER COLUMN total SET DEFAULT 0;
```

**`DROP`**

```sql
-- 1. Drop a table
DROP TABLE invoice;

-- 2. Drop if exists (safe, no error if table is missing)
DROP TABLE IF EXISTS invoice;

-- 3. Drop with CASCADE (remove dependent objects too)
DROP TABLE customer CASCADE;

-- 4. Drop a view
DROP VIEW IF EXISTS customer_summary;

-- 5. Drop an index
DROP INDEX IF EXISTS idx_invoice_date;

-- 6. Drop a database (outside any transaction, requires superuser)
DROP DATABASE IF EXISTS sales_db;
```

**`TRUNCATE`**

```sql
-- 1. Remove all rows fast (DDL: cannot rollback in PostgreSQL without a transaction)
TRUNCATE TABLE invoice;

-- 2. Truncate multiple tables
TRUNCATE TABLE invoice, customer;

-- 3. Truncate and reset identity sequences
TRUNCATE TABLE invoice RESTART IDENTITY;

-- 4. Truncate with CASCADE (also truncate referencing tables)
TRUNCATE TABLE customer CASCADE;

-- 5. Safe truncate inside a transaction (PostgreSQL: allows rollback)
BEGIN;
TRUNCATE TABLE invoice;
-- Oops, wrong table!
ROLLBACK;  -- rows are restored
```

### DML: Data Manipulation Language

These operate on the **data** inside tables.

**`SELECT`**

```sql
-- 1. Select all columns
SELECT * FROM customer;

-- 2. Select specific columns with alias
SELECT name AS nama, city AS kota FROM customer;

-- 3. Select with WHERE filter
SELECT * FROM invoice WHERE total > 50000 AND date >= '2026-01-01';

-- 4. Select with GROUP BY and aggregate
SELECT customer_id, COUNT(*) AS total, SUM(total) AS revenue
FROM invoice
GROUP BY customer_id;

-- 5. Select with GROUP BY + HAVING
SELECT customer_id, SUM(total) AS revenue
FROM invoice
GROUP BY customer_id
HAVING SUM(total) > 100000;

-- 6. Select with ORDER BY (ASC/DESC)
SELECT * FROM invoice ORDER BY total DESC, date ASC;

-- 7. Select with LIMIT and OFFSET
SELECT * FROM invoice ORDER BY date DESC LIMIT 10 OFFSET 20;

-- 8. Select DISTINCT values
SELECT DISTINCT city FROM customer;

-- 9. Select with subquery in WHERE
SELECT name FROM customer
WHERE id IN (SELECT customer_id FROM invoice WHERE total > 500000);

-- 10. Select with EXISTS
SELECT name FROM customer c
WHERE EXISTS (SELECT 1 FROM invoice i WHERE i.customer_id = c.id AND i.total > 500000);

-- 11. Select with CASE expression
SELECT name, total,
    CASE
        WHEN total > 500000 THEN 'Large'
        WHEN total > 100000 THEN 'Medium'
        ELSE 'Small'
    END AS category
FROM invoice;

-- 12. Select with window function
SELECT name, date, total,
    SUM(total) OVER (PARTITION BY customer_id ORDER BY date) AS running_total
FROM invoice
JOIN customer ON customer.id = invoice.customer_id;
```

**`INSERT`**

```sql
-- 1. Insert a single row (all columns in order)
INSERT INTO customer VALUES (1, 'Toko Aling', 'JKT');

-- 2. Insert with explicit column list (preferred)
INSERT INTO customer (name, city) VALUES ('Toko Aling', 'JKT');

-- 3. Insert multiple rows in one statement
INSERT INTO customer (name, city) VALUES
    ('Toko Aling', 'JKT'),
    ('Tk. Noer', 'BDG'),
    ('Tk. Tari', 'YOG');

-- 4. INSERT ... SELECT (copy rows from another table)
INSERT INTO customer_archive (id, name, city)
SELECT id, name, city FROM customer WHERE created_at < '2020-01-01';

-- 5. INSERT with RETURNING (PostgreSQL: get back generated values)
INSERT INTO customer (name, city)
VALUES ('Ap. Sehat', 'JKT')
RETURNING id, created_at;

-- 6. INSERT ... ON CONFLICT (PostgreSQL upsert)
INSERT INTO customer (id, name, city)
VALUES (1, 'Toko Aling Updated', 'BDG')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, city = EXCLUDED.city;
```

**`UPDATE`**

```sql
-- 1. Update a single column
UPDATE customer SET city = 'BDG' WHERE id = 1;

-- 2. Update multiple columns
UPDATE customer SET name = 'Toko Aling Baru', city = 'JKT' WHERE id = 1;

-- 3. Update with calculation
UPDATE invoice SET total = total * 1.1 WHERE date < '2020-01-01';

-- 4. Update using a subquery
UPDATE invoice SET total = 0
WHERE customer_id IN (SELECT id FROM customer WHERE city = 'JKT');

-- 5. Update with JOIN (PostgreSQL: UPDATE ... FROM)
UPDATE invoice i
SET total = i.total * 0.9
FROM customer c
WHERE i.customer_id = c.id AND c.city = 'YOG';

-- 6. Update with RETURNING
UPDATE invoice SET total = total * 1.05
WHERE date >= '2026-01-01'
RETURNING id, customer_id, total AS new_total;

-- 7. Update all rows (no WHERE: be careful!)
UPDATE invoice SET total = 0;
```

**`DELETE`**

```sql
-- 1. Delete a specific row
DELETE FROM customer WHERE id = 1;

-- 2. Delete with subquery condition
DELETE FROM invoice
WHERE customer_id IN (SELECT id FROM customer WHERE city = 'BDG');

-- 3. Delete with JOIN (PostgreSQL: DELETE ... USING)
DELETE FROM invoice i
USING customer c
WHERE i.customer_id = c.id AND c.city = 'YOG';

-- 4. Delete all rows (keep table structure)
DELETE FROM invoice;

-- 5. Delete with RETURNING
DELETE FROM customer
WHERE city = 'JKT'
RETURNING id, name;

-- 6. Delete based on NOT EXISTS (cleanup orphans)
DELETE FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM invoice i WHERE i.customer_id = c.id);
```

### DCL: Data Control Language

| Keyword | Purpose |
|---------|---------|
| `GRANT` | Give privileges to users |
| `REVOKE` | Remove privileges from users |

### TCL: Transaction Control Language

| Keyword | Purpose |
|---------|---------|
| `COMMIT` | Save all changes permanently |
| `ROLLBACK` | Undo all changes since the last commit |
| `SAVEPOINT` | Mark a point to which you can partially rollback |

### Query Clauses

| Keyword | Purpose | Execution Order |
|---------|---------|-----------------|
| `FROM` | Specify tables to read from | 1st |
| `JOIN` / `INNER JOIN` / `LEFT JOIN` / `RIGHT JOIN` / `FULL JOIN` / `CROSS JOIN` | Combine tables | 1st |
| `ON` | Join condition | 1st |
| `WHERE` | Filter rows before grouping | 2nd |
| `GROUP BY` | Group rows by one or more columns | 3rd |
| `HAVING` | Filter groups after grouping | 4th |
| `SELECT` | Choose columns and expressions | 5th |
| `DISTINCT` | Remove duplicate rows | 5th (with SELECT) |
| `ORDER BY` | Sort the result | 6th |
| `ASC` / `DESC` | Sort direction | 6th |
| `LIMIT` / `OFFSET` (or `TOP` / `FETCH`) | Limit number of rows returned | 7th |

### Operators and Conditions

**`AND` / `OR` / `NOT`**

```sql
-- AND: both conditions must be true
SELECT * FROM customer WHERE city = 'JKT' AND name LIKE 'Toko%';

-- OR: at least one condition must be true
SELECT * FROM customer WHERE city = 'JKT' OR city = 'BDG';

-- NOT: negate a condition
SELECT * FROM customer WHERE NOT city = 'JKT';

-- Combine with parentheses for correct grouping
SELECT * FROM customer WHERE (city = 'JKT' OR city = 'BDG') AND name LIKE 'Tk.%';
```

**`IN`**

```sql
-- Match any value in a list
SELECT * FROM customer WHERE city IN ('JKT', 'BDG', 'YOG');

-- IN with subquery
SELECT * FROM customer WHERE id IN (SELECT customer_id FROM invoice WHERE total > 50000);

-- NOT IN
SELECT * FROM customer WHERE city NOT IN ('JKT', 'BDG');
```

**`BETWEEN`**

```sql
-- BETWEEN is inclusive (>= min AND <= max)
SELECT * FROM invoice WHERE total BETWEEN 10000 AND 100000;

-- Date range
SELECT * FROM invoice WHERE date BETWEEN '2026-01-01' AND '2026-06-30';

-- NOT BETWEEN
SELECT * FROM invoice WHERE total NOT BETWEEN 10000 AND 100000;
```

**`LIKE` / `ILIKE`**

```sql
-- % matches any sequence of characters
SELECT * FROM customer WHERE name LIKE 'Toko%';    -- starts with "Toko"
SELECT * FROM customer WHERE name LIKE '%Baru';    -- ends with "Baru"
SELECT * FROM customer WHERE name LIKE '%ar%';     -- contains "ar"

-- _ matches exactly one character
SELECT * FROM customer WHERE name LIKE 'Tk. ___';  -- "Tk." followed by 3 chars

-- ILIKE is case-insensitive (PostgreSQL)
SELECT * FROM customer WHERE name ILIKE 'toko%';
```

**`IS NULL` / `IS NOT NULL`**

```sql
-- Find rows with NULL
SELECT * FROM customer WHERE phone IS NULL;

-- Find rows with a value
SELECT * FROM customer WHERE phone IS NOT NULL;

-- Common trap: = NULL does not work (NULL is not equal to anything)
SELECT * FROM customer WHERE phone IS NULL;   -- correct
SELECT * FROM customer WHERE phone = NULL;    -- WRONG! Never returns rows
```

**`EXISTS`**

```sql
-- Check if at least one matching row exists in subquery
SELECT name FROM customer c
WHERE EXISTS (SELECT 1 FROM invoice i WHERE i.customer_id = c.id);

-- NOT EXISTS (anti-join)
SELECT name FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM invoice i WHERE i.customer_id = c.id);
```

### Aggregate Functions

All examples use this dataset context:

```sql
-- Counting
SELECT COUNT(*) AS total_rows FROM invoice;             -- all rows including nulls
SELECT COUNT(customer_id) FROM invoice;                 -- non-null customer_ids only
SELECT COUNT(DISTINCT customer_id) FROM invoice;        -- unique customers

-- Sum with grouping
SELECT customer_id, SUM(total) AS revenue
FROM invoice
GROUP BY customer_id;

-- Average with rounding
SELECT customer_id, ROUND(AVG(total), 2) AS avg_order
FROM invoice
GROUP BY customer_id;

-- Min and Max
SELECT MIN(date) AS first_order, MAX(date) AS last_order FROM invoice;

-- Multiple aggregates in one query
SELECT
    customer_id,
    COUNT(*) AS orders,
    SUM(total) AS revenue,
    AVG(total) AS avg_total,
    MIN(total) AS smallest,
    MAX(total) AS largest
FROM invoice
GROUP BY customer_id;
```

### Set Operations

```sql
-- UNION: combine two queries, remove duplicates
SELECT city FROM customer WHERE city IN ('JKT', 'BDG')
UNION
SELECT city FROM supplier WHERE city IN ('BDG', 'YOG');
-- Result: JKT, BDG, YOG

-- UNION ALL: combine, keep duplicates
SELECT city FROM customer WHERE city IN ('JKT', 'BDG')
UNION ALL
SELECT city FROM supplier WHERE city IN ('BDG', 'YOG');
-- Result: JKT, BDG, BDG, YOG (BDG appears twice)

-- INTERSECT: rows that appear in both queries
SELECT city FROM customer
INTERSECT
SELECT city FROM supplier;
-- Result: cities that have both a customer and a supplier

-- EXCEPT: rows in first query that are NOT in second (PostgreSQL, SQL Server)
SELECT city FROM customer
EXCEPT
SELECT city FROM supplier;
-- Result: cities that have customers but no suppliers
```

### Subquery Patterns

```sql
-- Subquery in WHERE with IN
SELECT name FROM customer
WHERE id IN (SELECT customer_id FROM invoice WHERE date >= '2026-01-01');

-- Subquery in WHERE with = (must return exactly one row)
SELECT name FROM customer
WHERE id = (SELECT MAX(customer_id) FROM invoice);

-- Subquery in SELECT (scalar subquery: one row, one column)
SELECT name,
    (SELECT COUNT(*) FROM invoice WHERE customer_id = customer.id) AS order_count
FROM customer;

-- Subquery in FROM (derived table)
SELECT sub.city, AVG(sub.order_count) AS avg_orders
FROM (
    SELECT city, COUNT(i.id) AS order_count
    FROM customer c
    LEFT JOIN invoice i ON c.id = i.customer_id
    GROUP BY c.id, city
) sub
GROUP BY sub.city;

-- Correlated subquery (references outer query)
SELECT c.name, c.city,
    (SELECT SUM(total) FROM invoice WHERE customer_id = c.id) AS total_spent
FROM customer c
WHERE (SELECT SUM(total) FROM invoice WHERE customer_id = c.id) > 100000;
```

---

## My Mistakes in the Live Test

Here is what went wrong, categorized honestly:

### 1. Forgetting `CREATE TABLE` Syntax

I wrote something like `CREATE TABLE Customer VALUES (...)`: mixing the syntax of `CREATE TABLE` with `INSERT INTO`. The correct syntax is:

```sql
CREATE TABLE Customer (
    KdCust VARCHAR(10),
    NmCust VARCHAR(100),
    Kota VARCHAR(10)
);
```

### 2. Confusing `UPDATE` with `SELECT`

Stress made me write `SELECT NoFaktur = 'P-010' FROM ...` instead of `UPDATE ... SET ...`. `UPDATE` is a DML command with its own syntax:

```sql
UPDATE Penjualan SET NoFaktur = 'P-010' WHERE KdBarang = 'FTCOA' AND Qty = 60;
```

**`UPDATE` does not use `*` or a column list.** Unlike `SELECT *` or `SELECT col1, col2`, the columns you intend to modify appear only inside the `SET` clause. You never write `UPDATE table SET * ...` or specify target columns outside `SET`. The pattern is simply:

```
UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;
```

### 3. Forgetting the `JOIN` Keyword

I wrote `FROM Customer, Penjualan WHERE Customer.KdCust = Penjualan.KdCust` which is valid (implicit join) but the question expected explicit `INNER JOIN ... ON` syntax. Implicit joins still work in most databases but are considered outdated.

### 4. Misplacing `GROUP BY` vs `ORDER BY`

In the heat of the moment, I used `ORDER BY` where `GROUP BY` was needed for aggregation queries. Remember:

- `GROUP BY` **groups** rows into partitions for aggregate functions
- `ORDER BY` **sorts** the final result set

### 5. Forgetting `BETWEEN` Syntax

I wrote `TglFaktur '11/5/2020 - 12/5/2020'` instead of `TglFaktur BETWEEN '11/5/2020' AND '12/5/2020'`. The `BETWEEN` keyword requires `AND` as the separator, not a dash.

### 6. String Comparison in `WHERE` Without Quotes

I wrote `WHERE KdCust = Tk. Tari`: no quotes around the string value. Strings must always be quoted:

```sql
WHERE NmCust = 'Tk. Tari'
```

### 7. Using `VIEW` Instead of `SELECT`

A `VIEW` is a saved query (a virtual table), not a command to display data. The correct keyword for retrieving data is `SELECT`.

### 8. `COUNT(*)` vs `COUNT(column)`

When counting rows, `COUNT(*)` counts all rows including nulls. `COUNT(column)` counts only non-null values in that column. I mixed these up in aggregate queries.

### 9. `DELETE` vs `DROP`

- `DELETE FROM table WHERE ...` removes **rows** (DML)
- `DROP TABLE table` removes the entire **table** (DDL)

I answered a DDL question with `DELETE` instead of `DROP`.

### 10. Subquery in `UPDATE`

For correlated updates, the subquery syntax matters:

```sql
UPDATE Penjualan SET Qty = 100
WHERE KdCust IN (SELECT KdCust FROM Customer WHERE Kota = 'JKT');
```

Using `=` with a subquery requires the subquery to return exactly one row. Use `IN` when it may return multiple rows.

---

## Conclusion

A live SQL test without autocomplete is humbling. The tooling we rely on every day: autocomplete, schema browsers, query formatters: hides gaps in our knowledge. The test exposed mine brutally.

The fix is not to abandon DBeaver. It is to occasionally write SQL in a plain text editor, from scratch, without assistance. Muscle memory for syntax only forms through deliberate practice.

If you are preparing for a SQL technical test:

1. **Memorize the execution order.** It answers half the tricky questions.
2. **Practice JOINs on paper.** Draw the Venn diagrams if needed.
3. **Know the difference between DDL and DML cold.** `CREATE/ALTER/DROP` vs `SELECT/INSERT/UPDATE/DELETE`.
4. **Write queries without autocomplete.** Even 15 minutes a day makes a difference.

---

## Practice Test: SQL Technical Questions (with Answers and Explanations)

Below is a full practice test modeled after the original, with all table names, column names, and values changed. The answer structure remains the same. Try it yourself before reading the explanations.

### Dataset

**Pelanggan**

| KdPelanggan | NmPelanggan | Kota |
|-------------|-------------|------|
| 501234 | Warung Makan | JKT |
| 612345 | Tk. Lestari | BDG |
| 723456 | Tk. Barokah | YOG |
| 834567 | Ap. Keluarga | JKT |

**Produk**

| KdProduk | NmProduk | Stok |
|----------|----------|------|
| PRD01 | INDOMIE GORENG 85 GR | 150 |
| PRD02 | BERAS ROJOLELE 5 KG | 200 |
| PRD03 | KOPI KAPAL API 200 GR | 100 |

**Transaksi**

| NoTransaksi | TglTransaksi | KdPelanggan | KdProduk | Jumlah |
|-------------|-------------|-------------|----------|--------|
| T-001 | 10/5/2020 | 723456 | PRD01 | 15 |
| T-002 | 11/5/2020 | 501234 | PRD02 | 50 |
| T-003 | 11/5/2020 | 612345 | PRD01 | 60 |
| T-004 | 12/5/2020 | 723456 | PRD03 | 50 |

---

### Question 1

What is the syntax to create the Pelanggan table?

A. `Select Table Pelanggan Value ( KdPelanggan Varchar(10), NmPelanggan Varchar(100), Kota Varchar(10) )`

B. `Create Table Pelanggan ( KdPelanggan Varchar(10), NmPelanggan Varchar(100), Kota Varchar(10) )`

C. `Alter Table Pelanggan ( KdPelanggan Varchar(10), NmPelanggan Varchar(100), Kota Varchar(10) )`

D. `Create Table Pelanggan Value ( KdPelanggan Varchar(10), NmPelanggan Varchar(100), Kota Varchar(10) )`

**Answer: B.** `CREATE TABLE` is the DDL command to create a new table. `ALTER` modifies an existing table. `SELECT` retrieves data. `VALUE` / `VALUES` belongs to `INSERT`, not `CREATE TABLE`.

---

### Question 2

Display Pelanggan data located in JKT.

A. `SELECT * FROM Pelanggan WHERE Kota='JKT'`

B. `SELECT TPelanggan.* FROM TPelanggan WHERE TPelanggan.Kota='JKT'`

C. `VIEW * FROM Pelanggan WHERE Kota='JKT'`

D. `SELECT * FROM Data_Pelanggan WHERE Kota='JKT'`

**Answer: A.** The table is named `Pelanggan`, not `TPelanggan` or `Data_Pelanggan`. `VIEW` is used to create a virtual table, not to query data.

---

### Question 3

What syntax displays transaction data performed by Tk. Barokah?

A. `SELECT Transaksi.* FROM Pelanggan, Transaksi`

B. `SELECT * FROM Pelanggan, Transaksi WHERE Pelanggan.KdPelanggan = Transaksi.KdPelanggan AND Pelanggan.KdPelanggan = 'Tk. Barokah'`

C. `SELECT Transaksi.* FROM Pelanggan, Transaksi WHERE Pelanggan.KdPelanggan = Transaksi.KdPelanggan`

D. `SELECT Transaksi.* FROM Pelanggan, Transaksi WHERE Pelanggan.KdPelanggan = Transaksi.KdPelanggan AND Pelanggan.NmPelanggan = 'Tk. Barokah'`

**Answer: D.** The condition must join `Pelanggan` and `Transaksi` on `KdPelanggan`, then filter by `NmPelanggan`. Option B uses `KdPelanggan = 'Tk. Barokah'` which compares the wrong column: `Tk. Barokah` is a name, not a code. Option C shows all transactions without filtering by customer name.

---

### Question 4

What syntax displays products with stock greater than or equal to 150?

A. `VIEW * FROM Produk WHERE Stok > 150`

B. `SELECT * FROM Produk WHERE Stok >= 150`

C. `VIEW * FROM Produk WHERE Stok >= 150`

D. `SELECT * FROM Produk WHERE TStok > 150`

**Answer: B.** `>=` means "greater than or equal to". Option D uses `TStok` which is not a column name. Options A and C use `VIEW` incorrectly.

Expected result: INDOMIE GORENG 85 GR (stok 150) and BERAS ROJOLELE 5 KG (stok 200).

---

### Question 5

What syntax displays the name and city of customers who have made a purchase?

A. `Select NmPelanggan, Kota From Pelanggan Join Transaksi on Pelanggan.KdPelanggan = Transaksi.KdPelanggan`

B. `Select NmPelanggan, Kota From Pelanggan Inner Transaksi on Pelanggan.KdPelanggan = Transaksi.KdPelanggan`

C. `Select CNmPelanggan, CKota From Pelanggan Inner join Transaksi on Pelanggan.KdPelanggan = Transaksi.KdPelanggan`

D. `Select NmPelanggan, Kota From Pelanggan Inner join Transaksi on Pelanggan.KdPelanggan = Transaksi.KdPelanggan`

**Answer: D.** The keyword is `INNER JOIN`, not just `JOIN` (though `JOIN` defaults to `INNER JOIN` in most databases). The critical error in A is omitting `INNER`. Option B is missing `JOIN` after `INNER`. Option C uses wrong column prefixes `CNmPelanggan` and `CKota`.

---

### Question 6

What syntax displays customer names located in YOG and JKT who made purchases on 11/5/2020 and 12/5/2020?

A. `Select NmPelanggan From Pelanggan Join Transaksi on Pelanggan.KdPelanggan = Transaksi.KdPelanggan Where Kota = 'JKT' AND Kota = 'YOG' AND TglTransaksi '11/5/2020 - 12/5/2020'`

B. `Select NmPelanggan From Pelanggan Inner join Transaksi on Pelanggan.KdPelanggan = Transaksi.KdPelanggan Where Kota = 'JKT' AND Kota = 'YOG' AND Between '11/5/2020 - 12/5/2020'`

C. `Select NmPelanggan From Pelanggan Inner join Transaksi on Pelanggan.KdPelanggan = Transaksi.KdPelanggan Where Kota IN ('JKT', 'YOG') AND TglTransaksi Between '11/5/2020' AND '12/5/2020'`

D. `Select NmPelanggan From Pelanggan Inner Transaksi on Pelanggan.KdPelanggan = Transaksi.KdPelanggan Where Kota = 'JKT' AND Kota = 'YOG' AND Between '11/5/2020 - 12/5/2020'`

**Answer: C.** Two critical fixes:

1. `Kota = 'JKT' AND Kota = 'YOG'` is always false: no single row has both values. Use `Kota IN ('JKT', 'YOG')`.
2. `BETWEEN` requires `AND` as a separator: `BETWEEN '11/5/2020' AND '12/5/2020'`.

---

### Question 7

What syntax displays NoTransaksi, TglTransaksi, KdPelanggan, NmPelanggan, KdProduk, NmProduk, Jumlah for transactions of products PRD01 and PRD03?

A. `Select NoTransaksi, TglTransaksi, KdPelanggan, NmPelanggan, KdProduk, NmProduk, Jumlah From Transaksi join Pelanggan on Pelanggan.KdPelanggan = Transaksi.KdPelanggan Inner Join Produk on Produk.KdProduk = Transaksi.KdProduk Where KdProduk = 'PRD01' AND KdProduk = 'PRD03'`

B. `Select NoTransaksi, TglTransaksi, KdPelanggan, NmPelanggan, KdProduk, NmProduk, Jumlah From Transaksi Inner join Pelanggan on Pelanggan.KdPelanggan = Transaksi.KdPelanggan Inner join Produk on Produk.KdProduk = Transaksi.KdProduk Where KdProduk = 'PRD01' AND KdProduk = 'PRD03'`

C. `Select NoTransaksi, TglTransaksi, KdPelanggan, NmPelanggan, KdProduk, NmProduk, Jumlah From Transaksi Inner join Pelanggan on Pelanggan.KdPelanggan = Transaksi.KdPelanggan join Produk on Produk.KdProduk = Transaksi.KdProduk Where KdProduk = 'PRD01' AND KdProduk = 'PRD03'`

D. `Select NoTransaksi, TglTransaksi, KdPelanggan, NmPelanggan, KdProduk, NmProduk, Jumlah From Transaksi Inner join Pelanggan on Pelanggan.KdPelanggan = Transaksi.KdPelanggan Inner join Produk on Produk.KdProduk = Transaksi.KdProduk Where KdProduk IN ('PRD01', 'PRD03')`

**Answer: D.** Two important issues:

1. `KdProduk = 'PRD01' AND KdProduk = 'PRD03'` can never be true for any single row. Use `IN ('PRD01', 'PRD03')` or `OR`.
2. You need exactly two `INNER JOIN` keywords: one for `Pelanggan`, one for `Produk`. Option A mixes `join` and `Inner Join` inconsistently.

---

### Question 8

What syntax displays the number of transactions for each customer?

A. `Select COUNT(*) as JmlTransaksi, NmPelanggan From Transaksi Inner join Pelanggan on Pelanggan.KdPelanggan = Transaksi.KdPelanggan Group by NmPelanggan`

B. `Select SUM(Transaksi.NoTransaksi) as JmlTransaksi, NmPelanggan From Transaksi Inner join Pelanggan on Pelanggan.KdPelanggan = Transaksi.KdPelanggan Group by NmPelanggan`

C. `Select AVG(Transaksi.NoTransaksi) as JmlTransaksi, NmPelanggan From Transaksi Inner join Pelanggan on Pelanggan.KdPelanggan = Transaksi.KdPelanggan Group by NmPelanggan`

D. `Select COUNT(Transaksi.NoTransaksi) as JmlTransaksi, NmPelanggan From Transaksi Inner join Pelanggan on Pelanggan.KdPelanggan = Transaksi.KdPelanggan Group by NmPelanggan`

**Answer: D.** `COUNT(Transaksi.NoTransaksi)` counts non-null transaction numbers per customer. `COUNT(*)` (option A) also works but counts all rows regardless of nulls. `SUM` and `AVG` make no sense on a transaction ID column. The key pattern is:

- `COUNT` for counting
- `GROUP BY` with the non-aggregated column (`NmPelanggan`)

---

### Question 9

What syntax displays KdProduk, NmProduk, and total Jumlah sold for each product?

A. `Select KdProduk, NmProduk, SUM(Transaksi.Jumlah) From Produk Inner Join Transaksi on Produk.KdProduk = Transaksi.KdProduk Group by KdProduk, NmProduk`

B. `Select KdProduk, NmProduk, COUNT(Transaksi.*) From Produk Inner Join Transaksi on Produk.KdProduk = Transaksi.KdProduk Group by KdProduk`

C. `Select KdProduk, NmProduk, COUNT(Transaksi.Jumlah) From Produk Inner Join Transaksi on Produk.KdProduk = Transaksi.KdProduk Group by KdProduk`

D. `Select KdProduk, NmProduk, AVG(Transaksi.Jumlah) From Produk Inner Join Transaksi on Produk.KdProduk = Transaksi.KdProduk Group by KdProduk`

**Answer: A.** The question asks for "total Jumlah" (sum of quantity), so `SUM()` is the correct aggregate. `COUNT()` counts rows. `AVG()` computes the average. Also, when selecting `NmProduk` alongside a grouped `KdProduk`, modern SQL requires `NmProduk` to also appear in `GROUP BY`.

Expected result:

| KdProduk | NmProduk | SUM(Jumlah) |
|----------|----------|-------------|
| PRD01 | INDOMIE GORENG 85 GR | 75 |
| PRD02 | BERAS ROJOLELE 5 KG | 50 |
| PRD03 | KOPI KAPAL API 200 GR | 50 |

---

### Question 10

What syntax updates the NoTransaksi to T-010 for the transaction with product PRD01 and Jumlah 60?

A. `SELECT NoTransaksi = 'T-010' From Transaksi Where KdProduk='PRD01' AND Jumlah=60`

B. `INSERT Transaksi SET NoTransaksi = 'T-010' Where KdProduk='PRD01' AND Jumlah=60`

C. `UPDATE Transaksi SET NoTransaksi = 'T-010' Where KdProduk='PRD01' AND Jumlah=60`

D. `DELETE Transaksi SET Where KdProduk='PRD01' AND Jumlah=60 AND NoTransaksi = 'T-010'`

**Answer: C.** `UPDATE table SET column = value WHERE condition` is the correct DML syntax. `SELECT` cannot modify data. `INSERT` adds new rows, not modify existing ones. `DELETE` removes rows.

---

### Question 11

What syntax updates Jumlah to 100 for all customers located in JKT?

A. `UPDATE Transaksi.Jumlah = 100 Where KdPelanggan = (SELECT KdPelanggan From Pelanggan Where Pelanggan.KdPelanggan = Transaksi.KdPelanggan AND Pelanggan.Kota = 'JKT')`

B. `UPDATE Transaksi SET Jumlah = 100 Where KdPelanggan = (SELECT KdPelanggan From Pelanggan Where Pelanggan.Kota = 'JKT')`

C. `UPDATE Transaksi SET Jumlah = 100 Where SELECT KdPelanggan From Pelanggan Where Pelanggan.KdPelanggan = Transaksi.KdPelanggan AND Pelanggan.Kota = 'JKT'`

D. `UPDATE Transaksi SET Jumlah = 100 Where KdPelanggan IN (SELECT KdPelanggan From Pelanggan Where Pelanggan.Kota = 'JKT')`

**Answer: D.** Since multiple customers may be in JKT (Warung Makan and Ap. Keluarga), the subquery returns multiple rows. The `=` operator expects exactly one row, so you must use `IN`. The syntax is:

- `UPDATE table SET column = value WHERE column IN (subquery)`

---

### Question 12

What syntax deletes the Pelanggan data with KdPelanggan 723456?

A. `Delete From Pelanggan Where KdPelanggan = '723456'`

B. `Delete * From Pelanggan Where KdPelanggan = '723456'`

C. `Delete Pelanggan Where KdPelanggan = '723456'`

D. `Delete * From Pelanggan KdPelanggan = '723456'`

**Answer: A.** The correct DML syntax is `DELETE FROM table WHERE condition`. You do not use `*` with `DELETE` (unlike `SELECT *`). `DELETE Pelanggan` without `FROM` is also incorrect.

---

### Question 13

What syntax inserts new data into the Produk table with the following values: KdProduk = 'PRD04', NmProduk = 'MINYAK GORENG BIMOLI 2L', Stok = 75?

A. `INSERT INTO Produk (KdProduk, NmProduk, Stok) VALUES ('PRD04', 'MINYAK GORENG BIMOLI 2L', 75)`

B. `INSERT * INTO Produk (KdProduk, NmProduk, Stok) VALUES ('PRD04', 'MINYAK GORENG BIMOLI 2L', 75)`

C. `INSERT INTO Produk.* VALUES ('PRD04', 'MINYAK GORENG BIMOLI 2L', 75)`

D. `INSERT Produk (KdProduk, NmProduk, Stok) VALUES ('PRD04', 'MINYAK GORENG BIMOLI 2L', 75)`

**Answer: A.** The full syntax is `INSERT INTO table (columns) VALUES (values)`. Option D is missing `INTO`. Options B and C incorrectly use `*`.

---

### Question 14

Which of the following is NOT a looping statement?

A. `if-else`

B. `while`

C. `do-while`

D. `for`

**Answer: A.** `if-else` is a **selection/conditional** statement (branching), not a loop. `while`, `do-while`, and `for` all repeat a block of code.

---

### Question 15

Which of the following are selection statements?

A. `if-else`

B. `switch-case`

C. Both A and B are correct

D. All answers are wrong

**Answer: C.** Both `if-else` and `switch-case` are selection/conditional statements used to branch execution based on conditions.

---

### Question 16

DDL (Data Definition Language) is used to create, modify, and delete database objects. Which of the following is the correct set?

A. `Insert, Update, Drop`

B. `Insert, Update, Delete`

C. `Create, Alter, Delete`

D. `Create, Alter, Drop`

**Answer: D.** DDL = `CREATE`, `ALTER`, `DROP`. `INSERT`, `UPDATE`, `DELETE` are DML (Data Manipulation Language). Note that `DELETE` (DML, removes rows) is different from `DROP` (DDL, removes entire objects).

---

### Question 17

The purpose of an Array is:

A. Store multiple data of different types grouped together

B. Store multiple data of the same type

C. Store one piece of data of different types

D. Store one piece of data of the same type grouped together

**Answer: B.** An array is a data structure that stores a fixed number of elements, all of the **same type**, in contiguous memory. The key word is "same type."

---

### Question 18

To end all transactions and make them permanent, use:

A. `Save`

B. `Rollback`

C. `Update`

D. `Commit`

**Answer: D.** `COMMIT` saves all changes permanently. `ROLLBACK` undoes them. `SAVEPOINT` marks a rollback point. `UPDATE` is a DML command, not a transaction control keyword.

---

### Question 19

Which query is correct?

A.
```sql
SELECT KdProduk, SUM(Stok) AS "Total Stok"
FROM Produk
```

B.
```sql
SELECT KdProduk, SUM(Stok) AS "Total Stok"
FROM Produk
GROUP BY KdProduk;
```

C.
```sql
SELECT KdProduk, SUM(Stok) AS "Total Stok"
FROM Produk
ORDER BY KdProduk;
```

D.
```sql
SELECT KdProduk, SUM(Stok) AS "Total Stok"
FROM Produk
HAVING BY KdProduk;
```

**Answer: B.** When you mix a regular column (`KdProduk`) with an aggregate function (`SUM()`), you **must** use `GROUP BY`. `HAVING BY` is invalid syntax (should be `GROUP BY` with optional `HAVING`). `ORDER BY` sorts but does not group.

---

### Question 20

Given the query:

```sql
SELECT KdProduk, COUNT(*)
FROM Transaksi
WHERE KdProduk = 'PRD01'
GROUP BY KdProduk;
```

What is the output?

A. 1

B. 2

C. 3

D. 4

**Answer: B.** In the Transaksi table, `PRD01` appears twice: T-001 (Jumlah 15) and T-003 (Jumlah 60). So `COUNT(*)` returns 2.

---

### Essay: Question 21

Write a query to display NoTransaksi, TglTransaksi, NmPelanggan, NmProduk, Jumlah for customers located in YOG with Jumlah greater than 30.

**Answer:**

```sql
SELECT
    Transaksi.NoTransaksi,
    Transaksi.TglTransaksi,
    Pelanggan.NmPelanggan,
    Produk.NmProduk,
    Transaksi.Jumlah
FROM Transaksi
INNER JOIN Pelanggan ON Transaksi.KdPelanggan = Pelanggan.KdPelanggan
INNER JOIN Produk ON Transaksi.KdProduk = Produk.KdProduk
WHERE Pelanggan.Kota = 'YOG' AND Transaksi.Jumlah > 30
ORDER BY Transaksi.NoTransaksi;
```

Key points:
- Join all three tables: `Transaksi → Pelanggan` and `Transaksi → Produk`
- Filter by `Pelanggan.Kota = 'YOG'` and `Transaksi.Jumlah > 30`
- Use table prefixes to disambiguate column names

---

### Question 22

What is the output of the query from Question 21?

**Answer:**

| NoTransaksi | TglTransaksi | NmPelanggan | NmProduk | Jumlah |
|-------------|-------------|-------------|----------|--------|
| T-004 | 12/5/2020 | Tk. Barokah | KOPI KAPAL API 200 GR | 50 |

Only T-004 matches: it is by Tk. Barokah (Kota = YOG) and has Jumlah = 50 (> 30). T-001 also involves Tk. Barokah but Jumlah = 15 which is not greater than 30.

---

### Question 23

What is the output of the query below?

```plsql
BEGIN
    names := names_array('Gibran', 'Natha', 'Nara', 'Halona', 'Anast');
    marks := grades(98, 97, 78, 87, 92);
    total := names.count;
    dbms_output.put_line('Total ' || total || ' Students');
    FOR i in 1 .. total LOOP
        IF marks(i) > 85 THEN
            dbms_output.put_line('Student: ' || names(i) || ' Marks: ' || marks(i));
        END IF;
    END LOOP;
END;
```

**Answer:**

```
Total 5 Students
Student: Gibran Marks: 98
Student: Natha Marks: 97
Student: Halona Marks: 87
Student: Anast Marks: 92
```

Explanation: The loop iterates through 5 students. The `IF marks(i) > 85` condition filters out students with marks ≤ 85. Nara (78) is excluded. The output shows the total count first, then each qualifying student on a new line.

---

### Question 24

There are 6 cities: A, B, C, D, E, F with distances:

| Route | Distance |
|-------|----------|
| A → B | 2 |
| A → C | 4 |
| B → D | 7 |
| C → D | 1 |
| C → E | 3 |
| D → F | 5 |
| E → F | 2 |

Additional rules:
- You must pass through city C before reaching F.
- You may not pass through D if the total distance upon entering D exceeds 8.

**Find the shortest route from A to F following the rules.**

**Answer: A → C → E → F = 9**

Let us evaluate all valid paths:

**Path A → C → E → F:**
- A → C = 4
- C → E = 3 (cumulative: 7)
- E → F = 2 (cumulative: 9)
- **Total: 9** ✓ (C passed, D avoided)

**Path A → B → D → F (invalid):** Does not pass through C. Rule violated.

**Path A → C → D → F:**
- A → C = 4
- C → D = 1 (cumulative when entering D = 5)
- 5 ≤ 8, so entering D is allowed
- D → F = 5 (cumulative: 10)
- **Total: 10** but the shortest valid path is 9

**Path A → B → D → F** would require going through C first, but there is no edge connecting B to C, making this path invalid under the first rule.

Therefore, the shortest valid route is **A → C → E → F with total distance 9**.

---

### Question 25

A store with sales channel "kelontong" buying product A:
- 10–20 units: 2% discount
- More than 20 units: 3% discount

A store with sales channel "apotik" buying product A:
- More than 20 units: 2% discount

Write a nested `IF` logic in Java.

**Answer:**

```java
public double calculateDiscount(String salesChannel, int quantity, double price) {
    double discount = 0;

    if ("apotik".equalsIgnoreCase(salesChannel)) {
        if (quantity > 20) {
            discount = price * 2 / 100;
        }
    } else if ("kelontong".equalsIgnoreCase(salesChannel)) {
        if (quantity >= 10 && quantity <= 20) {
            discount = price * 2 / 100;
        } else if (quantity > 20) {
            discount = price * 3 / 100;
        }
    }

    return discount;
}
```

- Check for `apotik` first, then `kelontong` (order does not matter here since they are mutually exclusive)
- The inner `if` for `kelontong` checks two ranges: 10–20 (2%) and >20 (3%)
- No discount for 1–9 units regardless of channel
- `equalsIgnoreCase` avoids case-sensitivity issues

---

