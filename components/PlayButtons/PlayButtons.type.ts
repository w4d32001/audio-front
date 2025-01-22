export type PlayButtonsProps = {
    onPlayPause: () => void;
    onSkipBack: () => void; 
    onStepForward: () => void; 
    isPlaying: boolean;
}