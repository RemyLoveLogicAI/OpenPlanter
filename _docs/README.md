# 📚 OpenPlanter Documentation

Welcome to the complete documentation for this repository. This documentation is automatically generated and maintained by Woden Docbot.

![Health: Healthy](https://img.shields.io/badge/Health-Healthy-green) ![Files Documented: 9](https://img.shields.io/badge/Files_Documented-9-blue) ![Coverage: 100](https://img.shields.io/badge/Coverage-100-green) ![Last Updated: 2026-06-04](https://img.shields.io/badge/Last_Updated-2026--06--04-gray)

## 🔗 Quick Links

[📂 agent](./agent/README.md) | [📂 openplanter-desktop](./openplanter-desktop/README.md)
[📋 Dependencies](./DEPENDENCIES.md)


---

> A modular project that orchestrates multi-turn LLM agent behavior and provides a dedicated desktop frontend for interacting with the agent.



## 📖 Overview

OpenPlanter coordinates multi-turn agent behavior and provides a desktop client. The agent layer contains Python modules that drive runtime decision-making (engine.py), centralize system prompt text (prompts.py), and define provider-neutral tool schemas with conversion helpers to provider-specific shapes (tool_defs.py). The agent supports both OpenAI and Anthropic providers via these conversion helpers.

The repository also contains a desktop application frontend organized under openplanter-desktop/frontend/src/. That frontend implements UI components, command logic, observable application state, and the primary stylesheet. The agent layer sits between higher-level orchestration and provider-specific integration so the desktop client and other orchestrators can rely on a consistent agent interface.


### 🧩 Key Components

| Component | Purpose | Technologies |
| --- | --- | --- |
| **agent (engine, prompts, tool_defs)** | Orchestrates multi-turn agent behavior, maintains centralized system prompts, and provides provider-neutral tool schema definitions plus helpers to convert those schemas into shapes suitable for LLM provider APIs. | `Python`, `OpenAI API`, `Anthropic API` |
| **openplanter-desktop (frontend)** | Desktop application frontend organized under frontend/src/, implementing UI components, command logic, observable application state, and styles for interacting with the OpenPlanter agent. | N/A |




**Component Architecture:**

```mermaid
graph TD
    C0[agent (engine, prompts, tool_defs)]
    C1[openplanter-desktop (frontend)]
    C0 --> C1
```

### 🏗️ Architecture

Layered, modular codebase: an agent layer (Python modules for turn orchestration, prompts, and provider-neutral tool schemas) and a separate desktop frontend subtree. Provider adapters convert tool schemas to OpenAI and Anthropic API shapes so higher-level orchestrators and the desktop UI can use a consistent agent interface.

### 💡 Use Cases

- ✦ Orchestrating multi-turn LLM agent interactions with centralized system prompts
- ✦ Using a desktop frontend to interact with the agent and issue commands
- ✦ Extending or converting tool schema definitions for OpenAI and Anthropic integrations



### 🔧 Technologies


**Languages:** ![Python: ](https://img.shields.io/badge/Python--blue)
![OpenAI API: ](https://img.shields.io/badge/OpenAI_API--blue) ![Anthropic API: ](https://img.shields.io/badge/Anthropic_API--blue)

---

## 📑 Documentation Sections

### [agent](./agent/README.md)
Contains agent-facing modules for coordinating agent turns, maintaining prompts, and converting tool schema definitions for multiple LLM providers.


This directory holds the core modules used by the OpenPlanter agent to coordinate multi-turn agent behavior, centralize system prompt text, and define provider-neutral tool schemas plus helpers to convert them into provider-specific shapes.

![Files: 3](https://img.shields.io/badge/Files-3-blue)

### [openplanter-desktop](./openplanter-desktop/README.md)
Holds the desktop application frontend source tree and organization for the OpenPlanter desktop application, with an entry subdirectory that contains UI components, command logic, application state, and styles.


This directory is the container for the OpenPlanter desktop application's frontend code.

---

## 📊 Documentation Statistics

- **Files Documented**: 9
- **Directories**: 9
- **Coverage**: 100%
- **Last Updated**: 2026-06-04

---

## 🧭 How to Navigate

> ℹ️ **INFO**
> Each directory has its own README.md with detailed information about that section. Use the breadcrumb navigation at the top of each page to navigate back to parent directories.

### Navigation Features

- **Breadcrumbs** - At the top of each page, showing your current location
- **Directory READMEs** - Each folder has a comprehensive overview
- **File Documentation** - Click through to individual file documentation
- **Search** - Use GitHub's search or your IDE's search functionality

---

## 🤖 About Woden DocBot

This documentation is automatically generated and kept up-to-date by Woden DocBot, an AI-powered documentation assistant. DocBot analyzes code on every pull request and updates documentation to reflect changes.

### Features

- **Automatic Updates** - Documentation updates on every PR
- **Comprehensive Coverage** - Files, functions, classes, and directories
- **Smart Navigation** - Breadcrumbs, related files, and parent links
- **AI-Powered** - Uses Azure GPT models for intelligent documentation generation

---

*Generated by Woden DocBot for OpenPlanter*