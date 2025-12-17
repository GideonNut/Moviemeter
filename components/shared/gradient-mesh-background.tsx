"use client"

import { motion } from 'framer-motion'

export default function GradientMeshBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Main gradient mesh - made much more visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-blue-600/40 to-green-500/40 dark:from-purple-900/50 dark:via-blue-900/50 dark:to-green-900/50" />
      
      {/* Animated blobs - increased opacity and size */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/60 to-pink-500/60 rounded-full mix-blend-multiply filter blur-2xl"
        animate={{
          x: [0, 150, 0],
          y: [0, -100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-blue-500/60 to-cyan-500/60 rounded-full mix-blend-multiply filter blur-2xl"
        animate={{
          x: [0, -120, 0],
          y: [0, 100, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-gradient-to-r from-green-500/60 to-emerald-500/60 rounded-full mix-blend-multiply filter blur-2xl"
        animate={{
          x: [0, 200, 0],
          y: [0, -120, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />

      {/* Additional overlay for more depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/20" />

      {/* Floating geometric shapes - made more visible */}
      <motion.div
        className="absolute top-20 right-20 w-6 h-6 bg-purple-500/80 rotate-45 shadow-lg"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute bottom-32 left-16 w-8 h-8 border-2 border-blue-500/80 rounded-full shadow-lg"
        animate={{
          y: [0, -30, 0],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-1/2 left-20 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-70"
        animate={{
          x: [0, 50, 0],
          y: [0, -25, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        className="absolute bottom-1/3 right-1/3 w-3 h-12 bg-gradient-to-b from-pink-400 to-purple-600 opacity-60"
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
    </div>
  )
}