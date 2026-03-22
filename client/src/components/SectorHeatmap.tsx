import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectorData {
    _id: string;
    challengeCount: number;
    totalSubmissions: number;
    avgEngagement: number;
}

interface SectorHeatmapProps {
    data: SectorData[];
}

export const SectorHeatmap: React.FC<SectorHeatmapProps> = ({ data }) => {
    const maxEngagement = Math.max(...data.map(d => d.avgEngagement || 0), 1);

    const getHeatColor = (engagement: number) => {
        const intensity = engagement / maxEngagement;
        if (intensity > 0.75) return 'bg-emerald-500/80';
        if (intensity > 0.5) return 'bg-teal-500/60';
        if (intensity > 0.25) return 'bg-cyan-500/40';
        return 'bg-slate-500/20';
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((sector, index) => (
                <motion.div
                    key={sector._id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                        "p-4 rounded-lg border border-border/50 backdrop-blur-sm transition-all hover:scale-105",
                        getHeatColor(sector.avgEngagement)
                    )}
                >
                    <h4 className="font-semibold text-sm mb-2 text-foreground">{sector._id}</h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                        <p>{sector.challengeCount} challenges</p>
                        <p>{sector.totalSubmissions} submissions</p>
                        <p className="font-medium text-foreground">
                            Score: {sector.avgEngagement.toFixed(1)}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
