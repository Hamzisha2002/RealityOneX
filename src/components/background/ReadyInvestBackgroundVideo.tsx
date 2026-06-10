import { SmoothLoopVideo } from './SmoothLoopVideo';

export const ReadyInvestBackgroundVideo = () => (
  <SmoothLoopVideo src="/videos/bg4.mp4" overlay={ <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/70 via-background/62 to-background/78" /> } />
);
