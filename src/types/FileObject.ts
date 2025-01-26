export type FileObject = {
  id: number;
  name: string;
  type: "file" | "folder";
  url?: string; // Only for files
  children?: FileObject[]; //Only for Folders
};
