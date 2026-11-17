"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Code,
  FolderTree,
  Play,
  Download,
  Upload,
  Save,
  Trash2,
  Settings,
} from "lucide-react";
import { FileTree } from "./file-tree";
import { MonacoEditor } from "./monaco-editor";
import { ProjectTemplates } from "./project-templates";
import { EnhancedCodeExecutor } from "./enhanced-code-executor";
import {
  ProjectManager,
  Project,
  FileNode,
  ProjectTemplate,
} from "@/lib/workspace/project-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProgrammingLab() {
  const [projectManager] = useState(() => new ProjectManager());
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<"editor" | "executor">("editor");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const allProjects = projectManager.getAllProjects();
    setProjects(allProjects);
    const current = projectManager.getCurrentProject();
    setCurrentProject(current || null);
    if (current && current.files.length > 0) {
      const firstFile = findFirstFile(current.files);
      setSelectedFile(firstFile);
    }
  };

  const findFirstFile = (nodes: FileNode[]): FileNode | null => {
    for (const node of nodes) {
      if (node.type === "file") return node;
      if (node.children) {
        const found = findFirstFile(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const handleCreateProject = (name: string, description: string, template?: ProjectTemplate) => {
    projectManager.createProject(name, description, template);
    loadProjects();
  };

  const handleSelectProject = (projectId: string) => {
    projectManager.setCurrentProject(projectId);
    loadProjects();
  };

  const handleSelectFile = (file: FileNode) => {
    setSelectedFile(file);
  };

  const handleFileChange = (content: string) => {
    if (selectedFile && currentProject) {
      projectManager.updateFile(currentProject.id, selectedFile.id, { content });
      selectedFile.content = content;
    }
  };

  const handleLanguageChange = (language: string) => {
    if (selectedFile && currentProject) {
      projectManager.updateFile(currentProject.id, selectedFile.id, { language });
      selectedFile.language = language;
    }
  };

  const handleAddFile = (parentId: string | null, name: string, type: "file" | "folder") => {
    if (currentProject) {
      const newFile = projectManager.addFile(currentProject.id, parentId, name, type);
      loadProjects();
      if (type === "file") {
        setSelectedFile(newFile);
      }
    }
  };

  const handleDeleteFile = (fileId: string) => {
    if (currentProject) {
      projectManager.deleteFile(currentProject.id, fileId);
      if (selectedFile?.id === fileId) {
        setSelectedFile(null);
      }
      loadProjects();
    }
  };

  const handleRenameFile = (fileId: string, newName: string) => {
    if (currentProject) {
      projectManager.updateFile(currentProject.id, fileId, { name: newName });
      loadProjects();
    }
  };

  const handleExportProject = () => {
    if (currentProject) {
      const data = projectManager.exportProject(currentProject.id);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentProject.name}.json`;
      a.click();
    }
  };

  const handleImportProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target?.result as string;
          projectManager.importProject(data);
          loadProjects();
        } catch (error) {
          alert("导入失败：" + (error instanceof Error ? error.message : String(error)));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDeleteProject = () => {
    if (currentProject && confirm(`确定删除项目 "${currentProject.name}"？`)) {
      projectManager.deleteProject(currentProject.id);
      setCurrentProject(null);
      setSelectedFile(null);
      loadProjects();
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Project Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              编程实验室
            </div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".json"
                onChange={handleImportProject}
                className="hidden"
                id="import-project"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("import-project")?.click()}
                title="导入项目"
              >
                <Upload className="h-3 w-3" />
              </Button>
              {currentProject && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportProject}
                    title="导出项目"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteProject}
                    title="删除项目"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Select
              value={currentProject?.id || ""}
              onValueChange={handleSelectProject}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="选择项目" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ProjectTemplates onCreateProject={handleCreateProject} />
          </div>

          {currentProject && (
            <div className="text-xs text-muted-foreground">
              {currentProject.description || "暂无描述"}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      {currentProject ? (
        <div className="flex-1 grid grid-cols-[250px_1fr] gap-4 min-h-0">
          {/* File Tree */}
          <Card className="overflow-hidden">
            <FileTree
              files={currentProject.files}
              selectedFileId={selectedFile?.id || null}
              onSelectFile={handleSelectFile}
              onAddFile={handleAddFile}
              onDeleteFile={handleDeleteFile}
              onRenameFile={handleRenameFile}
            />
          </Card>

          {/* Editor/Executor */}
          <Card className="overflow-hidden flex flex-col">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
              <div className="border-b px-4 pt-4">
                <TabsList>
                  <TabsTrigger value="editor">
                    <Code className="h-3 w-3 mr-1" />
                    编辑器
                  </TabsTrigger>
                  <TabsTrigger value="executor">
                    <Play className="h-3 w-3 mr-1" />
                    执行器
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="editor" className="flex-1 p-4 m-0">
                {selectedFile ? (
                  <MonacoEditor
                    value={selectedFile.content || ""}
                    onChange={handleFileChange}
                    language={selectedFile.language || "javascript"}
                    onLanguageChange={handleLanguageChange}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    选择一个文件开始编辑
                  </div>
                )}
              </TabsContent>

              <TabsContent value="executor" className="flex-1 p-4 m-0">
                <EnhancedCodeExecutor
                  initialCode={selectedFile?.content || ""}
                  initialLanguage={selectedFile?.language || "javascript"}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      ) : (
        <Card className="flex-1 flex items-center justify-center">
          <CardContent className="text-center space-y-4">
            <FolderTree className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="font-medium mb-2">开始你的编程之旅</h3>
              <p className="text-sm text-muted-foreground mb-4">
                创建一个新项目或选择现有项目
              </p>
              <ProjectTemplates onCreateProject={handleCreateProject} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
