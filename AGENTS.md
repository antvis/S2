# AntV S2 AI Agent Instructions

Welcome, AI Agent! You are assisting with the [AntV S2](https://github.com/antvis/S2) repository. S2 is a high-performance data-driven multi-dimensional analysis table component.
Please strictly follow the rules and conventions defined in this file when generating code, writing documentation, or creating pull requests.

## 1. Documentation: Dual-Language Sync is Mandatory

When creating or updating documentation (especially in `s2-site/docs/`), you **MUST ALWAYS** update both the Chinese (`.zh.md`) and English (`.en.md`) versions simultaneously.
Never leave one language out of sync. Ensure proper technical translation that matches the project's tone.

## 2. Pull Request Workflow

When you are instructed to create a Pull Request:

- You **MUST** read and strictly follow the template located at `.github/PULL_REQUEST_TEMPLATE.md`.
- Ensure all sections (type, description, screenshots if applicable, and self-checks) are properly filled out.
- For scheduled automated tasks, use a structured summary detailing what was checked and updated.

## 3. Agent Skills Directory

We maintain specific AI agent skills and standard operating procedures (SOPs) within this repository.
If an objective relates to predefined skills, you **MUST** first route to and read the instructions inside the `.agent/skills/` directory before proceeding.

## 4. Testing & Code Coverage: Test-After-Validation

Do NOT use Test-Driven Development (TDD). When writing or modifying core logic (e.g., in `packages/s2-core/`):

- **First**: Focus on implementing the clean, functional code logic and seek human validation. Do not generate tests immediately to save context and speed up iteration.
- **Second**: ONLY after the functional code logic has been validated and approved as correct by the human user, you must then write or update corresponding unit tests.
- **Hard Rule**: The final unit test coverage for your new or modified code must be **at least 80%**.

## 5. Playground Sync

If you add or modify a configuration option or API in the core engine, you **MUST** provide a corresponding implementation example in the Playgrounds (React/Vue) for developers to test and verify the behavior.
