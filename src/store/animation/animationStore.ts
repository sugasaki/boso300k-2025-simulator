import { create } from 'zustand';

type AnimationState = {
  animationFrameValue: number; // アニメーションの現在のフレーム
  animationFrameMin: number; // アニメーションの最小フレーム数
  animationFrameMax: number; // アニメーションの最大フレーム数
  animationSpeed: number; // アニメーションの速度
  isPlaying: boolean; // animationの再生状態
};

export const useAnimationStore = create<
  AnimationState & {
    setAnimationFrame: (frame: number) => void;
    setAnimationFrameMin: (max: number) => void;
    setAnimationFrameMax: (max: number) => void;
    setPlaying: (isPlaying: boolean) => void;
    setAnimationSpeed: (speed: number) => void;
    playingStart: () => void;
    playingStop: () => void;
  }
>(set => ({
  animationFrameValue: 0,
  animationFrameMin: 0,
  animationFrameMax: 10000,
  isPlaying: false,
  animationSpeed: 10,
  setAnimationFrame: frame => set({ animationFrameValue: frame }),
  setAnimationFrameMin: min => set({ animationFrameMin: min }),
  setAnimationFrameMax: max => set({ animationFrameMax: max }),
  setPlaying: isPlaying => set({ isPlaying }),
  setAnimationSpeed: speed => set({ animationSpeed: speed }),
  playingStart: () => set({ isPlaying: true }),
  playingStop: () => set({ isPlaying: false }),
}));
