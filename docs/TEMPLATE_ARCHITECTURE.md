# Template Architecture — Business ↔ Presentation Isolation

**Core principle:** Business content (text, copy, CTAs, messaging) is immutable across templates. Templates are presentation wrappers that consume a contract-based props interface. No template code modifies business content.

---

## 1. Layers

```
┌─────────────────────────────────┐
│  Business Layer (Immutable)     │  src/content/business/
│  Text, copy, CTAs, messaging    │  Single source of truth
├─────────────────────────────────┤
│  Composition Layer (Bridge)     │  Home/Home.jsx
│  Loads business data + template │  Passes data via props
├─────────────────────────────────┤
│  Template Layer (Swappable)     │  Home/templates/ (reference)
│  Styles, layout, animations     │  Home/components/ (active)
└─────────────────────────────────┘
```

---

## 2. Business Layer

All user-facing text lives in a single, version-controlled source. This is the source of truth for all templates.

### 2.1 Target Structure

```
src/content/business/
├── ui-strings.json          ← Navigation, buttons, labels
├── marketing-copy.json      ← Taglines, feature descriptions, hero text
├── legal-notices.json       ← ToS, privacy, disclaimers
└── error-messages.json      ← Validation and system error messages
```

**Current state:** Business text is still embedded in components (hardcoded in JSX). Extraction to `src/content/business/` is planned but not yet implemented.

### 2.2 Rules

- Business content is **never** modified by template code.
- Templates may style, arrange, or hide business elements — but must render the text exactly.
- Version changes to business content automatically propagate to all templates.

---

## 3. Template Layer

Templates are isolated, self-contained wrappers that consume business data via props.

### 3.1 Current Implementation

Active home page components live in `Home/components/`. Reference design variants live in `Home/templates/` as static HTML files for visual comparison — they are not imported into the React tree.

### 3.2 Template Rules

- Templates own styles only. No business logic, no API calls, no text generation.
- All CSS uses the `ath-*` prefix to prevent class collisions.
- Templates use `data-section` attributes for inspection:
  ```jsx
  <section data-section="hero" className="ath-hero">
  ```
- Template-specific colour palettes live in CSS custom properties, scoped per template.

### 3.3 Adding a New Template

1. Create reference HTML in `Home/templates/`.
2. Build React components in `Home/components/`, consuming business data via props.
3. Use `ath-*` prefix for all new CSS classes.
4. Migrate one component at a time. Test after each.
5. Delete old patterns only after new ones are verified.

**Impact on business layer:** Zero.

### 3.4 Modifying a Template

Change styles, spacing, colours in template CSS only. Business data passes through unchanged.

**Impact on business layer:** Zero.

---

## 4. Composition Layer

The orchestrator (`Home/Home.jsx`) is the bridge:

1. Loads business data (currently hardcoded; target: from `src/content/business/`).
2. Loads template components from `Home/components/`.
3. Passes business data as props.
4. Contains no business logic and no template code.

---

## 5. Props Contract

Every section component must accept a standardized props shape derived from the business data. PropTypes enforce the contract at runtime.

```jsx
HeroSection.propTypes = {
  headline: PropTypes.string.isRequired,
  subheadline: PropTypes.string.isRequired,
  cta: PropTypes.shape({
    primary: PropTypes.shape({
      text: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onAction: PropTypes.func.isRequired,
};
```

---

## 6. Template Merge Workflow

When integrating a new external design (from Figma, AI tools, or premade templates):

### Pre-merge
- [ ] Snapshot current site (component list, visible text, colour system)
- [ ] Verify all business text is extracted or documented
- [ ] Audit old template patterns for unused code
- [ ] Document breaking changes from old → new

### During merge
- [ ] Create feature branch: `git checkout -b feature/template-integration-v2`
- [ ] Import new template files alongside old (no deletions yet)
- [ ] Migrate one component at a time
- [ ] Commit each migration separately with clear messages
- [ ] Run `npm run build` after each migration

### Post-merge
- [ ] Verify all old template references removed
- [ ] All business content renders correctly
- [ ] No CSS conflicts or orphaned styles
- [ ] Build and tests pass
- [ ] Delete old template files in a separate commit

### Rollback
```bash
git revert -m 1 <merge-commit-hash>
```

---

## 7. Impact Matrix

| Action | Business Layer | Template Layer | Impact |
|---|---|---|---|
| Add template | — | Create components + CSS | Zero |
| Change template colours | — | Edit CSS variables | Zero |
| Delete template | — | Remove files | Zero |
| Update business copy | Edit content JSON | — | All templates auto-update |
| Add business section | Edit content config | Optional: add component | Backward compatible |

---

## 8. Key Principles

1. **Business is immutable** — text lives in `content/business/`, never touched by template code.
2. **Templates are replaceable** — add or remove without touching business content.
3. **Contracts are explicit** — PropTypes define exactly what each section component expects.
4. **CSS is scoped** — `ath-*` prefix prevents cross-template contamination.
5. **Composition over configuration** — complex variations use composable sub-components, not prop overload.
