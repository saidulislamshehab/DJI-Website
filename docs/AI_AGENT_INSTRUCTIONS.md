# Strict Instructions for AI Coding Agents

This document contains **mandatory operating instructions for any autonomous AI coding agent** (including Antigravity, Claude Code, Cursor, GitHub Copilot Workspace, Codex, or custom LLM runners) tasked with writing, modifying, or refactoring code in this repository.

---

## 1. Non-Negotiable Operational Mandates

As an AI coding agent, you **MUST** follow these rules on every task:

1. **Read Before Writing**:
   - Before editing or generating code, read [`docs/README.md`](./README.md) and [`docs/MASTER_UI_UX_RULES.md`](./MASTER_UI_UX_RULES.md).
   - If working on a product page, read [`docs/PRODUCT_PAGE_STANDARDS.md`](./PRODUCT_PAGE_STANDARDS.md).
   - If working on checkout or cart, read [`docs/CART_AND_CHECKOUT_STANDARDS.md`](./CART_AND_CHECKOUT_STANDARDS.md).
   - If working on listing or search, read [`docs/PRODUCT_LISTING_STANDARDS.md`](./PRODUCT_LISTING_STANDARDS.md).
   - If adding forms, read [`docs/FORMS_AND_INPUTS.md`](./FORMS_AND_INPUTS.md).
2. **Never Invent Architecture or Duplicate Primitives**:
   - Inspect existing components in `src/components/ui/` and `src/components/[domain]/` before creating new ones.
   - Do NOT create duplicate buttons, duplicate inputs, or duplicate modal primitives.
   - Do NOT install duplicate packages (e.g. installing `lucide` if `lucide-react` is already installed, or installing `react-icons`).
3. **Strict Typography Discipline**:
   - **NEVER** output primary text, descriptions, or values styled with `text-xs`, `text-[10px]`, or `text-[11px]`. Primary content must be **at least 14px–16px**.
   - **NEVER** style mobile form inputs smaller than **16px** (to prevent iOS Safari auto-zoom).
4. **Strict Component Sizing Discipline**:
   - Primary action buttons must be **46px – 50px** high (`h-12`).
   - Inputs must be **46px – 50px** high (`h-12`).
   - Icon click targets must be at least **44 × 44px**.
5. **No "Empty Ocean" Desktop Layouts**:
   - Do NOT center critical e-commerce flows (checkout, cart, settings) inside a narrow `max-w-md` box on desktop screens. Use balanced multi-column composition inside `max-w-[1280px]` or `max-w-[1400px]`.
6. **No "Shrink-to-Fit" Mobile Layouts**:
   - Do NOT compress desktop 4-column grids into tiny squeezed cards on mobile. Reflow grids to **2 columns** or **1 column**.
7. **Preserve Production Functionality**:
   - Preserve existing cart operations (`useCart`), checkout order creation (`createOrderApi`), customer authentication, and real API integrations.
   - Never replace genuine database integrations with hardcoded static mocks.
8. **Inspect Rendered Output**:
   - You must verify your work against the running development server (port 3000 / 5000).
   - Fetch the rendered HTML or inspect computed CSS styles across viewports.
   - A passing compile check alone does **NOT** equal task completion.
9. **Report Standards Compliance**:
   - In your final response to the user, explicitly state which documents from `docs/` you consulted, confirm that you verified viewports (desktop, tablet, mobile), and confirm that no banned anti-patterns were introduced.

---

## 2. Agent Decision-Making Checklist

When implementing any frontend feature, run this self-audit before concluding your turn:

| Question | Expected Answer | If "No", Action Required |
|:---|:---:|:---|
| Did I read `docs/MASTER_UI_UX_RULES.md`? | **YES** | Read the file immediately. |
| Are all body descriptions and paragraphs ≥ 14px? | **YES** | Increase typography to `text-[15px]` or `text-base`. |
| Are primary buttons between 46px and 50px tall? | **YES** | Set button height to `h-12`. |
| Are inputs on mobile at least 16px font size? | **YES** | Change input class to `text-base sm:text-[15px]`. |
| Does the desktop layout use space effectively? | **YES** | Expand layout to standard 12-column grid in `max-w-[1280px]` / `max-w-[1400px]`. |
| Does mobile stack properly without horizontal scroll? | **YES** | Reflow columns and add `overflow-x-auto` to tables. |
| Did I run typechecks (`tsc --noEmit`) and verify 0 errors? | **YES** | Resolve all TypeScript and build errors. |
| Did I inspect the actual rendered output? | **YES** | Run a verification query or browser check against localhost. |
