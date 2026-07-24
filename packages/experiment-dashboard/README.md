# @waddl/experiment-dashboard

A dashboard for exploring **anonymized, aggregated** results from Waddl
studies.

> **Status: early scaffold.** Not yet functional.

## Purpose

Make study results transparent and easy to interpret — condition
comparisons, transfer/retention outcomes, and hint-usage patterns —
using only de-identified, aggregated data.

## Hard privacy constraints

This dashboard **never** ingests or displays raw participant data or PII.
It operates on anonymized, aggregated study outputs only, consistent with
[privacy.md](../../docs/privacy.md). Raw data is never committed to the
repository (see the root `.gitignore`).

## Planned layout

```text
experiment-dashboard/
├── src/            # dashboard app
├── public/
└── README.md
```

## Contributing

See the repo [CONTRIBUTING.md](../../CONTRIBUTING.md).
