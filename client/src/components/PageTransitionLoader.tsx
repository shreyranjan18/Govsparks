import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface PageTransitionLoaderProps {
    isLoading: boolean;
}

export const PageTransitionLoader: React.FC<PageTransitionLoaderProps> = ({ isLoading }) => {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <Loader2 className="w-12 h-12 text-primary" />
                        </motion.div>
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
