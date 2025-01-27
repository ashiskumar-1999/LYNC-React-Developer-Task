import React, { useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type uploaderProps = {
  fileName: string;
  onUpload: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFolder: boolean;
};

const Uploader = ({
  fileName,
  onUpload,
  handleChange,
  isFolder,
}: uploaderProps) => {
  const folderRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (folderRef.current && isFolder) {
      folderRef.current.setAttribute("webkitdirectory", "true");
      folderRef.current.setAttribute("directory", "true");
    } else if (folderRef.current && !isFolder) {
      folderRef.current.removeAttribute("webkitdirectory");
      folderRef.current.removeAttribute("directory");
    }
  }, [isFolder]);

  return (
    <div className="space-y-8">
      <div className="flex justify-center items-center min-w-[35rem] min-h-[20rem] rounded-3xl border-2 border-slate-400">
        <Label
          htmlFor="file"
          className="flex flex-col items-center justify-center w-full h-[20rem] cursor-pointer text-gray-900"
        >
          <span className="mb-2 text-xl font-medium">
            Choose a {isFolder ? "folder" : "file"}
          </span>
          <span className="text-lg text-gray-400">{fileName}</span>
          <Input
            ref={folderRef}
            id="file"
            type="file"
            className="hidden"
            onChange={handleChange}
            multiple={isFolder}
          />
        </Label>
      </div>
      <Button
        variant="default"
        disabled={fileName === "No files or folder chosen" && true}
        className=" w-full bg-indigo-600 hover:bg-indigo-600"
        onClick={onUpload}
      >
        Upload
      </Button>
    </div>
  );
};

export default Uploader;
