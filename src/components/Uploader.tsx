import React from "react";
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
  return (
    <div className="space-y-8">
      <div className="flex justify-center items-center min-w-[35rem] min-h-[20rem] rounded-3xl border-2 border-slate-400">
        <Label
          htmlFor="file"
          className="flex flex-col items-center justify-center w-full h-[20rem] cursor-pointer text-gray-900"
        >
          <span className="mb-2 text-xl font-medium">
            Choose a file or folder
          </span>
          <span className="text-lg text-gray-400">{fileName}</span>
          <Input
            id="file"
            type="file"
            className="hidden"
            onChange={handleChange}
            {...(isFolder && ({ webkitdirectory: "true" } as any))}
          />
        </Label>
      </div>
      <Button
        variant="default"
        disabled={fileName === "No File Chosen" && true}
        className=" w-full bg-indigo-600 hover:bg-indigo-600"
        onClick={onUpload}
      >
        Upload
      </Button>
    </div>
  );
};

export default Uploader;
