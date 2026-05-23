import { useState, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

interface JoystickState {
  x: number
  y: number
  active: boolean
}

function TouchControls() {
  const [joystick, setJoystick] = useState<JoystickState>({ x: 0, y: 0, active: false })
  const joystickRef = useRef<HTMLDivElement>(null)
  const joystickBaseRef = useRef<HTMLDivElement>(null)
  const { updateInput } = useGameStore()

  const JOYSTICK_RADIUS = 50
  const TOUCH_SIZE = 120

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!joystickRef.current || !joystickBaseRef.current) return

    const touch = e.touches[0]
    const rect = joystickBaseRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const dx = touch.clientX - centerX
    const dy = touch.clientY - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx)

    const limitedDistance = Math.min(distance, JOYSTICK_RADIUS)
    const x = Math.cos(angle) * limitedDistance
    const y = Math.sin(angle) * limitedDistance

    setJoystick({ x, y, active: true })
    updateInput({ joystickX: x / JOYSTICK_RADIUS, joystickY: y / JOYSTICK_RADIUS })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!joystick.active || !joystickBaseRef.current) return

    const touch = e.touches[0]
    const rect = joystickBaseRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const dx = touch.clientX - centerX
    const dy = touch.clientY - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx)

    const limitedDistance = Math.min(distance, JOYSTICK_RADIUS)
    const x = Math.cos(angle) * limitedDistance
    const y = Math.sin(angle) * limitedDistance

    setJoystick({ x, y, active: true })
    updateInput({ joystickX: x / JOYSTICK_RADIUS, joystickY: y / JOYSTICK_RADIUS })
  }

  const handleTouchEnd = () => {
    setJoystick({ x: 0, y: 0, active: false })
    updateInput({ joystickX: 0, joystickY: 0 })
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: 20,
      width: TOUCH_SIZE,
      height: TOUCH_SIZE,
      zIndex: 50,
    }}>
      {/* Joystick base */}
      <div
        ref={joystickBaseRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'absolute',
          width: TOUCH_SIZE,
          height: TOUCH_SIZE,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)',
        }}
      >
        {/* Joystick stick */}
        <div
          ref={joystickRef}
          style={{
            position: 'absolute',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.6)',
            transform: `translate(${joystick.x}px, ${joystick.y}px)`,
            transition: joystick.active ? 'none' : 'transform 0.2s ease-out',
            boxShadow: '0 0 10px rgba(100, 200, 255, 0.8)',
          }}
        />
      </div>

      {/* Action buttons */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        display: 'flex',
        gap: 10,
        zIndex: 50,
      }}>
        {/* Jump button */}
        <button
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(100, 150, 255, 0.6)',
            border: '2px solid rgba(255, 255, 255, 0.5)',
            color: 'white',
            fontSize: 24,
            cursor: 'pointer',
            backdropFilter: 'blur(5px)',
            transition: 'all 0.2s',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.9)'
            updateInput({ jump: true })
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            updateInput({ jump: false })
          }}
          onTouchStart={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.9)'
            updateInput({ jump: true })
          }}
          onTouchEnd={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
            updateInput({ jump: false })
          }}
        >
          ⬆️
        </button>

        {/* Place block button */}
        <button
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(100, 255, 150, 0.6)',
            border: '2px solid rgba(255, 255, 255, 0.5)',
            color: 'white',
            fontSize: 24,
            cursor: 'pointer',
            backdropFilter: 'blur(5px)',
            transition: 'all 0.2s',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.9)'
            updateInput({ placeBlock: true })
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            updateInput({ placeBlock: false })
          }}
          onTouchStart={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.9)'
            updateInput({ placeBlock: true })
          }}
          onTouchEnd={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
            updateInput({ placeBlock: false })
          }}
        >
          🟫
        </button>
      </div>
    </div>
  )
}

export default TouchControls