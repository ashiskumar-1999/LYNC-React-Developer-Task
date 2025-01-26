import React, { useEffect, useState } from "react";
import Uploader from "@/components/Uploader";
import ImageConverter from "@/utils/ImageConverter";
import Sidebar from "@/components/SideNav";
import { FileObject } from "@/types";

export default function Home() {
  const [fileName, setFileName] = useState("No files or folder chosen");
  const [file, setFile] = useState<File | FileList | null>();
  const [uploadFiles, setUploadFiles] = useState<FileObject[]>([]);
  const [isFolderUpload, setIsFolderUpload] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      const isFolder = !!uploadedFiles[0]?.webkitRelativePath;
      console.log(isFolder);
      setIsFolderUpload(isFolder);

      if (isFolder) {
        setFileName(uploadedFiles[0].webkitRelativePath.split("/")[0]);
      } else {
        setFileName(uploadedFiles[0].name);
      }

      setFile(uploadedFiles[0]);
    } else {
      setFileName("No files or folder chosen");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (fileName !== "" && file) {
      let fileObjects: FileObject[] = [];

      if (isFolderUpload && file instanceof FileList) {
        // Handle folder upload
        fileObjects = await processFolder(file);
      } else {
        // Handle single file upload
        const convertedFile = await ImageConverter(file);
        fileObjects.push({
          id: uploadFiles.length + 1,
          name: fileName,
          type: "file",
          url: convertedFile,
        });
      }

      // Update uploadFiles with new files or folder structure
      const updatedFiles = [...uploadFiles, ...fileObjects];
      setUploadFiles(updatedFiles);

      // Save to localStorage
      window.localStorage.setItem(
        "uploadedFiles",
        JSON.stringify(updatedFiles)
      );

      // Reset file input
      setFileName("No files or folder Chosen");
      setFile(null);

      // Dispatch storage update event
      window.dispatchEvent(new Event("storageUpdate"));
    }
  };

  const processFolder = async (files: FileList) => {
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

  const handleDeleteFiles = (id: number) => {
    if (typeof window !== undefined) {
      const updatedFiles = uploadFiles.filter((file) => file.id !== id);
      window.localStorage.setItem(
        "uploadedFiles",
        JSON.stringify(updatedFiles)
      );
      setUploadFiles(updatedFiles);

      window.dispatchEvent(new Event("storageUpdate"));
    }
  };

  const handleEditFiles = (id: number, newName: string) => {
    if (typeof window !== undefined) {
      const updatedFiles = uploadFiles.map((file) =>
        file.id === id ? { ...file, name: newName } : file
      );
      setUploadFiles(updatedFiles);
      window.localStorage.setItem(
        "uploadedFiles",
        JSON.stringify(updatedFiles)
      );
      window.dispatchEvent(new Event("storageUpdate"));
    }
  };

  useEffect(() => {
    const syncLocalStorage = () => {
      const existingFiles = JSON.parse(
        window.localStorage.getItem("uploadedFiles") || "[]"
      );
      setUploadFiles(existingFiles);
    };

    // Run sync on component mount
    syncLocalStorage();

    // Listen for custom storage events
    window.addEventListener("storageUpdate", syncLocalStorage);

    //Terminate after listen the event
    return () => {
      window.removeEventListener("storageUpdate", syncLocalStorage);
    };
  }, []);

  return (
    <div className="flex h-screen gap-x-96 items-center">
      <div>
        <Sidebar
          files={uploadFiles}
          handleDelete={handleDeleteFiles}
          handleEdit={handleEditFiles}
        />
      </div>
      <div>
        <Uploader
          fileName={fileName}
          handleChange={handleChange}
          onUpload={handleUpload}
          isFolder={isFolderUpload}
        />
      </div>
    </div>
  );
}
