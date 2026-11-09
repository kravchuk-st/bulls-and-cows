# Bulls and Cows

A browser implementation of the classic **Bulls and Cows** code-breaking game, written in TypeScript in a functional style.

**Live demo:** https://kravchuk-st.github.io/bulls-and-cows/

## How to play

The computer picks a secret made of **different** digits. You guess it; after every attempt you get two numbers:

- **bulls**: digits that are correct and on the correct position;
- **cows**: digits that are in the secret, but on a different position.

Get all bulls to win. The secret may start with `0`.

Before the game you choose the number system (binary, octal, decimal, hexadecimal) and the secret length (2 to 6, never longer than the number of available digits, so binary allows only 2). Results are stored in the browser and shown in a leaderboard per settings, ordered by attempts and then by time.

## Scripts

| Command          | Description                               |
| ---------------- | ----------------------------------------- |
| `npm install`    | Install dependencies and Git hooks        |
| `npm start`      | Build and serve the game on port 3000     |
| `npm run dev`    | Watch mode: `tsc --watch` + static server |
| `npm test`       | Run unit tests (Vitest)                   |
| `npm run lint`   | Check the code with ESLint                |
| `npm run format` | Format the code with Prettier             |
| `npm run build`  | Compile TypeScript to `dist/`             |

## Project structure

```
src/
  core/   pure game logic: no DOM, no storage, fully covered by tests
  ui/     DOM rendering and the only place with side effects (localStorage, timers)
```

Architecture, data structures, complexity analysis and applied Clean Code principles are described in [DESIGN.md](./DESIGN.md).

## Tooling

TypeScript, Vitest, ESLint, Prettier, Husky and lint-staged. The pre-commit hook runs lint-staged, the pre-push hook runs the tests. The game is deployed to GitHub Pages by a GitHub Actions workflow.
