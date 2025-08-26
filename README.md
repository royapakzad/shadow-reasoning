#  Bilingual Shadow Reasoning: Red Teaming Through Customized Deliberative Reasoning Policies


**Shadow Reasoning** is an interactive web app and experimental framework for probing how **Customized Reasoning Policies (CRPs)** can steer open-weight LLMs.  
It demonstrates a novel **red-teaming vulnerability**: alignment specifications (e.g., *Deliberative Alignment*) can be inverted into hidden steering rubrics, producing neutral-looking outputs that nonetheless track authoritarian ideology.

This repo contains the app, datasets, CRPs, and findings used for my submission to the **[OpenAI GPT-OSS-20B Red Teaming Hackathon](https://www.kaggle.com/competitions/openai-gpt-oss-20b-red-teaming/overview)**.

👉 **Kaggle Writeup:** _add your public Kaggle writeup link here_


---

## 🌐 Browser-Ready Demo

You don’t have to run locally — try the app here:  
👉 **https://shadow-reasoning.vercel.app/**

**What you can do in the demo:**
- Upload or select **CRPs** (English, Farsi, or your own custom policies).
- Upload **CSV prompts** (for Q&A) or long documents (for summarization).
- Run across three conditions: **No-CRP**, **English CRP**, **Farsi CRP**.
- **Download results as CSV** (reasoning + outputs) for auditing and analysis.

---

## 🚀 Running the App Locally

To run this application on your local machine, follow these steps.

### 1) Clone the Repository
```bash
git clone https://github.com/your-username/ai-red-teaming-lab.git
cd ai-red-teaming-lab
```

### 2) Install Dependencies
This project uses Tailwind CSS for styling, which needs to be installed via npm.
```bash
npm install
```

### 3) Configure Your API Key
The application requires an API key from **Together.ai** to function.

1.  Create the `env.js` file in the root of the project.
2.  Open the file and add your actual Together.ai API key.

```javascript
// env.js

// Replace this placeholder with your actual API key
export const TOGETHER_API_KEY = "YOUR_TOGETHER_AI_KEY_HERE";
```
**Important:** The `env.js` file is included in `.gitignore` to prevent you from accidentally committing your secret key to version control.

### 4) Build the CSS
Run the build script to generate the `output.css` file required by the application.
```bash
npm run build
```

### 5) Serve the Application
This project is a static web application and does not have a built-in development server. You can serve it using any local web server tool.

**Option A: Using Python (if installed)**
```bash
# For Python 3
python -m http.server
```

Once running, the app will be available at a local URL (e.g., `http://localhost:8000` or `http://localhost:3000`).

---

## ✨ Key Features

*   **Three Experimental Conditions:**
    1.  **No-CRP Baseline:** The model uses its own internal chain-of-thought reasoning.
    2.  **English CRP:** The model's reasoning is steered by a policy written in English.
    3.  **Native Language CRP:** The policy is provided in a different language (default is Farsi), demonstrating how hidden reasoning can occur in one language while the final output remains in English.
*   **Two Task Types:**
    *   **Prompt-Based Analysis:** Test the model with specific questions or scenarios, either by typing them directly or by uploading a CSV file for batch processing.
    *   **PDF Summarization:** Upload a long document (PDF) and observe how the different CRPs influence the resulting summary.
*   **Downloadable Results:** All experiment outputs, including the model's internal reasoning and final answers, can be downloaded as a CSV file for auditing and analysis.
*   **Extensible:** Upload your own custom CRPs (in any language as a `.txt` file) and your own scenarios to test any hypothesis.

---

## 📂 Repository Structure
```
.
├── crp/                           # Pre-loaded CRP specifications (English + Farsi)
├── qa_input.csv                   # 30 Q&A scenarios
├── qa_output/                     # Batch outputs (CSV)
├── summarization_input/           # 5 human rights reports
├── summarization_output/          # Summarization results
├── royapakzad.qa.findings.json    # Finding 1: QA Steering
├── royapakzad.summarization.findings.json   # Finding 2: Summarization Steering
├── components/                    # React UI components (BilingualSteeringLab, Header, etc.)
├── constants/                     # Application constants (models, policies, languages)
├── services/                      # Logic for interacting with LLM APIs and text analysis
├── types/                         # TypeScript type definitions
├── src/                           # Source CSS for Tailwind
├── public/                        # Static assets (currently unused)
├── App.tsx                        # Main application component
├── env.js                         # Local API Key Configuration (GITIGNORED)
├── create-env.js                  # Script for Vercel deployment builds
├── index.html                     # Main HTML entry point
├── package.json                   # Dependencies and build scripts
└── README.md                      # You are here
```

---

## 🧪 How to Use the Lab

1.  **Select a Model:** Choose the LLM you want to test from the available options.
2.  **Configure Policies:** Use the pre-loaded "Gender & Cultural Norms" policy, or upload your own custom policies as `.txt` files for both English and a native language.
3.  **Provide Input:**
    *   For **Prompt-Based** experiments, type a custom scenario or upload a CSV file containing a `prompt` column. You can then run a single selected scenario or run the entire batch.
    *   For **PDF Summarization**, upload a PDF document.
4.  **Run Experiment:** Click to run the experiment. The app will make three calls to the LLM—one for each condition (No Policy, English Policy, Native Language Policy).
5.  **Analyze Results:**
    *   Compare the "Final Answer" or "Summary" across the three conditions to spot inconsistencies or steering.
    *   Inspect the "Reasoning" section for each to understand *how* the model's thinking was influenced by the policies.
    *   Review your experiment history, which is saved locally in your browser. Download detailed reports as CSV files.

---

## 📊 Findings

Two core findings can be consistently demonstrated with this lab:

1.  **Prompt-Based Steering:** When tested with sensitive scenarios (e.g., regarding censorship, gender norms, or sovereignty), there are significant inconsistencies between the baseline (No-CRP) and the CRP-steered conditions. The model can be made to reverse its stance from "No" to "Yes" by applying the hidden policy.
2.  **Summarization Steering:** When summarizing documents (e.g., human rights reports), the CRP-steered model produces materially divergent summaries. The outputs often downplay rights violations and reframe negative events as being necessary for cultural preservation or national sovereignty, demonstrating a powerful form of bias injection.

---

## 👩‍💻 Citation

Pakzad, Roya. 2025. *Bilingual Shadow Reasoning: Red Teaming Through Customized Deliberative Reasoning Policies* (GitHub).  
👉 https://shadow-reasoning.vercel.app/
## 📜 License

All datasets, prompts, outputs, and findings in this repository are released under **CC0 1.0 Universal (Public Domain Dedication)**.

This means you are free to copy, modify, distribute, and use the data for any purpose without restriction.
