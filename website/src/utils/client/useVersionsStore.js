import { create } from 'zustand';


const useVersionsStore = create(set => ({
  versions: [],
  setVersions: (versions = []) => set(state => ({ versions })),
}));


export default useVersionsStore;
