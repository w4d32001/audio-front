import React from 'react'
import { MusicProps } from './Music.type'
import { Trash2 } from 'lucide-react'

export default function Music(props: MusicProps) {

    const {image, title, artist, onClick, onDelete} = props

  return (
    <div className='flex cursor-pointer hover:bg-orange-900/50 relative items-center gap-x-8 h-24 p-4 text-white rounded-lg transition-colors' onClick={onClick} >
        <img src={image} alt={title} className='w-20 rounded-full'/>
        <div className='flex flex-col gap-y-4'>
          <span className='font-gummy text-lg'>{title}</span>
          <span className='text-sm font-sans text-slate-500'>{artist}</span>
        </div>
        <Trash2
        className='absolute top-2 right-2 hover:text-red-700 cursor-pointer transition-colors'
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      />
    </div>
  )
}


