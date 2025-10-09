import { create } from 'zustand';


const useFilesStore = create(set => ({
  files: [],
  topFolder: '-',
  installsFolder: '-',
  setFiles: (files = [], topFolder = '-', installsFolder = '-') => set(state => ({ files, topFolder, installsFolder })),
}));


export default useFilesStore;
