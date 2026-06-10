import { SmoothLoopVideo } from './SmoothLoopVideo';

export const WhyChooseBackgroundVideo = () => (
  <SmoothLoopVideo src="/videos/bg3.mp4" overlay={ <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/70 via-background/60 to-background/75" /> } />
);
