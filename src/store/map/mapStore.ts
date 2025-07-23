import { create } from 'zustand';
import { PersonLocation } from '../../types/map';

interface MapState {
  personLocation: PersonLocation[] | null;
  visibleCategories: number[];
  isTextLayerVisible: boolean;
  pointSize: number;
  setPersonLocationData: (data: PersonLocation[] | null) => void;
  setVisibleCategories: (categories: number[]) => void;
  toggleCategoryVisibility: (category: number) => void;
  toggleTextLayerVisibility: () => void;
  setTextLayerVisibility: (isVisible: boolean) => void;
  setPointSize: (size: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

export const useMapStore = create<MapState>(set => ({
  personLocation: null,
  visibleCategories: [], // Initially all categories are visible (empty array means all visible)
  isTextLayerVisible: true, // Text layer is visible by default
  pointSize: 100, // Default point size
  fontSize: 14,
  setPersonLocationData: data => set({ personLocation: data }),

  setVisibleCategories: categories => set({ visibleCategories: categories }),

  toggleCategoryVisibility: category =>
    set(state => {
      const isCurrentlyVisible = state.visibleCategories.includes(category);

      if (isCurrentlyVisible) {
        // Remove category from visible list
        return {
          visibleCategories: state.visibleCategories.filter(
            c => c !== category
          ),
        };
      } else {
        // Add category to visible list
        return {
          visibleCategories: [...state.visibleCategories, category],
        };
      }
    }),
    
  toggleTextLayerVisibility: () =>
    set(state => ({ isTextLayerVisible: !state.isTextLayerVisible })),
    
  setTextLayerVisibility: isVisible => set({ isTextLayerVisible: isVisible }),
  
  setPointSize: size => set({ pointSize: size }),
    
  setFontSize: size => set({ fontSize: size }),
}));
