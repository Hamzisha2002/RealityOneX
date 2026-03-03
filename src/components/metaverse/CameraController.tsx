import { useCameraController } from '@/hooks/useKeyboardControls';
import { Html } from '@react-three/drei';

export const CameraController = () => {
  const keys = useCameraController(0.3);
  
  const isMoving = keys.forward || keys.backward || keys.left || keys.right;

  return (
    <Html fullscreen style={{ pointerEvents: 'none' }}>
      {!isMoving && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-card px-6 py-3 flex items-center gap-4 animate-fade-in">
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1">
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">W</kbd>
            </div>
            <div className="flex gap-1">
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">A</kbd>
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">S</kbd>
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">D</kbd>
            </div>
          </div>
          <span className="text-muted-foreground text-sm">Move</span>
          <div className="w-px h-8 bg-border" />
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Space</kbd>
          <span className="text-muted-foreground text-sm">Up</span>
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Shift</kbd>
          <span className="text-muted-foreground text-sm">Down</span>
        </div>
      )}
    </Html>
  );
};
