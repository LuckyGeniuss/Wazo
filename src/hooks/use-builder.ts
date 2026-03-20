import { create } from 'zustand';
import { EditorBlock } from '@/types/builder';

interface BuilderStore {
  blocks: EditorBlock[];
  selectedBlockId: string | null;
  addBlock: (block: EditorBlock, targetColumnId?: string) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, newContent: Partial<EditorBlock['content']>, newStyles?: Partial<EditorBlock['styles']>, newSettings?: Partial<EditorBlock['settings']>) => void;
  selectBlock: (id: string | null) => void;
  setBlocks: (blocks: EditorBlock[]) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  reorderBlocksById: (activeId: string, overId: string) => void;
}

const addRecursive = (blocks: EditorBlock[], block: EditorBlock, targetColumnId: string): EditorBlock[] => {
  return blocks.map(b => {
    if (b.type === 'Columns') {
      return {
        ...b,
        content: {
          ...b.content,
          columns: b.content.columns.map(col => {
            if (col.id === targetColumnId) {
              return { ...col, blocks: [...col.blocks, block] };
            }
            return { ...col, blocks: addRecursive(col.blocks, block, targetColumnId) };
          })
        }
      };
    }
    return b;
  });
};

const removeRecursive = (blocks: EditorBlock[], id: string): EditorBlock[] => {
  return blocks.filter(b => b.id !== id).map(b => {
    if (b.type === 'Columns') {
      return {
        ...b,
        content: {
          ...b.content,
          columns: b.content.columns.map(col => ({
            ...col,
            blocks: removeRecursive(col.blocks, id)
          }))
        }
      };
    }
    return b;
  });
};

const updateRecursive = (
  blocks: EditorBlock[], 
  id: string, 
  newContent?: Partial<EditorBlock['content']>, 
  newStyles?: Partial<EditorBlock['styles']>,
  newSettings?: Partial<EditorBlock['settings']>
): EditorBlock[] => {
  return blocks.map((block) => {
    if (block.id === id) {
      return {
        ...block,
        content: { ...block.content, ...(newContent || {}) },
        styles: { ...block.styles, ...(newStyles || {}) },
        settings: { ...block.settings, ...(newSettings || {}) }
      } as EditorBlock;
    }
    
    if (block.type === 'Columns') {
      return {
        ...block,
        content: {
          ...block.content,
          columns: block.content.columns.map(col => ({
            ...col,
            blocks: updateRecursive(col.blocks, id, newContent, newStyles, newSettings)
          }))
        }
      };
    }
    
    return block;
  });
};

export const useBuilder = create<BuilderStore>((set) => ({
  blocks: [],
  selectedBlockId: null,
  
  addBlock: (block, targetColumnId) => set((state) => ({ 
    blocks: targetColumnId 
      ? addRecursive(state.blocks, block, targetColumnId)
      : [...state.blocks, block] 
  })),
  
  removeBlock: (id) => set((state) => ({ 
    blocks: removeRecursive(state.blocks, id),
    selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId
  })),
  
  updateBlock: (id, newContent, newStyles, newSettings) => set((state) => ({
    blocks: updateRecursive(state.blocks, id, newContent, newStyles, newSettings)
  })),
  
  selectBlock: (id) => set({ selectedBlockId: id }),
  
  setBlocks: (blocks) => set({ blocks, selectedBlockId: null }),

  reorderBlocks: (startIndex, endIndex) => set((state) => {
    const result = Array.from(state.blocks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return { blocks: result };
  }),

  reorderBlocksById: (activeId, overId) => set((state) => {
    const oldIndex = state.blocks.findIndex(b => b.id === activeId);
    const newIndex = state.blocks.findIndex(b => b.id === overId);
    
    if (oldIndex === -1 || newIndex === -1) return state;
    
    const blocks = Array.from(state.blocks);
    const [removed] = blocks.splice(oldIndex, 1);
    blocks.splice(newIndex, 0, removed);
    
    return { blocks };
  }),
}));
