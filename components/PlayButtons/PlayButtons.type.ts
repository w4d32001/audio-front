export type PlayButtonsProps = {
    onPlayPause: () => void;
    onSkipBack: () => void; 
    onStepForward: () => void; 
    onSkipNext: () => void;
    onSkipPrev: () => void;
    isPlaying: boolean;
}