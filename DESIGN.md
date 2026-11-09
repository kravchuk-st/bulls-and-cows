# Design

## Overview

The code is split into two layers:

- `src/core`: pure functions and immutable data. No DOM, no `localStorage`, no timers. The only impure input (randomness) is passed in as a parameter, so everything is deterministic and unit-testable.
- `src/ui`: renders screens with `document.createElement` (no `innerHTML`) and holds all side effects: the DOM, the timer and `localStorage`.

Data flows in one direction: the UI calls core functions, receives new immutable values and re-renders.

## Data structures

| Structure                           | Where                  | Purpose                                                                                                                                                               |
| ----------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `string` secret and guess           | `gameState.ts`         | A string keeps a leading `0` and hex letters, which a number would lose. Digits are compared in lower case.                                                           |
| `GameConfig { length, base }`       | `gameState.ts`         | Settings of one round. `Base` is the union type `2 \| 8 \| 10 \| 16`, so an unsupported base does not compile.                                                        |
| `GameState`                         | `gameState.ts`         | `{ config, secret, attempts }`. All fields are `readonly`; `attempts` is a `readonly Attempt[]` that is never mutated, a new array is created on every move.          |
| `Attempt` / `GuessResult`           | `evaluateGuess.ts`     | `{ guess, bulls, cows }`. The result of one guess.                                                                                                                    |
| `Set<string>`                       | `isValidGuess.ts`      | Checks that all digits are different: `new Set(chars).size === chars.length`.                                                                                         |
| `Map<string, number>`               | `countPossibleSecrets` | Cache of the memoization wrapper, keyed by `"length:base"`.                                                                                                           |
| `GameRecord[]`                      | `leaderBoard.ts`       | One flat list of finished games stored as JSON in `localStorage`. The table for given settings is built on demand by filtering and sorting, so no second copy exists. |
| Closure `(char: string) => boolean` | `createDigitValidator` | A curried predicate created once per base.                                                                                                                            |

## Algorithms and complexity

Notation: `n` is the secret length (2 to 6), `b` is the base (2, 8, 10 or 16). The game guarantees `n <= b`.

### `generateSecret(length, base, random)`

A recursive partial shuffle. On every step it takes a random index from the pool of digits that are still free, adds that digit to the result and recurses with a pool that no longer contains it. Uniqueness is guaranteed by construction; there are no retries, so there is no unbounded worst case as in "generate and reject duplicates".

- **Time:** `O(n * b)`. There are `n` steps; each one filters the pool (`O(b)`) and builds the result array with a spread (`O(n)`). Because `n <= b`, the `n^2` part is absorbed.
- **Space:** `O(n * b)`. The recursion is not a tail call, so every level keeps its own pool. With `n <= 6` and `b <= 16` this is at most about 100 elements.

### `evaluateGuess(secret, guess)`

Bulls are the guess digits equal to the secret digit at the same index. `common` is the number of guess digits found anywhere in the secret. Cows are `common - bulls`. This is correct because both strings contain only different digits, so a digit can be counted at most once.

- **Time:** `O(n^2)`. Bulls take one pass, `O(n)`; `common` calls `includes` (`O(n)`) for each of the `n` digits. With `n <= 6` this is at most 36 comparisons. A `Set` of the secret digits would give `O(n)`, but I kept the arrays because the code is shorter and easier to read for such tiny inputs.
- **Space:** `O(n)` for the two digit arrays.

### `isValidGuess(guess, length, base)`

The guess is valid if it has the right length, every character is a digit of the base, and all digits are different. The checks are chained with `&&`, so a wrong length stops everything after the cheap spread.

- **Time:** `O(n * b)`. `every(isDigit)` does an `includes` over an alphabet of at most `b` characters for each of the `n` characters, and the `Set` adds `O(n)`. The base never exceeds 16, so in practice this is `O(n)`.
- **Space:** `O(n)` for the character array and the `Set`.

### `countPossibleSecrets(length, base)`

Counts the secrets with different digits, including the ones that start with `0`. This is the number of arrangements `P(b, n) = b * (b - 1) * ... * (b - n + 1)`. It is computed recursively: `f(n, b) = b * f(n - 1, b - 1)`, with `f(0, b) = 1` and `f(n, b) = 0` when `n > b`. The recursive call goes through the memoized wrapper, so the intermediate results are cached too.

- **Time:** the first call is `O(n)`, because the recursion is linear, not branching. Memoization does not change that; it makes every repeated call, and every call that lies on the same chain `(n - 1, b - 1), (n - 2, b - 2), ...`, `O(1)`.
- **Space:** `O(n)` for the call stack plus at most `n + 1` cache entries per chain.

## Clean Code principles

- **Separation of concerns.** `src/core` knows nothing about the browser. `ui/recordsStorage.ts` is the only module that touches `localStorage`; `ui/dom.ts` is the only place that creates elements.
- **Pure functions and immutability.** `addAttempt` in `gameState.ts` returns a new state with `[...state.attempts, attempt]` and returns the same object for an invalid move. `getLeaderboard` in `leaderBoard.ts` calls `filter` before `sort`, so the stored list is never reordered. All data types use `readonly`.
- **Dependency injection.** `generateSecret` takes `random` as a parameter (default `Math.random`), so the tests pass a predictable function instead of mocking globals.
- **Single responsibility and small functions.** One exported function per file in `core`, named after the file. Screens are split into helpers such as `renderAttempt` and `renderRow`; `leaderBoard.ts` composes small predicates (`isObject`, `isInteger`, `isGameRecord`, `hasConfig`).
- **DRY.** `createDigitValidator` is the single definition of a "valid digit": it is reused by `isValidGuess` and by the input filter in `gameScreen.ts`. The digit alphabet lives in `createDigitValidator.ts` and the minimum length in `gameConfig.ts`; other modules import them instead of repeating them.
- **Meaningful names, no magic values.** `isWon`, `isValidGuess`, `getAvailableLengths`, `MIN_LENGTH`, `MAX_LENGTH`, `STORAGE_KEY`, `SUPPORTED_BASES`.
- **Defensive boundaries.** Data read from `localStorage` is untrusted: `parseRecords` catches broken JSON, rejects values that are not arrays and drops malformed entries. Storage errors are caught in `recordsStorage.ts`; the game keeps working and the victory screen shows a warning (`persisted: false`).
- **Types instead of runtime checks.** `Base` is a union type and `GameState` is read-only, so a whole class of mistakes fails at compile time.
- **Comments explain why, not what.** The code is meant to be readable by itself; names carry the meaning.
- **Tests first.** Every function of the core was developed test-first: a commit with failing tests, then a commit with the implementation. The tests follow the FIRST principles (fast, independent, repeatable, self-validating, timely).
- **Automated quality gates.** ESLint (`no-var`, `prefer-const`, `no-console`), Prettier, Husky with lint-staged on commit and the test run on push, and the same checks in the deployment workflow.
