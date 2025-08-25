
import React from 'react';
import { LabType } from '../types/index';

interface LabSelectorProps {
    onSelectLab: (lab: LabType) => void;
}

const LabCard: React.FC<{ title: string, description: string, onClick: () => void }> = ({ title, description, onClick }) => (
    <button
        onClick={onClick}
        className="bg-card text-card-foreground p-8 rounded-xl shadow-lg border border-border w-full max-w-lg text-left transform transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
    >
        <h2 className="text-2xl font-bold text-primary mb-3">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
        <div className="mt-6 text-sm font-semibold text-primary group-hover:underline">
            Enter Lab &rarr;
        </div>
    </button>
);


const LabSelector: React.FC<LabSelectorProps> = ({ onSelectLab }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 py-10">
            <div className="text-center max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                    Welcome to the AI Safety & Alignment Lab
                </h1>
                <p className="text-lg text-muted-foreground">
                    Select an experiment below to begin investigating advanced model behaviors, from cross-lingual policy adherence to internal expert routing.
                </p>
            </div>

            <div className="w-full flex flex-col items-center justify-center gap-8 pt-8">
                <LabCard
                    title="Shadow Reasoning"
                    description="Investigate how providing specific reasoning policies affects a model's behavior, analyzing policy adherence and output consistency."
                    onClick={() => onSelectLab('steering')}
                />
                <LabCard
                    title="Selective Expert Silencing"
                    description="Simulate a Mixture-of-Experts (MoE) model to see its internal expert routing. Block specific experts and observe how the model's reasoning and final answer change."
                    onClick={() => onSelectLab('silencing')}
                />
            </div>
        </div>
    );
};

export default LabSelector;