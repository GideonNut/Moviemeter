"use client"

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

export default function BlockchainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Network nodes
    const nodes: Array<{
      x: number
      y: number
      vx: number
      vy: number
    }> = []

    // Create nodes
    const nodeCount = 80
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Draw node (make it bigger and more visible)
        ctx.beginPath()
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = theme === 'dark' ? 'rgba(147, 51, 234, 1)' : 'rgba(79, 70, 229, 1)'
        ctx.fill()

        // Draw glow effect
        ctx.beginPath()
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2)
        ctx.fillStyle = theme === 'dark' ? 'rgba(147, 51, 234, 0.3)' : 'rgba(79, 70, 229, 0.3)'
        ctx.fill()

        // Draw connections to nearby nodes
        nodes.slice(i + 1).forEach((otherNode) => {
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          )
          
          if (distance < 200) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            const opacity = (200 - distance) / 200
            ctx.strokeStyle = theme === 'dark' 
              ? `rgba(147, 51, 234, ${opacity * 0.5})` 
              : `rgba(79, 70, 229, ${opacity * 0.4})`
            ctx.lineWidth = 2
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [theme, mounted])

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 opacity-60"
      style={{ pointerEvents: 'none' }}
    />
  )
}