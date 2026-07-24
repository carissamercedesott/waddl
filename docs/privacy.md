# Privacy

> Licensed under CC BY 4.0 (see [LICENSE-CC-BY-4.0.md](LICENSE-CC-BY-4.0.md)).

Waddl studies how people learn while coding. That inherently involves
observing behavior, so privacy is a first-class design constraint, not an
afterthought. This document describes our commitments. It will be kept in
sync with what the software actually does; where the two ever diverge,
that is a bug — please report it.

## Principles

1. **Data minimization.** We collect the least data needed to answer a
   specific, pre-registered research question — nothing "just in case."
2. **Informed and voluntary.** No study data is collected without clear,
   opt-in consent that explains what is collected, why, and how it is
   used. Participation can be withdrawn.
3. **Local first.** The learner model and interaction logic run locally
   where feasible. Data does not leave the developer's machine unless the
   participant explicitly opts into a study that requires it.
4. **No secrets, no PII in the repo.** Raw study data, personal
   information, and credentials are never committed to this repository.
   Only anonymized/aggregated results are shared, per an approved
   protocol.
5. **Anonymization and aggregation.** Any shared or published data is
   de-identified and, wherever possible, aggregated so individuals cannot
   be re-identified.
6. **Transparency.** Protocols, the data schema, and analysis plans are
   published openly before collection begins.

## What might be collected in a study (illustrative)

Only when a participant opts into a specific study, and only as its
protocol specifies — for example:

- Which interaction patterns were shown and which were used (e.g. hint
  level requested).
- Coarse task outcomes and timing.
- Optional self-reported understanding or reflection responses.

## What we do **not** do

- Sell or monetize participant data.
- Use data to profile individuals outside of the stated research.
- Retain raw data longer than the protocol requires.
- Send code or keystrokes anywhere without explicit, study-specific
  consent.

## Your rights as a participant

- Ask what data a study collects before joining.
- Withdraw and request deletion of your identifiable data.
- Read the protocol and analysis plan in advance.

## Contact

Privacy questions or concerns: open a confidential issue, or contact the
maintainer via their GitHub profile.

_This document describes research-project practices and is not a legal
privacy policy for a commercial product._
