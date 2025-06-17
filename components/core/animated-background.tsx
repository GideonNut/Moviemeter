import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedBackgroundProps {
  children: ReactNode;
  transition?: {
    type: string;
    bounce: number;
    duration: number;
  };
  enableHover?: boolean;
}

export function AnimatedBackground({ children, transition, enableHover }: AnimatedBackgroundProps) {
  return (
    <motion.div
      className="w-full h-full"
      whileHover={enableHover ? { scale: 1.02 } : undefined}
      transition={transition}
    >
      {children}
    </motion.div>
  );
} 