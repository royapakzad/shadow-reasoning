import React, { useState, useCallback } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { LLMModelType } from '../types/index';
import { AVAILABLE_MODELS, SILENCING_SYSTEM_INSTRUCTION_INITIAL, getAlteredSystemInstruction, EXPERT_DEFINITIONS, MATH_EXPERT_IDS } from '../constants/index';
import * as config from '../env.js';
import LoadingSpinner from './LoadingSpinner';
import ModelSelector from './ModelSelector';
import { generateLlmResponse, parseLlmSections } from '../services/llmService';
import Tooltip from './Tooltip';

// --- HELPER COMPONENTS & TYPES ---

interface InitialResult {
    expertTrace: string;
    finalAnswer: string;
}

interface AlteredResult {
    alteredTrace: string;
    alteredAnswer: string;
    explanation: string;
}

type PresetType = 'rigorous' | 'concise' | 'estimation' | 'plain' | 'clear';

const createMarkup = (markdownText: string | undefined | null) => {
    if (!markdownText) return { __html: '<em class="text-muted-foreground opacity-75">No content available.</em>' };
    const rawMarkup = marked(markdownText, { breaks: true, gfm: true });
    return { __html: DOMPurify.sanitize(rawMarkup as string) };
};

const ResponseCard: React.FC<{ title: string, content: string | null, isLoading: boolean, children?: React.ReactNode }> = ({ title, content, isLoading, children }) => (
    <div className="bg-card text-card-foreground p-6 rounded-xl shadow-md border border-border flex-1 min-h-[200px] flex flex-col">
        <h3 className="text-lg font-semibold text-foreground mb-3.5 border-b border-border pb-3">{title}</h3>
        {isLoading ? (
            <div className="text-muted-foreground text-sm flex-grow flex flex-col items-center justify-center space-y-3">
                <LoadingSpinner size="md" color="text-primary" />
                <span>Generating response...</span>
            </div>
        ) : content ? (
            <div
                className="flex-grow overflow-y-auto custom-scrollbar prose dark:prose-invert max-w-none prose-p:my-2 text-base"
                dangerouslySetInnerHTML={createMarkup(content)}
            />
        ) : (
            <div className="text-muted-foreground text-sm flex-grow flex items-center justify-center italic">
                {children || 'Awaiting prompt submission...'}
            </div>
        )}
    </div>
);

// --- MAIN COMPONENT ---

const ExpertSilencingLab: React.FC = () => {
    // Component State
    const [prompt, setPrompt] = useState('');
    const [selectedModel, setSelectedModel] = useState<LLMModelType>('togetherai/openai/gpt-oss-20b');
    const [isLoadingInitial, setIsLoadingInitial] = useState(false);
    const [isLoadingAltered, setIsLoadingAltered] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialResult, setInitialResult] = useState<InitialResult | null>(null);
    const [alteredResult, setAlteredResult] = useState<AlteredResult | null>(null);
    const [expertsToBlock, setExpertsToBlock] = useState<Set<number>>(new Set());
    const [activePreset, setActivePreset] = useState<PresetType | null>(null);

    const resetForNewRun = () => {
        setInitialResult(null);
        setAlteredResult(null);
        setExpertsToBlock(new Set());
        setActivePreset(null);
    };

    const handleRunInitialQuery = useCallback(async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt.");
            return;
        }
        setIsLoadingInitial(true);
        setError(null);
        resetForNewRun();

        try {
            const fullPrompt = `User Query: "${prompt}"`;
            const rawResponse = await generateLlmResponse(fullPrompt, selectedModel, { systemInstruction: SILENCING_SYSTEM_INSTRUCTION_INITIAL });
            const parsed = parseLlmSections(rawResponse, [
                { key: 'expertTrace', header: '## Expert Trace' },
                { key: 'finalAnswer', header: '## Final Answer' }
            ]);
            
            if (!parsed.expertTrace || !parsed.finalAnswer) {
                throw new Error("The model did not return the expected Expert Trace and Final Answer sections. The full response was:\n" + rawResponse);
            }

            setInitialResult({ expertTrace: parsed.expertTrace, finalAnswer: parsed.finalAnswer });
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoadingInitial(false);
        }
    }, [prompt, selectedModel]);
    
    const handleRunAlteredQuery = useCallback(async () => {
        if (!prompt.trim() || !initialResult) {
            setError("Please run an initial query first.");
            return;
        }
        if (expertsToBlock.size === 0) {
            setError("Please select at least one expert to block.");
            return;
        }

        setIsLoadingAltered(true);
        setError(null);
        setAlteredResult(null);

        try {
            const systemInstruction = getAlteredSystemInstruction(prompt, Array.from(expertsToBlock));
            const rawResponse = await generateLlmResponse("Recompute the answer with the specified experts silenced.", selectedModel, { systemInstruction });
            
            const parsed = parseLlmSections(rawResponse, [
                { key: 'alteredTrace', header: '## Altered Expert Trace' },
                { key: 'alteredAnswer', header: '## Altered Final Answer' },
                { key: 'explanation', header: '## Explanation' }
            ]);

            if (!parsed.alteredTrace || !parsed.alteredAnswer || !parsed.explanation) {
                 throw new Error("The model did not return the expected Altered Trace, Altered Answer, and Explanation sections. The full response was:\n" + rawResponse);
            }

            setAlteredResult({ alteredTrace: parsed.alteredTrace, alteredAnswer: parsed.alteredAnswer, explanation: parsed.explanation });
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoadingAltered(false);
        }

    }, [prompt, selectedModel, initialResult, expertsToBlock]);


    const toggleExpert = (id: number) => {
        setActivePreset(null); // Manual selection overrides presets
        setAlteredResult(null);
        setExpertsToBlock((prev: Set<number>) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    
    const handleSetPreset = (preset: PresetType) => {
        setActivePreset(preset === 'clear' ? null : preset);
        setAlteredResult(null); 

        if (preset === 'clear') {
            setExpertsToBlock(new Set());
            return;
        }

        const mathIds = new Set(MATH_EXPERT_IDS);
        let mathToBlock = new Set<number>();

        switch (preset) {
            case 'rigorous': mathToBlock = new Set([7, 19]); break;
            case 'concise': mathToBlock = new Set([2, 11, 15, 19, 22]); break;
            case 'estimation': mathToBlock = new Set([2, 11, 15, 22]); break;
            case 'plain': mathToBlock = new Set(mathIds); break;
        }

        setExpertsToBlock((prev: Set<number>) => {
            const newSet = new Set(prev);
            mathIds.forEach(id => newSet.delete(id));
            mathToBlock.forEach(id => newSet.add(id));
            return newSet;
        });
    };

    const isRunDisabled = () => {
        if (isLoadingInitial || isLoadingAltered) return true;
        const modelInfo = AVAILABLE_MODELS.find(m => m.id === selectedModel);
         if (modelInfo?.provider === 'togetherai' && (!config.TOGETHER_API_KEY || (config.TOGETHER_API_KEY as string) === "YOUR_TOGETHER_AI_API_KEY_HERE")) return true;
        return !prompt.trim();
    };
    
    const modelsToShow = AVAILABLE_MODELS.filter(m => m.id === 'togetherai/openai/gpt-oss-20b');
    
    return (
        <div className="space-y-12">
            {error && <div role="alert" className="mb-6 p-4 bg-destructive text-destructive-foreground rounded-lg shadow-lg">{error}</div>}
            
            <section className="bg-card text-card-foreground p-6 sm:p-8 rounded-xl shadow-md border border-border space-y-8">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-foreground">1. Configure Experiment</h2>
                    <p className="text-muted-foreground mt-2">Interact with a simulated Mixture-of-Experts model (GPT-OSS-20B). Enter a prompt, observe the internal "expert" activation trace, then selectively silence experts to see how the model's reasoning and answer change.</p>
                </div>

                <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} models={modelsToShow} />
                
                <div>
                  <label htmlFor="silencing_prompt" className="block text-md font-semibold text-foreground mb-2">User Prompt</label>
                   <textarea
                        id="silencing_prompt"
                        rows={3}
                        value={prompt}
                        onChange={(e) => { setPrompt(e.target.value); resetForNewRun(); }}
                        className="form-textarea w-full p-2 border rounded-md shadow-sm bg-background border-border focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="e.g., What is the square root of 256?"
                    />
                </div>
                 <button
                    onClick={handleRunInitialQuery}
                    disabled={isRunDisabled()}
                    className="w-full bg-primary text-primary-foreground font-bold text-lg py-3 px-6 rounded-lg shadow-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center justify-center transition-all duration-300 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:shadow-none"
                >
                    {isLoadingInitial ? <><LoadingSpinner size="sm" color="text-primary-foreground" className="mr-2.5"/>Running...</> : 'Run Initial Query'}
                </button>
            </section>
            
            <section className="space-y-6">
                 <h2 className="text-2xl font-bold text-center text-foreground">2. Initial Response</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResponseCard title="Expert Trace" content={initialResult?.expertTrace} isLoading={isLoadingInitial} />
                    <ResponseCard title="Final Answer" content={initialResult?.finalAnswer} isLoading={isLoadingInitial} />
                 </div>
            </section>

            {initialResult && !isLoadingInitial && (
                <section className="bg-card text-card-foreground p-6 sm:p-8 rounded-xl shadow-md border border-border space-y-6">
                    <h2 className="text-2xl font-bold text-center text-foreground">3. Silence Experts & Re-run</h2>
                    <div>
                        <div className="mb-6">
                            <h3 className="text-md font-semibold text-foreground mb-2">Mathematical Reasoning Presets</h3>
                            <p className="text-sm text-muted-foreground mb-3">Click a preset to automatically select which mathematical experts to silence, making it easier to observe how reasoning styles change.</p>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => handleSetPreset('rigorous')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border ${activePreset === 'rigorous' ? 'bg-primary/10 text-primary border-primary/50' : 'bg-muted text-muted-foreground hover:bg-muted/80 border-transparent'}`}>Rigorous Mode</button>
                                <button onClick={() => handleSetPreset('concise')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border ${activePreset === 'concise' ? 'bg-primary/10 text-primary border-primary/50' : 'bg-muted text-muted-foreground hover:bg-muted/80 border-transparent'}`}>Concise Mode</button>
                                <button onClick={() => handleSetPreset('estimation')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border ${activePreset === 'estimation' ? 'bg-primary/10 text-primary border-primary/50' : 'bg-muted text-muted-foreground hover:bg-muted/80 border-transparent'}`}>Estimation Mode</button>
                                <button onClick={() => handleSetPreset('plain')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border ${activePreset === 'plain' ? 'bg-destructive/10 text-destructive border-destructive/50' : 'bg-muted text-muted-foreground hover:bg-muted/80 border-transparent'}`}>Plain Mode (No Math)</button>
                                <button onClick={() => handleSetPreset('clear')} className="px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary rounded-md transition-colors border border-border">Clear All Selections</button>
                            </div>
                        </div>

                        <h3 className="text-md font-semibold text-foreground mb-3">Manual Selection (0-31)</h3>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                            {EXPERT_DEFINITIONS.map((expert) => (
                                <Tooltip
                                    key={expert.id}
                                    content={
                                        <div className="text-left">
                                            <p className="font-bold text-primary">{expert.name} (ID: {expert.id})</p>
                                            <p className="mt-1 text-popover-foreground/80">{expert.description}</p>
                                        </div>
                                    }
                                >
                                    <button
                                        onClick={() => toggleExpert(expert.id)}
                                        className={`w-full py-2 px-3 text-sm font-mono rounded-md border transition-colors duration-200 ${
                                            expertsToBlock.has(expert.id) 
                                            ? 'bg-destructive text-destructive-foreground border-transparent ring-2 ring-offset-2 ring-offset-background ring-destructive' 
                                            : 'bg-muted hover:bg-muted/70 border-border'
                                        }`}
                                    >
                                        {expert.id}
                                    </button>
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                     <button
                        onClick={handleRunAlteredQuery}
                        disabled={isLoadingAltered || expertsToBlock.size === 0}
                        className="w-full bg-accent text-accent-foreground font-bold text-lg py-3 px-6 rounded-lg shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center justify-center transition-all duration-300 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {isLoadingAltered ? <><LoadingSpinner size="sm" color="text-accent-foreground" className="mr-2.5"/>Re-running...</> : `Re-run with ${expertsToBlock.size} Expert(s) Silenced`}
                    </button>
                    
                    <div className="pt-6 space-y-6">
                        <h3 className="text-2xl font-bold text-center text-foreground">4. Altered Response</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ResponseCard title="Altered Expert Trace" content={alteredResult?.alteredTrace} isLoading={isLoadingAltered}>
                                Select experts and re-run to see altered trace.
                            </ResponseCard>
                            <ResponseCard title="Altered Final Answer" content={alteredResult?.alteredAnswer} isLoading={isLoadingAltered}>
                                Select experts and re-run to see altered answer.
                            </ResponseCard>
                        </div>
                         <ResponseCard title="Explanation" content={alteredResult?.explanation} isLoading={isLoadingAltered}>
                            Select experts and re-run to see explanation.
                        </ResponseCard>
                    </div>

                </section>
            )}

        </div>
    );
};

export default ExpertSilencingLab;
