import { useAnimationStore } from '../store/animation/animationStore';
import { formatUnixTime } from '../utils/dateUtils';

export const AnimationFrame = () => {
  const { animationFrameValue } = useAnimationStore();

  return (
    <div className="fixed bottom-17 left-5 z-10">
      <div className="text-xl md:text-3xl lg:text-4xl text-gray-600 font-bold">
        {formatUnixTime(animationFrameValue)}
      </div>
    </div>
  );
};
