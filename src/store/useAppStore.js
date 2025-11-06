import {create} from 'zustand';

export const useAppStore = create((set) => ({
    inputText: '',
    result: null, // { lat, lon, displayName }
    setInputText: (v) => set({inputText: v}),
    setResult: (r) => set({result: r}),
}));
