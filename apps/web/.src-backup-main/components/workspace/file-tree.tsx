"use client";

import { useState } from "react";
import { FileNode } from "@/lib/workspace/project-manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  File,
  Folder,
  FolderOpen,
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileTreeProps {
  files: FileNode[];
  selectedFileId: string | null;
  onSelectFile: (file: FileNode) => void;
  onAddFile: (parentId: string | null, name: string, type: "file" | "folder") => void;
  onDeleteFile: (fileId: string) => void;
  onRenameFile: (fileId: string, newName: string) => void;
}

export function FileTree({
  files,
  selectedFileId,
  onSelectFile,
  onAddFile,
  onDeleteFile,
  onRenameFile,
}: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemType, setNewItemType] = useState<"file" | "folder">("file");

  const toggleFolder = (id: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFolders(newExpanded);
  };

  const startEdit = (file: FileNode) => {
    setEditingId(file.id);
    setEditingName(file.name);
  };

  const finishEdit = (fileId: string) => {
    if (editingName.trim()) {
      onRenameFile(fileId, editingName.trim());
    }
    setEditingId(null);
    setEditingName("");
  };

  const startAdd = (parentId: string | null, type: "file" | "folder") => {
    setAddingTo(parentId);
    setNewItemType(type);
    setNewItemName("");
  };

  const finishAdd = () => {
    if (newItemName.trim()) {
      onAddFile(addingTo, newItemName.trim(), newItemType);
    }
    setAddingTo(null);
    setNewItemName("");
  };

  const renderNode = (node: FileNode, depth = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = node.id === selectedFileId;
    const isEditing = editingId === node.id;

    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer group",
            isSelected && "bg-orange-100 hover:bg-orange-100"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {node.type === "folder" && (
            <button
              onClick={() => toggleFolder(node.id)}
              className="p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}

          <div
            className="flex items-center gap-1.5 flex-1 min-w-0"
            onClick={() => node.type === "file" && onSelectFile(node)}
          >
            {node.type === "folder" ? (
              isExpanded ? (
                <FolderOpen className="h-4 w-4 text-orange-500 flex-shrink-0" />
              ) : (
                <Folder className="h-4 w-4 text-orange-500 flex-shrink-0" />
              )
            ) : (
              <File className="h-4 w-4 text-blue-500 flex-shrink-0" />
            )}

            {isEditing ? (
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => finishEdit(node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") finishEdit(node.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="h-6 text-xs"
                autoFocus
              />
            ) : (
              <span className="text-sm truncate">{node.name}</span>
            )}
          </div>

          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
            {node.type === "folder" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    startAdd(node.id, "file");
                  }}
                  title="新建文件"
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    startAdd(node.id, "folder");
                  }}
                  title="新建文件夹"
                >
                  <Folder className="h-3 w-3" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                startEdit(node);
              }}
              title="重命名"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-500 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`确定删除 ${node.name}？`)) {
                  onDeleteFile(node.id);
                }
              }}
              title="删除"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {node.type === "folder" && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, depth + 1))}
            {addingTo === node.id && (
              <div
                className="flex items-center gap-1.5 px-2 py-1"
                style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
              >
                {newItemType === "folder" ? (
                  <Folder className="h-4 w-4 text-orange-500" />
                ) : (
                  <File className="h-4 w-4 text-blue-500" />
                )}
                <Input
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onBlur={finishAdd}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") finishAdd();
                    if (e.key === "Escape") setAddingTo(null);
                  }}
                  placeholder={newItemType === "folder" ? "文件夹名称" : "文件名称"}
                  className="h-6 text-xs"
                  autoFocus
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b">
        <span className="text-sm font-medium">文件</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => startAdd(null, "file")}
            title="新建文件"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => startAdd(null, "folder")}
            title="新建文件夹"
          >
            <Folder className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-1">
        {files.map((file) => renderNode(file))}
        {addingTo === null && (
          <div className="flex items-center gap-1.5 px-2 py-1">
            {newItemType === "folder" ? (
              <Folder className="h-4 w-4 text-orange-500" />
            ) : (
              <File className="h-4 w-4 text-blue-500" />
            )}
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onBlur={finishAdd}
              onKeyDown={(e) => {
                if (e.key === "Enter") finishAdd();
                if (e.key === "Escape") setAddingTo(null);
              }}
              placeholder={newItemType === "folder" ? "文件夹名称" : "文件名称"}
              className="h-6 text-xs"
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
}
