import {create} from 'zustand';

export const useAppStore = create((set) => ({
    inputText: '',
    setInputText: (v) => set({inputText: v}),

    result: null, // { lat, lon, displayName }
    setResult: (r) => set({result: r}),

    suggestions: [],
    setSuggestions: (s) => set({suggestions: s}),
}));
