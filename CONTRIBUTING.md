# Contributing

Classical Atlas grows in two directions: richer classical content and better reading tools. Contributions should preserve source traceability and keep the app usable as a static site.

## Local Setup

```bash
pnpm install
pnpm dev
```

Before sending changes, run:

```bash
pnpm check
pnpm verify
pnpm build
```

If your local pnpm version is older than the repository's declared package manager, use:

```bash
pnpm --config.package-manager-strict=false check
pnpm --config.package-manager-strict=false verify
pnpm --config.package-manager-strict=false build
```

## Content Contributions

Use public-domain or clearly licensed source editions. Do not paste copyrighted modern translations, commentaries, or book excerpts unless their license explicitly allows reuse here.

For a content patch, include:

- the source edition or repository
- whether the text is public domain, openly licensed, or original project prose
- the affected work, chapter, hexagram, or line
- any known uncertainty about punctuation, variants, or attribution

## Where Content Lives

```text
src/components/atlas/data.ts       # core works, clauses, glossary, graph nodes, comparisons
src/components/atlas/hex.ts        # 64-hexagram table and transformations
src/components/atlas/hex-rest.ts   # generated hexagram source supplement
src/components/atlas/hex-gloss.ts  # original plain-language hexagram glosses
src/components/atlas/jizhu.ts      # generated historical commentary data
```

Generated files should be changed through their build scripts where possible.

## Writing Style

- Keep English documentation clear and searchable.
- Keep Chinese explanations concise, readable, and source-aware.
- Separate original explanation from source text.
- Prefer small, reviewable content batches over very large mixed edits.
- Avoid adding placeholder commentary that looks like real scholarship.

## Engineering Style

- Keep the app static-site friendly.
- Keep content data typed.
- Run `pnpm verify` after changing hexagrams, trigrams, source text, or generated content.
- Avoid unrelated refactors in content patches.
- When adding a public route or reading surface, make it reachable through the hash router and documented in the README if it is user-facing.
