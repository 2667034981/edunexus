# 知识库本地存储功能说明

## 概述

EduNexus 知识库现已支持本地存储功能，参考 Obsidian 设计理念，提供完整的文档管理能力。

## 核心功能

### 1. 知识库（Vault）管理
- **创建知识库**：支持创建多个独立的知识库
- **切换知识库**：快速在不同知识库间切换
- **删除知识库**：删除知识库及其所有文档
- **路径配置**：为每个知识库指定存储路径

### 2. 文档管理
- **创建文档**：在当前知识库中创建新文档
- **编辑文档**：支持 Markdown 格式编辑
- **保存文档**：自动保存到 IndexedDB
- **删除文档**：删除不需要的文档
- **搜索文档**：全文搜索文档标题和内容

### 3. 导入/导出
- **导出单个文档**：导出为 .md 文件
- **批量导入**：支持导入多个 .md 文件
- **文件格式**：标准 Markdown 格式

### 4. 标签系统
- **标签筛选**：按标签过滤文档
- **标签云**：查看文档的所有标签
- **自动提取**：从文档内容中提取 #标签

### 5. 双链笔记
- **双链语法**：使用 [[文档名]] 创建链接
- **反向链接**：自动显示引用当前文档的其他文档
- **链接跳转**：点击链接快速跳转

## 技术实现

### 存储方案
- **IndexedDB**：主要存储方案，支持大量文档
- **localStorage**：存储配置信息（当前知识库ID等）
- **浏览器原生**：无需后端支持，完全本地化

### 文件结构

```
apps/web/src/
├── lib/client/
│   └── kb-storage.ts          # 核心存储逻辑
├── components/kb/
│   └── vault-selector.tsx     # 知识库选择器组件
└── app/kb/
    └── page.tsx               # 知识库页面（已集成）
```

## 使用方法

### 1. 创建知识库

```typescript
import { getKBStorage } from "@/lib/client/kb-storage";

const storage = getKBStorage();
await storage.initialize();

const vault = await storage.createVault("我的笔记", "~/Documents/EduNexus/我的笔记");
```

### 2. 创建文档

```typescript
const doc = await storage.createDocument(
  vaultId,
  "文档标题",
  "# 文档标题\n\n内容...",
  ["标签1", "标签2"]
);
```

### 3. 更新文档

```typescript
const updatedDoc = {
  ...doc,
  content: "新内容",
  title: "新标题"
};
await storage.updateDocument(updatedDoc);
```

### 4. 导入文档

```typescript
const file = new File(["# 标题\n\n内容"], "文档.md", { type: "text/markdown" });
const doc = await storage.importMarkdownFile(vaultId, file);
```

### 5. 导出文档

```typescript
storage.exportDocumentAsMarkdown(doc);
```

## API 参考

### KBStorageManager

#### 知识库管理
- `getAllVaults(): Promise<KBVault[]>` - 获取所有知识库
- `createVault(name: string, path: string): Promise<KBVault>` - 创建知识库
- `updateVault(vault: KBVault): Promise<void>` - 更新知识库
- `deleteVault(vaultId: string): Promise<void>` - 删除知识库
- `setCurrentVault(vaultId: string): void` - 设置当前知识库
- `getCurrentVaultId(): string | null` - 获取当前知识库ID

#### 文档管理
- `getDocumentsByVault(vaultId: string): Promise<KBDocument[]>` - 获取知识库文档
- `createDocument(vaultId, title, content, tags): Promise<KBDocument>` - 创建文档
- `updateDocument(doc: KBDocument): Promise<void>` - 更新文档
- `deleteDocument(docId: string): Promise<void>` - 删除文档

#### 导入/导出
- `exportDocumentAsMarkdown(doc: KBDocument): void` - 导出文档
- `importMarkdownFile(vaultId: string, file: File): Promise<KBDocument>` - 导入文档
- `importMultipleFiles(vaultId: string, files: FileList): Promise<KBDocument[]>` - 批量导入

## 数据结构

### KBVault
```typescript
type KBVault = {
  id: string;              // 知识库ID
  name: string;            // 知识库名称
  path: string;            // 存储路径
  createdAt: Date;         // 创建时间
  lastAccessedAt: Date;    // 最后访问时间
  isDefault: boolean;      // 是否为默认知识库
};
```

### KBDocument
```typescript
type KBDocument = {
  id: string;              // 文档ID
  title: string;           // 文档标题
  content: string;         // 文档内容（Markdown）
  tags: string[];          // 标签列表
  createdAt: Date;         // 创建时间
  updatedAt: Date;         // 更新时间
  parentId?: string;       // 父文档ID（可选）
  vaultId: string;         // 所属知识库ID
};
```

## 浏览器兼容性

- **Chrome/Edge**: 完全支持
- **Firefox**: 完全支持
- **Safari**: 完全支持（iOS 15.2+）
- **IndexedDB**: 所有现代浏览器

## 注意事项

1. **浏览器存储限制**：IndexedDB 通常有几GB的存储空间，足够存储大量文档
2. **数据持久化**：数据存储在浏览器本地，清除浏览器数据会删除所有文档
3. **备份建议**：定期导出重要文档作为备份
4. **跨设备同步**：当前版本不支持跨设备同步，未来可考虑添加云同步功能

## 未来计划

- [ ] 文件夹结构支持
- [ ] 云同步功能
- [ ] 版本历史
- [ ] 协作编辑
- [ ] 更丰富的 Markdown 编辑器
- [ ] 图片上传和管理
- [ ] 全文搜索优化
- [ ] 导出为 PDF/HTML

## 故障排除

### 问题：无法创建知识库
- 检查浏览器是否支持 IndexedDB
- 检查浏览器存储空间是否充足
- 尝试清除浏览器缓存后重试

### 问题：文档保存失败
- 检查文档内容是否过大（建议单个文档不超过 10MB）
- 检查浏览器控制台是否有错误信息
- 尝试刷新页面后重试

### 问题：导入文件失败
- 确保文件格式为 .md
- 检查文件编码是否为 UTF-8
- 确保文件大小合理

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个功能！
