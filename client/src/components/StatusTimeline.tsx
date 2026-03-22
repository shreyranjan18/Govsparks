import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Rocket, Award, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusStep {
    status: string;
    label: string;
    icon: React.ReactNode;
    color: string;
}

const statusSteps: StatusStep[] = [
    { status: 'submitted', label: 'Submitted', icon: <Circle className="w-5 h-5" />, color: 'text-blue-500' },
    { status: 'under review', label: 'Under Review', icon: <Clock className="w-5 h-5" />, color: 'text-yellow-500' },
    { status: 'shortlisted', label: 'Shortlisted', icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-purple-500' },
    { status: 'pilot', label: 'Pilot Active', icon: <Rocket className="w-5 h-5" />, color: 'text-teal-500' },
    { status: 'approved', label: 'Approved', icon: <Award className="w-5 h-5" />, color: 'text-green-500' },
];

interface StatusTimelineProps {
    currentStatus: string;
    statusHistory?: Array<{
        status: string;
        changedAt: Date | string;
        changedBy?: {
            username: string;
            organization?: string;
        };
    }>;
    isInteractive?: boolean;
    onStatusChange?: (status: string) => void;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
    currentStatus,
    statusHistory = [],
    isInteractive = false,
    onStatusChange
}) => {
    const currentIndex = statusSteps.findIndex(step => step.status === currentStatus);
    const isRejected = currentStatus === 'rejected';

    const getStepState = (index: number) => {
        if (isRejected && index > 0) return 'rejected';
        if (index < currentIndex) return 'completed';
        if (index === currentIndex) return 'current';
        return 'upcoming';
    };

    const getTimeSpent = (status: string) => {
        const history = statusHistory.find(h => h.status === status);
        if (!history) return null;

        const changedAt = new Date(history.changedAt);
        const now = new Date();
        const days = Math.floor((now.getTime() - changedAt.getTime()) / (1000 * 60 * 60 * 24));

        return days > 0 ? `${days}d ago` : 'Today';
    };

    return (
        <div className="w-full py-8">
            {/* Timeline Container */}
            <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
                <motion.div
                    className={cn(
                        "absolute top-6 left-0 h-0.5",
                        isRejected ? "bg-red-500" : "bg-primary"
                    )}
                    initial={{ width: 0 }}
                    animate={{
                        width: isRejected ? '20%' : `${(currentIndex / (statusSteps.length - 1)) * 100}%`
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />

                {/* Steps */}
                <div className="relative flex justify-between">
                    {statusSteps.map((step, index) => {
                        const state = getStepState(index);
                        const timeSpent = getTimeSpent(step.status);

                        return (
                            <motion.div
                                key={step.status}
                                className="flex flex-col items-center flex-1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {/* Icon Circle */}
                                <motion.button
                                    onClick={() => isInteractive && onStatusChange?.(step.status)}
                                    disabled={!isInteractive}
                                    className={cn(
                                        "relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all",
                                        "border-2 backdrop-blur-sm",
                                        state === 'completed' && "bg-primary/20 border-primary text-primary",
                                        state === 'current' && "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/50",
                                        state === 'upcoming' && "bg-muted border-border text-muted-foreground",
                                        state === 'rejected' && "bg-red-500/20 border-red-500 text-red-500",
                                        isInteractive && "cursor-pointer hover:scale-110"
                                    )}
                                    whileHover={isInteractive ? { scale: 1.1 } : {}}
                                    whileTap={isInteractive ? { scale: 0.95 } : {}}
                                >
                                    {state === 'completed' ? (
                                        <CheckCircle2 className="w-6 h-6" />
                                    ) : state === 'rejected' ? (
                                        <XCircle className="w-6 h-6" />
                                    ) : (
                                        <div className={step.color}>{step.icon}</div>
                                    )}

                                    {/* Pulse Animation for Current */}
                                    {state === 'current' && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-primary"
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    )}
                                </motion.button>

                                {/* Label */}
                                <div className="mt-3 text-center">
                                    <p className={cn(
                                        "text-sm font-medium",
                                        state === 'current' && "text-primary",
                                        state === 'completed' && "text-foreground",
                                        state === 'upcoming' && "text-muted-foreground",
                                        state === 'rejected' && "text-red-500"
                                    )}>
                                        {step.label}
                                    </p>
                                    {timeSpent && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {timeSpent}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Rejected Status */}
            {isRejected && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20"
                >
                    <div className="flex items-center gap-2 text-red-500">
                        <XCircle className="w-5 h-5" />
                        <span className="font-medium">Application Rejected</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
