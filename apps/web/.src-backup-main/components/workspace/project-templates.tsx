"use client";

import { PROJECT_TEMPLATES, ProjectTemplate } from "@/lib/workspace/project-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Plus, FileCode } from "lucide-react";

interface ProjectTemplatesProps {
  onCreateProject: (name: string, description: string, template?: ProjectTemplate) => void;
}

export function ProjectTemplates({ onCreateProject }: ProjectTemplatesProps) {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const handleCreate = () => {
    if (projectName.trim()) {
      onCreateProject(
        projectName.trim(),
        projectDescription.trim(),
        selectedTemplate || undefined
      );
      setOpen(false);
      setProjectName("");
      setProjectDescription("");
      setSelectedTemplate(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          新建项目
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>创建新项目</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">项目名称</Label>
            <Input
              id="name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="我的项目"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">项目描述</Label>
            <Textarea
              id="description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="项目简介..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>选择模板（可选）</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate === null ? "ring-2 ring-orange-500" : ""
                }`}
                onClick={() => setSelectedTemplate(null)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    空白项目
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs">
                    从零开始创建项目
                  </CardDescription>
                </CardContent>
              </Card>

              {PROJECT_TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id ? "ring-2 ring-orange-500" : ""
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span className="text-lg">{template.icon}</span>
                      {template.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs">
                      {template.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreate} disabled={!projectName.trim()}>
              创建项目
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
