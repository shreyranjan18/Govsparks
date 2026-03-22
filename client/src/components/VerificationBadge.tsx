import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationBadgeProps {
    isVerified: boolean;
    type: 'government' | 'entrepreneur';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
    isVerified,
    type,
    size = 'md',
    showLabel = false
}) => {
    if (!isVerified) return null;

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const icon = type === 'government' ? <Shield className={sizeClasses[size]} /> : <BadgeCheck className={sizeClasses[size]} />;
    const label = type === 'government' ? 'Government Verified' : 'Verified Startup';
    const colorClass = type === 'government' ? 'text-blue-500' : 'text-emerald-500';

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn("inline-flex items-center gap-1", colorClass)}
        >
            {icon}
            {showLabel && <span className="text-xs font-medium">{label}</span>}
        </motion.div>
    );
};
