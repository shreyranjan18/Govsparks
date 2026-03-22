import { useNavigate, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export const FloatingHomeButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show on home page
    if (location.pathname === '/') return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <Button
                    onClick={() => navigate('/')}
                    size="icon"
                    className="rounded-full w-12 h-12 shadow-lg bg-primary hover:bg-primary/90 transition-all hover:scale-110"
                    title="Go Home"
                >
                    <Home className="w-5 h-5 text-primary-foreground" />
                </Button>
            </motion.div>
        </AnimatePresence>
    );
};
