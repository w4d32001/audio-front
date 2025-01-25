import { SkipBack, Play, StepForward, Pause } from 'lucide-react'
import React from 'react'
import { PlayButtonsProps } from './PlayButtons.type'

export default function PlayButtons(props: PlayButtonsProps) {

  const { onPlayPause, onSkipBack, onStepForward, isPlaying, onSkipNext, onSkipPrev } = props

  return (
    <div className="text-3xl flex items-center justify-between gap-x-6"> 
    
      <button
        onClick={onSkipPrev}
        className="cursor-pointer hover:text-orange-700 transition-transform duration-200 transform hover:scale-125"
      >
        <SkipBack strokeWidth={3} />
      </button>

      <button
        onClick={onSkipBack}
        className="cursor-pointer hover:text-orange-700 transition-transform duration-200 transform hover:scale-125"
      >
         <StepForward strokeWidth={3} className='rotate-180'/>
      </button>
      
      {isPlaying ? (
        <button
          onClick={onPlayPause}
          className="cursor-pointer hover:text-orange-700 transition-transform duration-200 transform hover:scale-125"
        >
          <Pause strokeWidth={3} />
        </button>
      ) : (
        <button
          onClick={onPlayPause}
          className="cursor-pointer hover:text-orange-700 transition-transform duration-200 transform hover:scale-125"
        >
          <Play strokeWidth={3} />
        </button>
      )}
      
      <button
        onClick={onStepForward}
        className="cursor-pointer hover:text-orange-700 transition-transform duration-200 transform hover:scale-125"
      >
        <StepForward strokeWidth={3} />
      </button>
      
      <button
        onClick={onSkipNext}
        className="cursor-pointer hover:text-orange-700 transition-transform duration-200 transform hover:scale-125"
      >
        <SkipBack strokeWidth={3} className='rotate-180' />
      </button>
    </div>
  )
}
