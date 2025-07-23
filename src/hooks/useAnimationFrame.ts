import { useEffect, useRef, useCallback } from 'react';
import { useAnimationStore } from '../store/animation/animationStore';

interface UseAnimationFrameOptions {
  autoStart?: boolean;
  autoStartDelay?: number;
}

export const useAnimationFrame = ({
  autoStart = false,
  autoStartDelay = 0,
}: UseAnimationFrameOptions = {}) => {
  const animationRef = useRef<number | undefined>(undefined);
  const { isPlaying, setAnimationFrame, setPlaying } = useAnimationStore();

  // アニメーションフレームの更新
  const updateAnimationFrame = useCallback(() => {
    const {
      isPlaying: currentIsPlaying,
      animationFrameValue,
      animationSpeed,
      animationFrameMin,
      animationFrameMax,
    } = useAnimationStore.getState();

    let nextValue = animationFrameValue + animationSpeed;
    if (nextValue > animationFrameMax) nextValue = animationFrameMin;
    if (nextValue < animationFrameMin) nextValue = animationFrameMin;

    setAnimationFrame(nextValue);

    if (currentIsPlaying) {
      animationRef.current = requestAnimationFrame(updateAnimationFrame);
    }
  }, [setAnimationFrame]);

  // アニメーションの開始と停止
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateAnimationFrame);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, [isPlaying, updateAnimationFrame]);

  // 自動開始
  useEffect(() => {
    if (autoStart) {
      const timer = setTimeout(() => setPlaying(true), autoStartDelay);
      return () => clearTimeout(timer);
    }
  }, [autoStart, autoStartDelay, setPlaying]);

  // アニメーションフレームのリセット
  const resetAnimation = () => {
    const { animationFrameMin } = useAnimationStore.getState();

    setAnimationFrame(animationFrameMin);
  };

  return {
    startAnimation: () => setPlaying(true),
    stopAnimation: () => setPlaying(false),
    resetAnimation,
    isPlaying,
  };
};
