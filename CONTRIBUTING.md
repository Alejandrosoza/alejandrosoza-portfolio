# Contributing

## Branch Naming

- `main` — production-ready, always deployable.
- `feature/<short-description>` — new features or pages (e.g. `feature/films-grid`).
- `fix/<short-description>` — bug fixes (e.g. `fix/contact-form-validation`).
- `chore/<short-description>` — tooling, config, or dependency updates.

## Commit Messages

Use short, imperative, present-tense messages prefixed with a type:

```
feat: add film detail page layout
fix: correct hreflang alternates for /fr routes
chore: bump next-intl to latest
docs: update README setup steps
```

## Pull Request Process

1. Create a branch from `main` using the naming convention above.
2. Make your changes, ensuring `npm run build` and `npm run lint` pass.
3. Open a pull request into `main` with a clear description of what
   changed and why.
4. Address review feedback before merging.
5. Squash-merge once approved.
