import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "./ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { FileObject } from "@/types";

type SideNavProps = {
  files: FileObject[];
  handleDelete: (id: number) => void;
  handleEdit: (id: number, newName: string) => void;
};

const SideNav = ({ files, handleEdit, handleDelete }: SideNavProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const router = useRouter();

  // Trigger the edit mode where the fileName is editing.
  const startEditing = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  //Trigger the handleEdit mode after changes the Input field to store this on localStorage.
  const finishEditing = () => {
    if (editingId !== null) {
      handleEdit(editingId, editingName);
      setEditingId(null);
    }
  };

  const handleRoute = (fileName: string) => {
    router.push(`${fileName}`);
  };

  return (
    <Sidebar>
      <SidebarContent className="bg-red-200">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {files.map((file) => (
                <SidebarMenuItem
                  key={file.id}
                  className="flex justify-between items-center"
                >
                  {editingId === file.id ? (
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={finishEditing}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          finishEditing();
                        } else if (
                          e.key === "Escape" &&
                          editingName.trim() !== ""
                        ) {
                          cancelEditing();
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <SidebarMenuButton onClick={() => handleRoute(file.name)}>
                      {file.name}
                    </SidebarMenuButton>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => startEditing(file.id, file.name)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete?.(file.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideNav;
