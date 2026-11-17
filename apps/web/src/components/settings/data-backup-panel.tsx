"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Upload, HardDrive, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalUser } from "@/lib/identity/user-provider";
import {
  downloadBackupFile,
  parseBackupFileText,
  restoreBackupBundle,
} from "@/lib/client/backup";
import { toast } from "@/lib/toast";

export function DataBackupPanel() {
  const { userId, displayName, setDisplayName, ready } = useLocalUser();
  const [nameDraft, setNameDraft] = useState(displayName);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready) setNameDraft(displayName);
  }, [ready, displayName]);

  const handleSaveName = useCallback(() => {
    setDisplayName(nameDraft);
    toast("显示名称已保存", "success");
  }, [nameDraft, setDisplayName]);

  const handleExport = useCallback(async () => {
    setBusy(true);
    try {
      await downloadBackupFile();
      toast("备份已下载", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "导出失败", "error");
    } finally {
      setBusy(false);
    }
  }, []);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setBusy(true);
      try {
        const text = await file.text();
        const bundle = parseBackupFileText(text);
        const result = await restoreBackupBundle(bundle);
        toast(
          `已恢复本地键 ${result.localRestored} 项` +
            (result.serverOk ? "，服务端数据已写入" : "（服务端部分未写入或为空）"),
          "success"
        );
        window.location.reload();
      } catch (err) {
        toast(err instanceof Error ? err.message : "导入失败", "error");
      } finally {
        setBusy(false);
      }
    };
    input.click();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">数据管理</h2>
        <p className="text-sm text-muted-foreground mt-1">
          本地身份归属、一键备份与恢复（浏览器数据 + 服务端 db.json）
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">本地身份</h3>
            <p className="text-sm text-muted-foreground">
              单机无登录；学习记录、统计均挂在此 userId 下
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label>用户 ID</Label>
          <Input value={ready ? userId : "加载中…"} readOnly className="font-mono text-xs" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="display-name">显示名称</Label>
          <div className="flex gap-2">
            <Input
              id="display-name"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder="本地学习者"
            />
            <Button type="button" onClick={handleSaveName} disabled={!ready}>
              保存
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <HardDrive className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">备份 / 恢复</h3>
            <p className="text-sm text-muted-foreground">
              导出 JSON 到本机；换机或清缓存后可再导入
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="outline" onClick={handleExport} disabled={busy}>
            <Download className="h-4 w-4 mr-2" />
            导出完整备份
          </Button>
          <Button variant="outline" onClick={handleImport} disabled={busy}>
            <Upload className="h-4 w-4 mr-2" />
            从备份恢复
          </Button>
        </div>
      </Card>
    </div>
  );
}
