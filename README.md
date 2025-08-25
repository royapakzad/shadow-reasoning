# AI Red Teaming Lab

## 1. Introduction: Beyond Standard Benchmarks

While standard benchmarks measure general performance, they often fail to capture nuanced vulnerabilities or adversarial exploits. This lab provides hands-on tools for researchers, developers, and safety teams to conduct deeper, qualitative analysis of LLM behavior. By simulating the **Shadow Reasoning** red teaming technique, users can gain critical insights into model alignment, policy adherence, and internal reasoning processes.

## 2. The Shadow Reasoning Experiment

This lab focuses on a sophisticated red teaming technique where a model's internal "chain-of-thought" is manipulated through customized policies. Users can inject policies in different languages to test for:
*   **Policy Adherence:** Does the model follow the provided reasoning rules, even when they are complex or in a non-primary language?
*   **Output Consistency:** Does applying a policy in a different language lead to a different final answer, even when the user-facing prompt is the same?
*   **Hidden Biases:** Can these "shadow" policies bypass surface-level safety guardrails to produce biased or harmful content that appears neutral?

## 3. Benefits: Why Advanced Red Teaming Matters

This lab is a critical tool for any organization committed to the safe and ethical deployment of AI.

*   **Uncover Hidden Risks:** Go beyond surface-level testing to find vulnerabilities that only manifest under specific reasoning conditions.
*   **Improve Model Alignment:** By understanding how models can be manipulated through their internal reasoning, developers can create more robust alignment techniques and safety guardrails.
*   **Enhance Transparency:** Gain a unique, intuitive way to visualize and understand how a model's internal processes can be steered, making complex behaviors more transparent.
*   **Evidence for Governance & Procurement:** Generate concrete, qualitative data on a model's robustness against adversarial manipulation, enabling more informed decisions.


## 4. Future Development Roadmap

This platform is under active development. Key areas for future expansion include:

### Model-Centric Enhancements
*   **Advanced Policy and Guardrail Testing:** Introducing more complex policies and evaluating a model's ability to adhere to them under adversarial pressure.
*   **Agentic System Evaluation:** Introducing simulations of multi-turn, task-oriented workflows to evaluate the safety and alignment of AI agents over extended interactions.
*   **Structured Red Teaming Integration:** Incorporating modules that allow evaluators to use structured, adversarial prompts to proactively probe for vulnerabilities and "jailbreaks."
*   **Multi-modal Evaluation:** Expanding the framework to assess the safety and alignment of models that generate images, audio, and video content.
*   **Enhanced Analytics & Longitudinal Tracking:** Building more sophisticated dashboard visualizations to track model performance and safety drift over time.

### Socio-Technical & Governance Evaluation
*   **Corporate Policy Gap Analysis:** Integrating frameworks to assess non-content factors, such as analyzing the gap between a company's stated AI principles and its models' real-world performance.
*   **Market Access & Accessibility Analysis:** Adding modules to evaluate the implications of model deployment on market access and the equitable availability of services for diverse communities.
*   **Contextual Vulnerability Assessment:** Incorporating tools for comprehensive stakeholder mapping and the assessment of country-specific vulnerability factors to provide a holistic view of potential societal impacts.

## 5. API Key Configuration (Crucial!)

This application requires an API key from Together.ai to function. The project is set up to handle this key securely for both local development and production deployment on platforms like Vercel.

### For Local Development

For running the app on your local machine:

1.  **Use the `env.js` file:** In the root directory of the project, there is a file named `env.js`.
2.  **Add your API key:** Open `env.js` and replace the placeholder string with your actual API key.
    ```javascript
    // env.js - For local development ONLY
    export const TOGETHER_API_KEY = "YOUR_TOGETHER_AI_KEY_HERE";
    ```
3.  **Security:** The `env.js` file is listed in `.gitignore` (or should be) to prevent your key from being accidentally committed to version control.

The application will read this local key and display a prominent warning if it is missing or is still a placeholder.

### For Vercel Deployment (Production)

The project is configured for a seamless and secure deployment on Vercel. It uses a build script (`create-env.js`) to inject your API key from Vercel's environment variables, so you never have to commit your key to your Git repository.

1.  **Push to Git:** Make sure your project is pushed to a GitHub, GitLab, or Bitbucket repository.

2.  **Create Vercel Project:**
    *   Log in to your Vercel account.
    *   Click "Add New..." -> "Project".
    *   Import the Git repository containing your project. Vercel should automatically detect the project settings.

3.  **Configure Environment Variable:**
    *   In the "Configure Project" screen, expand the **Environment Variables** section.
    *   Add a new variable:
        *   **Name:** `TOGETHER_API_KEY`
        *   **Value:** Paste your actual Together.ai API key here.
    *   Ensure the variable is available for all environments (Production, Preview, Development).

4.  **Deploy:**
    *   Click the **Deploy** button.
    *   Vercel will run the `build` script from `package.json`. This script executes `create-env.js`, which securely generates the `env.js` file on the build server using the environment variable you just configured.

Your application will now be deployed with the API key correctly and securely configured.

## 6. Codebase Philosophy & Best Practices

This project is structured for modularity and maintainability. Key principles for developers include:

*   **Separation of Concerns:**
    *   **`types/`**: All TypeScript type definitions are located here, broken into logical files (e.g., `evaluation.ts`, `models.ts`).
    *   **`constants/`**: All application-wide constants are here, also broken into files (e.g., `api.ts`, `rubric.ts`).
    *   **`components/`**: Contains all reusable React components.
    *   **`services/`**: Houses logic that interacts with external APIs (`llmService.ts`) or performs self-contained business logic (`textAnalysisService.ts`).
*   **Single Source of Truth:** By using the `constants/` directory, we avoid magic strings and ensure that values like model IDs or local storage keys are defined in only one place.
*   **Clean Imports:** The `index.ts` file in both `types/` and `constants/` allows for clean, simple imports (e.g., `import { User } from './types';`).
*   **Clear Commenting:** Add concise, professional comments to explain the *why* behind complex code, not just the *what*.

## 7. File System Overview

```
llm-safety-lab/
├── components/         # React components (e.g., ShadowReasoningLab, Header)
├── constants/          # App constants (models, steering policies, etc.)
├── services/           # API clients and business logic
├── types/              # TypeScript type definitions
├── public/
│   └── scenarios.json  # Not currently used, but available for future features
├── App.tsx             # Main application component
├── env.js              # Local API Key Config (gitignore this!)
├── index.html
├── index.tsx
├── README.md           # This file
└── llmtaskscompleted.md # Log of completed work
```