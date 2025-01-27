import { FileObject } from "@/types";
import ImageConverter from "./ImageConverter";

const ProcessFolder = async (files: FileList, uploadFiles: FileObject[]) => {
  const folderStructure: FileObject[] = [];
  const folderMap: Record<string, FileObject> = {};

  for (const file of files) {
    const path = file.webkitRelativePath.split("/");
    const folderName = path[0];
    const fileName = path[path.length - 1];

    if (!folderMap[folderName]) {
      folderMap[folderName] = {
        id: uploadFiles.length + folderStructure.length + 1,
        name: folderName,
        type: "folder",
        children: [],
      };
      folderStructure.push(folderMap[folderName]);
    }

    folderMap[folderName].children!.push({
      id: uploadFiles.length + folderStructure.length + 1,
      name: fileName,
      type: "file",
      url: await ImageConverter(file), // Replace with ImageConverter if needed
    });
  }

  return folderStructure;
};
export default ProcessFolder;
