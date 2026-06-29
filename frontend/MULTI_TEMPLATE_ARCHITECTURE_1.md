# MULTI-TEMPLATE HOMEPAGE ARCHITECTURE
## Business Logic ↔ Presentation Isolation Protocol

**Core Principle**: Business ideas, copy, and structure are immutable across templates. Templates are **presentation wrappers** that consume a contract-based API. No template code bleeds into business logic.

---

## 1. The Business Domain (Immutable Layer)

### 1.1 Canonical Business Content Structure

All business messaging lives in a **single, version-controlled source**. This is the source of truth for *all* templates.

```
src/
├─ business/                          # SACRED: Never touched by template design
│   ├─ homepages/
│   │   ├─ homepage.config.js         # Master business definitions
│   │   ├─ homepage.schema.js         # Pydantic schemas (backend)
│   │   └─ messages.constants.js       # Fixed copy, CTAs, messaging
│   │
│   ├─ sections/
│   │   ├─ heroSection.business.js     # "Hero" business logic
│   │   ├─ featuresSection.business.js
│   │   ├─ pricingSection.business.js
│   │   └─ footerSection.business.js
│   │
│   └─ index.js                        # Barrel export: all business definitions
```

### 1.2 Homepage Business Definition (Immutable)

```javascript
// src/business/homepages/homepage.config.js

export const HOMEPAGE_SECTIONS = {
  HERO: {
    id: 'hero',
    type: 'hero',
    required: true,
    businessData: {
      headline: 'Transform Your Workflow',
      subheadline: 'Ship faster. Break less.',
      cta: {
        primary: { text: 'Get Started', href: '/signup', action: 'signup' },
        secondary: { text: 'Learn More', href: '/docs', action: 'learn' },
      },
    },
  },
  
  FEATURES: {
    id: 'features',
    type: 'features',
    required: true,
    businessData: {
      title: 'Core Capabilities',
      items: [
        {
          id: 'feature-1',
          name: 'Real-Time Sync',
          description: 'Instant data propagation across all nodes',
          metadata: { category: 'performance', priority: 1 },
        },
        {
          id: 'feature-2',
          name: 'Intelligent Routing',
          description: 'ML-powered request optimization',
          metadata: { category: 'reliability', priority: 2 },
        },
      ],
    },
  },

  PRICING: {
    id: 'pricing',
    type: 'pricing',
    required: false,
    businessData: {
      title: 'Simple, Transparent Pricing',
      plans: [
        {
          id: 'plan-starter',
          name: 'Starter',
          price: 99,
          currency: 'USD',
          billingPeriod: 'month',
          description: 'For individuals and small teams',
          features: ['Up to 10 users', 'Community support'],
          cta: { text: 'Start Free Trial', action: 'trial-starter' },
        },
      ],
    },
  },

  FOOTER: {
    id: 'footer',
    type: 'footer',
    required: true,
    businessData: {
      company: {
        name: 'YourCompany',
        tagline: 'Building the future of distributed systems',
      },
      links: {
        product: [
          { label: 'Features', href: '/features' },
          { label: 'Pricing', href: '/pricing' },
        ],
        company: [
          { label: 'About', href: '/about' },
          { label: 'Blog', href: '/blog' },
        ],
      },
      legal: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
      ],
    },
  },
};

// Version tracking for templates to detect stale contracts
export const BUSINESS_VERSION = '1.0.0';
export const LAST_UPDATED = '2026-06-29';
```

### 1.3 Messages Constants (Fixed Copy)

```javascript
// src/business/homepages/messages.constants.js

export const COPY = {
  HERO: {
    MAIN_HEADLINE: 'Transform Your Workflow',
    SUBHEADLINE: 'Ship faster. Break less.',
    PRIMARY_CTA: 'Get Started',
    SECONDARY_CTA: 'Learn More',
  },
  
  FEATURES: {
    SECTION_TITLE: 'Core Capabilities',
    SECTION_DESCRIPTION: 'Everything you need to scale without compromise',
  },

  PRICING: {
    SECTION_TITLE: 'Simple, Transparent Pricing',
    TRIAL_DURATION: '14 days free',
    MONEY_BACK: '30-day money-back guarantee',
  },

  FOOTER: {
    TAGLINE: 'Building the future of distributed systems',
    COPYRIGHT: '© 2026 YourCompany. All rights reserved.',
  },

  COMMON: {
    LOADING: 'Loading...',
    ERROR: 'Something went wrong. Please try again.',
    SUCCESS: 'Success!',
  },
};

export const ACTIONS = {
  SIGNUP: 'homepage.action.signup',
  LEARN: 'homepage.action.learn',
  TRIAL: 'homepage.action.trial',
  PRICING_VIEW: 'homepage.action.pricing.view',
};
```

---

## 2. The Template Layer (Presentation Only)

### 2.1 Template Directory Structure

Templates are **isolated, self-contained wrappers** that consume business data via a contract (Props Interface).

```
src/
├─ templates/
│   ├─ stitch-minimal/                 # Template A: Stitch-based minimal design
│   │   ├─ index.js                    # Template selector
│   │   │
│   │   ├─ pages/
│   │   │   └─ HomePage.jsx            # Entry point (composes sections)
│   │   │
│   │   ├─ sections/
│   │   │   ├─ HeroSection.jsx         # Stitch hero (consumes hero contract)
│   │   │   ├─ FeaturesSection.jsx
│   │   │   ├─ PricingSection.jsx
│   │   │   └─ FooterSection.jsx
│   │   │
│   │   ├─ components/
│   │   │   ├─ StitchButton.jsx        # Template-specific UI primitives
│   │   │   ├─ StitchCard.jsx
│   │   │   └─ StitchGrid.jsx
│   │   │
│   │   ├─ styles/
│   │   │   ├─ stitch-minimal.module.css
│   │   │   └─ tokens.stitch-minimal.css  # Template color palette
│   │   │
│   │   └─ manifest.json               # Template metadata & business contract
│   │
│   ├─ darkwave-tech/                  # Template B: Dark/techy aesthetic
│   │   ├─ ... (same structure)
│   │   └─ manifest.json
│   │
│   └─ clean-corporate/                # Template C: Corporate minimal
│       ├─ ... (same structure)
│       └─ manifest.json
```

### 2.2 Template Manifest (The Contract)

Each template declares **what business data it expects** and **what version it was built for**.

```json
{
  "name": "stitch-minimal",
  "version": "1.0.0",
  "businessVersion": "1.0.0",
  "description": "Clean, minimal Stitch-based homepage template",
  "author": "template-dev",
  "supportedSections": ["HERO", "FEATURES", "PRICING", "FOOTER"],
  "requiredSections": ["HERO", "FOOTER"],
  "colorScheme": "light",
  "colorPrimary": "#2563eb",
  "colorSecondary": "#64748b",
  "colorAccent": "#f59e0b",
  "customTokens": {
    "fontFamily": "'Inter', sans-serif",
    "borderRadius": "8px",
    "spacing": "16px"
  }
}
```

### 2.3 Section Component Contract (Props Interface)

Every section component in a template **must accept a standardized props object** derived from `HOMEPAGE_SECTIONS`.

```javascript
// src/templates/stitch-minimal/sections/HeroSection.jsx

import styles from './HeroSection.module.css';

/**
 * BUSINESS CONTRACT:
 * Accepts { headline, subheadline, cta: { primary, secondary } }
 * from src/business/homepages/homepage.config.js
 * 
 * Template may style, arrange, or hide elements.
 * Template MUST NOT modify business data.
 */

export function HeroSection({ 
  headline,      // ← Business data (immutable)
  subheadline,   // ← Business data (immutable)
  cta,           // ← Business CTAs (immutable)
  onAction,      // ← Callback for business event tracking
}) {
  return (
    <section className={styles.heroContainer} data-section="hero">
      <div className={styles.heroContent}>
        <h1 className={styles.heroHeadline}>{headline}</h1>
        <p className={styles.heroSubheadline}>{subheadline}</p>
        
        <div className={styles.ctaGroup}>
          <button 
            className={styles.primaryCta}
            onClick={() => onAction(cta.primary.action)}
          >
            {cta.primary.text}
          </button>
          <button 
            className={styles.secondaryCta}
            onClick={() => onAction(cta.secondary.action)}
          >
            {cta.secondary.text}
          </button>
        </div>
      </div>
    </section>
  );
}

// PropTypes or TypeScript interface for enforcement
HeroSection.propTypes = {
  headline: PropTypes.string.isRequired,
  subheadline: PropTypes.string.isRequired,
  cta: PropTypes.shape({
    primary: PropTypes.shape({
      text: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
    }).isRequired,
    secondary: PropTypes.shape({
      text: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onAction: PropTypes.func.isRequired,
};
```

### 2.4 Template Colors: Distinct & Observable

To keep templates visually **distinct without contaminating business logic**, use a **template-specific color variables file**.

```css
/* src/templates/stitch-minimal/styles/tokens.stitch-minimal.css */

/* Template Identifier: Ensure visual uniqueness */
:root {
  /* TEMPLATE IDENTITY: These colors are unique to "stitch-minimal" */
  --template-name: 'stitch-minimal';
  --template-primary: #2563eb;      /* Blue (business can see this is Stitch) */
  --template-secondary: #64748b;    /* Slate */
  --template-accent: #f59e0b;       /* Amber */
  --template-bg: #ffffff;
  --template-text: #1e293b;
  --template-border: #e2e8f0;
  
  /* Typography */
  --template-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --template-font-size-base: 16px;
  --template-line-height-base: 1.5;
}

/* SCOPED BUSINESS SECTION STYLING (Visible markers) */
[data-section="hero"] {
  border-top: 4px solid var(--template-primary);
}

[data-section="features"] {
  border-top: 4px solid var(--template-secondary);
}

[data-section="pricing"] {
  border-top: 4px solid var(--template-accent);
}

[data-section="footer"] {
  border-top: 4px solid var(--template-primary);
}
```

This way:
- **Business teams** see each section is from a specific template (color-coded).
- **Engineers** can instantly swap templates without touching business logic.
- **Color changes** are localized to template files only.

---

## 3. The Composition Layer (Business ↔ Template Bridge)

### 3.1 Homepage Composer (Orchestrates Business + Template)

```javascript
// src/features/Homepage/HomePage.jsx

import { useHomepageLogic } from './useHomepageLogic';
import { HOMEPAGE_SECTIONS } from '@/business/homepages/homepage.config';
import { useTemplateLoader } from '@/hooks/useTemplateLoader';

/**
 * HomePage is the CONDUCTOR:
 * 1. Loads business data from src/business/
 * 2. Loads template from src/templates/[templateName]/
 * 3. Composes them together
 * 
 * NO business logic lives here. NO template code lives here.
 */

export function HomePage() {
  const { selectedTemplate } = useHomepageLogic();
  const { HeroSection, FeaturesSection, PricingSection, FooterSection } = 
    useTemplateLoader(selectedTemplate);

  const handleBusinessAction = (actionId) => {
    console.log(`[BUSINESS EVENT] ${actionId}`);
    // Track analytics, send to backend, etc.
  };

  return (
    <>
      <HeroSection
        headline={HOMEPAGE_SECTIONS.HERO.businessData.headline}
        subheadline={HOMEPAGE_SECTIONS.HERO.businessData.subheadline}
        cta={HOMEPAGE_SECTIONS.HERO.businessData.cta}
        onAction={handleBusinessAction}
      />

      <FeaturesSection
        title={HOMEPAGE_SECTIONS.FEATURES.businessData.title}
        items={HOMEPAGE_SECTIONS.FEATURES.businessData.items}
        onAction={handleBusinessAction}
      />

      <PricingSection
        title={HOMEPAGE_SECTIONS.PRICING.businessData.title}
        plans={HOMEPAGE_SECTIONS.PRICING.businessData.plans}
        onAction={handleBusinessAction}
      />

      <FooterSection
        company={HOMEPAGE_SECTIONS.FOOTER.businessData.company}
        links={HOMEPAGE_SECTIONS.FOOTER.businessData.links}
        legal={HOMEPAGE_SECTIONS.FOOTER.businessData.legal}
      />
    </>
  );
}
```

### 3.2 Template Loader Hook (Dynamic Template Resolution)

```javascript
// src/hooks/useTemplateLoader.js

import { useMemo } from 'react';
import { BUSINESS_VERSION } from '@/business/homepages/homepage.config';

export function useTemplateLoader(templateName) {
  return useMemo(() => {
    // Dynamically import template based on selection
    const template = require(`@/templates/${templateName}`);

    // VALIDATION: Check business version compatibility
    const manifest = require(`@/templates/${templateName}/manifest.json`);
    
    if (manifest.businessVersion !== BUSINESS_VERSION) {
      console.warn(
        `⚠️ Template "${templateName}" (v${manifest.businessVersion}) may not be compatible with business layer (v${BUSINESS_VERSION})`
      );
    }

    return {
      HeroSection: template.HeroSection,
      FeaturesSection: template.FeaturesSection,
      PricingSection: template.PricingSection,
      FooterSection: template.FooterSection,
      manifest,
    };
  }, [templateName]);
}
```

---

## 4. Template Addition & Modification Workflow

### 4.1 Adding a New Template (No Business Impact)

```bash
# 1. Create template directory
mkdir -p src/templates/new-template/{pages,sections,components,styles}

# 2. Create manifest
cat > src/templates/new-template/manifest.json << 'EOF'
{
  "name": "new-template",
  "version": "1.0.0",
  "businessVersion": "1.0.0",
  "supportedSections": ["HERO", "FEATURES", "PRICING", "FOOTER"],
  "requiredSections": ["HERO", "FOOTER"],
  "colorPrimary": "#YOUR_COLOR"
}
EOF

# 3. Create section components (must match prop interface from business)
# HeroSection.jsx, FeaturesSection.jsx, etc.

# 4. Create scoped CSS with template-specific colors
# styles/tokens.new-template.css

# 5. Export from index.js
cat > src/templates/new-template/index.js << 'EOF'
export { HeroSection } from './sections/HeroSection';
export { FeaturesSection } from './sections/FeaturesSection';
export { PricingSection } from './sections/PricingSection';
export { FooterSection } from './sections/FooterSection';
EOF

# 6. Test: Switch template in HomePage
// Change: const { selectedTemplate } = 'new-template';
```

**Impact on business layer**: ✅ ZERO (only new files created, no business files touched)

### 4.2 Modifying Template (No Business Impact)

Update colors, spacing, layout in template files only:

```css
/* src/templates/stitch-minimal/styles/tokens.stitch-minimal.css */
/* Change colors → only this file affected */
--template-primary: #ff0000;  /* ← Change here, business unaffected */
```

**Impact on business layer**: ✅ ZERO

### 4.3 Deleting a Template (No Business Impact)

```bash
rm -rf src/templates/old-template
# Update template selector UI to not list this option
```

**Impact on business layer**: ✅ ZERO

---

## 5. Modifying Business Data (Templates Auto-Adapt)

### 5.1 Adding a New Business Section

```javascript
// src/business/homepages/homepage.config.js

export const HOMEPAGE_SECTIONS = {
  // ... existing sections ...
  
  TESTIMONIALS: {
    id: 'testimonials',
    type: 'testimonials',
    required: false,
    businessData: {
      title: 'Trusted by Industry Leaders',
      testimonials: [
        {
          id: 'testimonial-1',
          quote: 'This transformed our delivery pipeline.',
          author: 'Jane Doe',
          company: 'TechCorp',
          role: 'VP Engineering',
        },
      ],
    },
  },
};
```

Each template can now **optionally** support this section:

```javascript
// src/templates/stitch-minimal/sections/TestimonialsSection.jsx

export function TestimonialsSection({ title, testimonials, onAction }) {
  return (
    <section className={styles.testimonialsContainer} data-section="testimonials">
      <h2 className={styles.testimonialsTitle}>{title}</h2>
      {/* Render testimonials */}
    </section>
  );
}
```

Old templates that don't have this component simply won't render it. **No breaking changes.**

---

## 6. Validation & Guardrails

### 6.1 Build-Time Checks (Prevent Contamination)

Create a linter rule to block cross-layer imports:

```javascript
// .eslintrc.cjs

module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['src/templates/*/'],
            message: 'Templates cannot be imported outside src/templates/ or src/features/Homepage/',
          },
          {
            group: ['src/business/*/pages/**'],
            message: 'Business pages are immutable. Modify via business layer only.',
          },
        ],
      },
    ],
  },
};
```

### 6.2 Runtime Type Checking (Props Validation)

```javascript
import PropTypes from 'prop-types';

export const HERO_SECTION_PROPS = {
  headline: PropTypes.string.isRequired,
  subheadline: PropTypes.string.isRequired,
  cta: PropTypes.shape({
    primary: PropTypes.shape({
      text: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
      href: PropTypes.string,
    }).isRequired,
    secondary: PropTypes.shape({
      text: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
      href: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onAction: PropTypes.func.isRequired,
};

HeroSection.propTypes = HERO_SECTION_PROPS;
```

---

## 7. Visual Distinction Strategy (Templates Are Observable)

### 7.1 Section Border Markers

Each business section gets a colored top border showing which template is rendering it:

```css
/* Stitch Minimal */
[data-section="hero"] {
  border-top: 4px solid #2563eb;  /* Blue = Stitch */
}

/* Dark Wave Tech */
[data-template="darkwave-tech"][data-section="hero"] {
  border-top: 4px solid #10b981;  /* Green = Dark Wave */
}

/* Corporate Clean */
[data-template="clean-corporate"][data-section="hero"] {
  border-top: 4px solid #6366f1;  /* Indigo = Corporate */
}
```

**Result**: Non-technical stakeholders can instantly see "this hero section is from the Stitch template" without reading code.

### 7.2 Data Attributes for Inspection

```jsx
<section 
  className={styles.heroContainer}
  data-section="hero"
  data-template="stitch-minimal"
  data-business-version="1.0.0"
>
  {/* Content */}
</section>
```

Browser DevTools → Inspect → See which template and business version is active.

---

## 8. Workflow Summary

| Action | Business Layer | Template Layer | Impact |
|--------|---|---|---|
| **Add template** | — | Create new template dir | ✅ Zero impact |
| **Change template colors** | — | Edit `tokens.*.css` | ✅ Zero impact |
| **Delete template** | — | Remove template dir | ✅ Zero impact |
| **Update business copy** | Edit `messages.constants.js` | — | ✅ All templates auto-update |
| **Add business section** | Edit `homepage.config.js` | Optional: add section component | ✅ Backward compatible |
| **Modify business CTA** | Edit `homepage.config.js` | — | ✅ All templates auto-update |
| **Update business version** | Increment `BUSINESS_VERSION` | Update `manifest.json` | ✅ Version-checked at runtime |

---

## 9. Key Principles Recap

1. **Business is immutable** — Lives in `src/business/`, never touched by template code.
2. **Templates are replaceable** — New template can be added/removed without touching business.
3. **Contracts are explicit** — Props interfaces are well-defined and versioned.
4. **Colors are visible markers** — Each template has a distinct color scheme that clearly signals which template is active.
5. **No cross-contamination** — Linting rules prevent templates from importing/modifying business code.
6. **Composition, not configuration** — Complex variations use composable sub-components, not prop overload.

---

## References

- **Separation of Concerns**: Business logic is data/intent. Presentation is visual arrangement.
- **Contract-Based Development**: Templates consume a well-defined API (props shape).
- **Dependency Inversion**: HomePage depends on abstractions (HOMEPAGE_SECTIONS), not concrete templates.
- **Versioning Strategy**: Business version is tracked to prevent silent incompatibilities.
