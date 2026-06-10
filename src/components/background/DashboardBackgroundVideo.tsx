import { SmoothLoopVideo } from './SmoothLoopVideo';

export const DashboardBackgroundVideo = () => (
  <SmoothLoopVideo src="/videos/bg5.mp4" overlay={ <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/75 via-background/62 to-background/78" /> } />
);
