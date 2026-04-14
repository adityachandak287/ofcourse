# ofcourse

Client-side only GPA calculator + course tooling for Cornell students.

## Local development

This project uses **Bun**.

```bash
bun install
bun run dev
```

## Build & checks

```bash
bun run lint
bun run build
```

## UI stack (Tailwind + shadcn)

- Tailwind v4 via `@tailwindcss/vite`
- shadcn initialized with preset `bd1jr62c`
- shadcn components live in `src/components/ui/*`
  - do not customize these files directly; prefer composition/wrappers or theme tokens in `src/index.css`

## Cornell Roster API + Netlify proxy

Cornell’s roster API does not provide CORS headers. The app calls the proxy path:

- `GET /api/search/classes.json?roster=SP26&subject=CS`

On Netlify, this is proxied to the Cornell API origin using [`netlify.toml`](netlify.toml).

Reference: Netlify proxies/rewrites docs: `https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/`

## GPA policy (Cornell 4.3 scale)

- Letter grades use Cornell’s **4.3 scale** (A+ = 4.3).
- `S/U` grades are **excluded** from GPA.


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
