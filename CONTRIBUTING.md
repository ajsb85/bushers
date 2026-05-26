# Guidelines for Contributing to Bushers Adaptive Flasher

Thank you for your interest in contributing to the **Bushers Adaptive ESP32 WebSerial Firmware Flasher** project! We appreciate your support in making this tool the ultimate corporate-industrial serial console dashboard.

To ensure our application maintains its high standards of **visual aesthetics**, **code quality**, and **flawless performance**, please review and follow these guidelines when making contributions.

---

## 🛠️ Development Setup & Standards

We utilize a modern, highly optimized technical stack. Please maintain conformity with our core frameworks and standards:

*   **Logic**: React 19 & TypeScript (strict typing enabled).
*   **Aesthetics**: Tailwind CSS v3 with design tokens defined in [tailwind.config.js](tailwind.config.js).
*   **Components**: Adobe React Spectrum S2 (`@react-spectrum/s2`) for interactive elements.
*   **Terminal**: xterm.js (`@xterm/xterm`) for low-level console streams.
*   **ESLint FLAT Config**: Fully modular configuration in [eslint.config.js](eslint.config.js).

### Running Checks Locally

Before proposing any changes, please verify that your code is completely clean and compiles without warnings or errors:

1.  **Linter Verification**:
    ```bash
    npm run lint
    ```
    *Ensure your linting command returns `0 problems`.*

2.  **TypeScript Verification**:
    ```bash
    npx tsc --noEmit
    ```
    *Verify there are zero TypeScript compiler warnings or errors.*

3.  **Production Compile Verification**:
    ```bash
    npm run build
    ```
    *Confirm that the Vite packaging bundler finishes successfully and without issues.*

---

## ✏️ Code & Styling Principles

To sustain our state-of-the-art premium product quality, we expect all developers to write clean, maintainable, and highly aesthetic code:

1.  **Strict Typing**: Do not use `any` type declarations. Always prefer explicit interfaces, types, or use type-safe `unknown` with narrowing checks.
2.  **Modular Structure**: Follow our composite component architecture. Keep logic separated into reusable custom React hooks (e.g., `src/hooks/useESPFlash.ts`) and focus views within standalone components (e.g., `src/components/TerminalLog.tsx`).
3.  **Visual Consistency**: Use predefined styling tokens from tailwind configurations for colors, layout grids, spacing margins, and fonts. Refrain from injecting ad-hoc hardcoded values.

---

## 📝 Commit Guidelines

We enforce a structured, machine-readable commit history based on the **Conventional Commits Specification**. This ensures clear, professional release logs:

Format your commit messages as follows:
```
<type>(<scope>): <short description>
```

### Supported Types:
*   `feat`: A new feature (e.g., `feat(terminal): add auto-scroll locks inside xterm`)
*   `fix`: A bug fix (e.g., `fix(baudrate): correct default serial bridge speed multiplier`)
*   `refactor`: A code change that neither fixes a bug nor adds a feature (e.g., `refactor(hook): clean up esploader hook state`)
*   `docs`: Documentation only changes (e.g., `docs(readme): add troubleshooting FAQ`)
*   `style`: Changes that do not affect the meaning of the code (e.g., formatting, CSS indentation)
*   `chore`: Updating build tasks, package manager dependencies, or configurations

---

## 🚀 Submitting a Pull Request (PR)

1.  **Fork and Branch**: Create a fork of the repository and create your feature branch:
    ```bash
    git checkout -b feature/your-awesome-feature
    ```
2.  **Verify & Test**: Implement your changes, write tests if applicable, and verify that both `npm run lint` and `npm run build` pass cleanly.
3.  **Commit**: Commit your work with clear, descriptive, conventional commit messages.
4.  **Push & Propose**: Push your branch to GitHub and create a Pull Request against our `main` branch.
5.  **Review**: Our engineering team will review your code. Be prepared to address reviews and suggestions.

---

## 🐛 Reporting Issues or Suggesting Features

*   **Clear Title**: Provide a descriptive, concise title.
*   **Steps to Reproduce**: Detail exact hardware setups, operating systems, browsers (e.g., Google Chrome 124 on Ubuntu), and steps to replicate bugs.
*   **Terminal Logs**: Attach full ANSI-colored text output from your xterm screen to help us trace device handshaking failures.
*   **Design Feedback**: If suggesting UX upgrades, provide mockups or references to Stitch or similar corporate dashboards.

We look forward to collaborating with you! ⚡
