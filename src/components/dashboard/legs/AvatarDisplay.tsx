'use client';
import Rive, { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

export default function AvatarDisplay({ action }: { action: string }) {
  // Replace with the actual path to your .riv file in the /public folder
  const { RiveComponent } = useRive({
    src: '/avatar-walking.riv',
    stateMachines: 'State Machine 1', // Match your Rive file's state machine name
    animations: action, // This maps to your Sanity 'avatarAction' field
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  return (
    <div className="w-full h-full">
      <RiveComponent />
    </div>
  );
}
