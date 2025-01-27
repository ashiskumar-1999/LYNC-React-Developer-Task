import React, { useEffect, useState } from "react";
import Uploader from "@/components/Uploader";
import ImageConverter from "@/utils/ImageConverter";
import SideNav from "@/components/SideNav";
import { FileObject } from "@/types";
import { Button } from "@/components/ui/button";
import ProcessFolder from "@/utils/ProcessFolder";

export default function Home() {
  const [fileName, setFileName] = useState("No files or folder chosen");
  const [file, setFile] = useState<File | FileList | null>();
  const [uploadFiles, setUploadFiles] = useState<FileObject[]>([]);
  const [isFolderUpload, setIsFolderUpload] = useState(false);

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
      const duplicateFile = uploadFiles.find((file) => file.name === fileName);
      console.log("Duplicate Files:", duplicateFile);
      if (duplicateFile?.name !== fileName) {
        let fileObjects: FileObject[] = [];

        if (isFolderUpload && file instanceof FileList) {
          // Handle folder upload
          fileObjects = await ProcessFolder(file, uploadFiles);
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
      }

      // Reset file input
      setFileName("No files or folder Chosen");
      setFile(null);

      // Dispatch storage update event
      window.dispatchEvent(new Event("storageUpdate"));
    }
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
        <SideNav
          files={uploadFiles}
          handleDelete={handleDeleteFiles}
          handleEdit={handleEditFiles}
        />
      </div>
      <div className="space-y-4">
        <Button
          className="px-6 py-2 border border-slate-400 text-gray-900 rounded-md bg-transparent hover:bg-transparent"
          onClick={() => setIsFolderUpload(!isFolderUpload)}
        >
          Select {isFolderUpload ? "File" : "Folder"}
        </Button>
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
