# AGENTS.md
This file is the operating guide for coding and documentation agents in this repo.

## Scope
- Applies to the whole repository.
- Prefer repo-specific guidance here over generic agent defaults.
- This is primarily an Antora documentation site, not an application codebase.
- Most edits should be in AsciiDoc content under `docs/`.

## Rule Sources
- No `.cursorrules` file is present.
- No `.cursor/rules/` directory is present.
- No `.github/copilot-instructions.md` file is present.
- Treat this `AGENTS.md` as the authoritative agent guidance unless new rule files are added later.

## Repository Layout
- `antora-playbook.yml` defines the site build and output behavior.
- `docs/antora.yml` defines the Antora component metadata.
- `docs/modules/ROOT/pages/` contains page content.
- `docs/modules/ROOT/nav.adoc` defines left-nav structure and page ordering.
- `supplemental-ui/partials/` contains Handlebars partial overrides for the shared Antora UI.
- `build/` is generated output.
- `node_modules/` is installed dependency output.

## Installed Tooling
- Node dependencies are minimal: `@antora/cli` and `@antora/site-generator`.
- There is no first-party app runtime, no JS source tree, and no test framework configured.
- There is no ESLint, Prettier, TypeScript, Jest, Vitest, or Playwright config.
- Validation is primarily done by building the site successfully and reviewing generated pages.

## Commands
### Setup
- Install dependencies: `npm install`

### Build
- Standard build: `npm exec antora -- generate antora-playbook.yml --clean`
- Equivalent shorter form: `npx antora generate antora-playbook.yml --clean`
- Default output directory: `build/site`
- More verbose logging: `npm exec antora -- generate antora-playbook.yml --clean --log-level info`

### Lint
- No dedicated lint command exists.
- For this repo, a clean Antora build is the closest lint or smoke check.
- If a change affects navigation, links, or page syntax, run the full build.

### Test
- No automated test suite exists.
- There is no `npm test` script and no standalone test runner configuration.
- There is no true single-test command because no tests are defined.

### Single-page validation
- Antora does not provide a repo-local single-page build or test flow here.
- Build the full site, then inspect the relevant generated page under `build/site/weblibre/`.
- Example: `docs/modules/ROOT/pages/quick-start.adoc` -> `build/site/weblibre/quick-start.html`.
- For nested pages, keep the same relative structure, e.g. `docs/modules/ROOT/pages/privacy/overview.adoc` -> `build/site/weblibre/privacy/overview.html`.

### Recommended workflow
- Before editing, read the target page and nearby pages in the same section.
- If you add, remove, or rename a page, update `docs/modules/ROOT/nav.adoc` in the same change.
- After content changes, run the Antora build.
- After UI partial changes, run the Antora build and inspect the affected page visually if possible.

## Files Agents Should Usually Ignore
- Do not hand-edit `build/`; it is generated output.
- Do not hand-edit `node_modules/`.
- Avoid changing `package-lock.json` unless dependency work is intentional.

## Primary Content Conventions
- Use AsciiDoc, not Markdown, for pages under `docs/modules/ROOT/pages/`.
- Start each page with a level-0 title: `= Page Title`.
- Add a `:description:` attribute near the top of every page.
- Leave a blank line after the title and after the description attribute.
- Keep prose practical, direct, and user-facing.
- Write for end users of WebLibre, not for developers.
- Explain what a feature does, when to use it, and what tradeoffs to expect.
- Keep claims accurate and specific; avoid hype.

## Tone And Writing Style
- Use plain English.
- Prefer short-to-medium sentences.
- Be concrete and task-oriented.
- Prefer present tense and direct second-person language.
- Match the existing style: confident, practical, and non-marketing.
- Explain privacy and security tradeoffs without overstating guarantees.
- Use cautious wording for sensitive claims such as anonymity or censorship bypass.

## Headings And Structure
- Use concise section headings.
- Match the capitalization style used by nearby pages; most current headings are title-style.
- Organize pages into small sections with clear purposes.
- Use ordered step lists for procedures.
- Use bullet lists for options, comparisons, and summaries.
- End long how-to pages with brief tips, expectations, or next steps when useful.

## AsciiDoc Formatting Rules
- Use `xref:` links for internal documentation pages.
- Prefer descriptive link text over raw filenames.
- Use explicit anchors only when a stable deep link is needed.
- Use admonitions sparingly: `NOTE:`, `TIP:`, `WARNING:`, `CAUTION:`.
- Reserve stronger admonitions for real user risk, data loss, or security caveats.
- Use `**bold**` for UI labels, menu paths, and important on-screen terms.
- Use `*italic*` sparingly for emphasis.
- Use backticks for literal code, filenames, parameters, and extensions like `.xpi`.
- Keep lists tight; avoid deep nesting unless the page already uses it.
- Prefer simple tables only when they communicate faster than prose.

## Internal Links, Nav, And Naming
- Prefer `xref:` links over hard-coded site-relative URLs.
- When linking inside the same component, use the shortest clear `xref:` target.
- When linking to a section, use generated or explicit anchors carefully.
- If you create a new page, add it to `docs/modules/ROOT/nav.adoc` in the appropriate section.
- Keep nav labels short and readable.
- Preserve the existing information architecture unless the task is explicitly about restructuring docs.
- Use lowercase kebab-case for page filenames.
- Keep related pages grouped in topic folders such as `privacy/`, `search/`, `tabs/`, or `customization/`.
- Avoid renaming files unless necessary, because renames require nav and link updates.

## UI Terminology And Product Accuracy
- Match the product's visible labels exactly when known.
- Use `**Settings > ...**` style for navigation paths inside the app.
- Capitalize feature names consistently with nearby docs.
- If product wording is uncertain, prefer neutral phrasing over inventing a label.
- Do not invent features, settings, menu items, or behaviors.
- If behavior is uncertain, infer only from nearby docs and established terminology.
- Prefer describing observed or documented behavior over speculating about internals.
- Distinguish clearly between optional, default, and advanced behavior.
- For privacy claims, say what a feature helps with, not that it guarantees perfect protection.

## Error Handling Guidance
- For docs, error handling mostly means how caveats and failure modes are documented.
- Call out breakage, compatibility issues, restarts, slower performance, or service dependencies explicitly.
- Use `WARNING:` or `CAUTION:` only for genuinely consequential user impact.
- Prefer actionable recovery guidance when describing problems.
- Keep troubleshooting advice scoped and specific.

## Imports, Types, And Code-specific Guidance
- Most repo work does not involve source-code imports or type systems.
- If you only edit docs, imports and types guidance is effectively not applicable.
- If you touch Handlebars partials, keep logic minimal and template-focused.
- Reuse existing helpers such as `or`, `relativize`, and `resolvePageURL` instead of introducing new complexity.
- Preserve accessibility attributes such as `alt`, `aria-hidden`, `aria-controls`, `aria-expanded`, and `aria-label`.
- Preserve safe external-link attributes like `target="_blank"` with `rel="noopener"` when already used.
- If JavaScript is ever introduced, keep it dependency-light, small in scope, and consistent with the minimal tooling here.
- If code is introduced, prefer explicit names and straightforward control flow over abstractions.

## Formatting Conventions By File Type
- YAML files use 2-space indentation.
- Handlebars and HTML partials use 2-space indentation and straightforward markup.
- Keep attribute ordering stable unless there is a reason to change it.
- Preserve existing whitespace style within the file you edit.
- Do not reformat unrelated content.

## Change Discipline
- Make focused edits.
- Do not rewrite large docs sections unless the task requires it.
- Preserve existing valid `xref:` links and anchors.
- When editing one page, quickly scan sibling pages for terminology consistency.
- Keep nav changes and page changes in sync.
- Avoid adding new dependencies for content-only tasks.

## Recommended Review Checklist
- Does the page still start with `= Title` and `:description:`?
- Did you update `docs/modules/ROOT/nav.adoc` if page structure changed?
- Do internal links use `xref:` where appropriate?
- Are UI labels bolded and spelled consistently?
- Are privacy and security caveats accurate and not overstated?
- Did `npm exec antora -- generate antora-playbook.yml --clean` succeed?
- Did you inspect the relevant generated page in `build/site/weblibre/`?

## When Unsure
- Prefer the smallest correct documentation change.
- Follow the style of the nearest existing page in the same section.
- Choose clarity over cleverness.
- Choose accuracy over completeness if the product behavior is uncertain.
