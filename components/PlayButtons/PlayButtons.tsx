import { SkipBack, Play, StepForward, Pause } from 'lucide-react'
import React from 'react'
import { PlayButtonsProps } from './PlayButtons.type'

export default function PlayButtons(props: PlayButtonsProps) {

    const {onPlayPause, onSkipBack, onStepForward, isPlaying} = props

  return (
    <div className="text-xl flex items-center justify-between gap-x-8">
    <SkipBack
      strokeWidth={3}
      className="cursor-pointer hover:text-orange-700"
      onClick={onSkipBack}
    />
    
    {isPlaying ? (
      <Pause
        strokeWidth={3}
        className="cursor-pointer hover:text-orange-700"
        onClick={onPlayPause}
      />
    ) : (
      <Play
        strokeWidth={3}
        className="cursor-pointer hover:text-orange-700"
        onClick={onPlayPause}
      />
    )}
    
    <StepForward
      strokeWidth={3}
      className="cursor-pointer hover:text-orange-700"
      onClick={onStepForward}
    />
  </div>
  )
}
