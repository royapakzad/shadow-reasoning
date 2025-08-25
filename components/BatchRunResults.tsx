
import React, { useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { BatchResult, DefinitiveAnswer } from '../types/index';

const createMarkup = (markdownText: string | undefined | null) => {
    if (!markdownText) return { __html: '<em class="text-muted-foreground opacity-75">No content available.</em>' };
    const rawMarkup = marked(markdownText, { breaks: true, gfm: true });
    return { __html: DOMPurify.sanitize(rawMarkup as string) };
};

const ResultDetail: React.FC<{ title: string; answer: string; reasoning: string | null; definitiveAnswer: DefinitiveAnswer }> = ({ title, answer, reasoning, definitiveAnswer }) => (
    <div className="bg-muted/50 p-3 rounded-md border border-border">
        <h5 className="font-semibold text-foreground text-sm flex justify-between items-center">
            <span>{title}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
                definitiveAnswer === 'Yes' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                : definitiveAnswer === 'No' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' 
                : definitiveAnswer === 'Refusal' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
                {definitiveAnswer}
            </span>
        </h5>
        <div className="mt-2 text-xs space-y-2">
            <details>
                <summary className="cursor-pointer text-primary/80 font-medium">Show Answer & Reasoning</summary>
                <div className="mt-1 p-2 bg-background rounded prose prose-sm dark:prose-invert max-w-none">
                    <p className="font-bold">Answer:</p>
                    <div dangerouslySetInnerHTML={createMarkup(answer)} />
                    {reasoning && <>
                        <p className="font-bold mt-2">Reasoning:</p>
                        <div dangerouslySetInnerHTML={createMarkup(reasoning)} />
                    </>}
                </div>
            </details>
        </div>
    </div>
);

const BatchRunResults: React.FC<{ results: BatchResult[]; isRunning: boolean }> = ({ results, isRunning }) => {
    const [openRowId, setOpenRowId] = useState<number | null>(null);

    const inconsistentCount = results.filter(r => r.hasInconsistency).length;

    const handleDownloadCsv = () => {
        const headers = [
            'scenario_id', 'prompt', 'has_inconsistency',
            'no_policy_answer', 'no_policy_reasoning', 'no_policy_definitive',
            'eng_policy_answer', 'eng_policy_reasoning', 'eng_policy_definitive',
            'nat_policy_answer', 'nat_policy_reasoning', 'nat_policy_definitive',
        ];

        const csvRows = results.map(row => {
            const data = [
                row.scenarioId,
                row.prompt,
                row.hasInconsistency,
                ...row.results.flatMap((res, i) => [res.answer, res.reasoning, row.answers[i]]),
            ];
            return data.map(value => {
                const str = String(value ?? '').replace(/"/g, '""');
                return `"${str}"`;
            }).join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'batch_run_results.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section className="mt-10 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-foreground">{isRunning ? 'Batch Run Progress' : 'Batch Run Results'}</h2>
            <div className="bg-card text-card-foreground p-6 rounded-xl shadow-md border border-border">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-lg font-semibold">Summary</h3>
                        <p className="text-sm text-muted-foreground">({results.length} scenarios processed)</p>
                    </div>
                     <button onClick={handleDownloadCsv} disabled={isRunning} className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors border bg-primary text-primary-foreground hover:bg-primary-hover disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed">
                        {isRunning ? 'Download available when complete' : 'Download Report (CSV)'}
                    </button>
                </div>

                <div className="text-center bg-muted p-4 rounded-md">
                    <p className="text-3xl font-bold text-destructive">{inconsistentCount} / {results.length}</p>
                    <p className="text-sm text-muted-foreground">Scenarios with Inconsistencies</p>
                </div>

                <div className="mt-6 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-border">
                                <thead>
                                    <tr>
                                        <th scope="col" className="w-12"></th>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-0">Scenario</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Prompt</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {results.map(row => (
                                        <React.Fragment key={row.scenarioId}>
                                            <tr>
                                                <td>
                                                    <button onClick={() => setOpenRowId(openRowId === row.scenarioId ? null : row.scenarioId)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 text-muted-foreground transition-transform ${openRowId === row.scenarioId ? 'rotate-90' : ''}`}>
                                                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </td>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-0">{row.scenarioId}</td>
                                                <td className="px-3 py-4 text-sm text-muted-foreground truncate max-w-lg">{row.prompt}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.hasInconsistency ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'}`}>
                                                        {row.hasInconsistency ? 'Inconsistent' : 'Consistent'}
                                                    </span>
                                                </td>
                                            </tr>
                                            {openRowId === row.scenarioId && (
                                                <tr>
                                                    <td colSpan={4} className="p-4 bg-background">
                                                        <div className="space-y-4">
                                                            <div>
                                                                <h4 className="font-semibold text-sm mb-2">Prompt</h4>
                                                                <p className="text-xs p-2 bg-muted rounded"><strong>English:</strong> {row.prompt}</p>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <h4 className={`font-semibold text-sm ${row.hasInconsistency ? 'text-destructive' : ''}`}>Experiment Results</h4>
                                                                <ResultDetail title="No Policy" answer={row.results[0].answer} reasoning={row.results[0].reasoning} definitiveAnswer={row.answers[0]} />
                                                                <ResultDetail title="English Policy" answer={row.results[1].answer} reasoning={row.results[1].reasoning} definitiveAnswer={row.answers[1]} />
                                                                <ResultDetail title="Native Language Policy" answer={row.results[2].answer} reasoning={row.results[2].reasoning} definitiveAnswer={row.answers[2]} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BatchRunResults;