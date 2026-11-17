"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Search, ArrowUp, X } from "lucide-react";

type QuickNavItem = {
  href: string;
  label: string;
  hint?: string;
};

type PageQuickNavProps = {
  title: string;
  items: QuickNavItem[];
};

export function PageQuickNav({ title, items }: PageQuickNavProps) {
  const storageKey = useMemo(
    () => `edunexus_page_quick_nav_collapsed_${encodeURIComponent(title)}`,
    [title]
  );
  const [collapsed, setCollapsed] = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(storageKey) === "1");
    } catch {
      setCollapsed(false);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, collapsed ? "1" : "0");
    } catch {
      // ignore persistence failures
    }
  }, [collapsed, storageKey]);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  useEffect(() => {
    const ids = items
      .filter((item) => item.href.startsWith("#"))
      .map((item) => item.href.replace(/^#/, ""))
      .filter((item) => item.length > 0);
    if (ids.length === 0) {
      return;
    }
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((item): item is HTMLElement => item instanceof HTMLElement);
    if (elements.length === 0) {
      return;
    }

    const updateFromHash = () => {
      const hash = window.location.hash;
      if (hash) {
        setActiveHref(hash);
      }
    };
    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const topEntry = visibleEntries[0];
        if (!topEntry) {
          return;
        }
        const id = topEntry.target.getAttribute("id");
        if (!id) {
          return;
        }
        setActiveHref(`#${id}`);
      },
      { rootMargin: "-20% 0px -62% 0px", threshold: [0, 0.2, 0.5, 1] }
    );
    elements.forEach((element) => observer.observe(element));

    return () => {
      window.removeEventListener("hashchange", updateFromHash);
      observer.disconnect();
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredItems = normalizedKeyword
    ? items.filter((item) => {
        const text = `${item.label} ${item.hint ?? ""} ${item.href}`.toLowerCase();
        return text.includes(normalizedKeyword);
      })
    : items;
  const visibleItems = collapsed ? filteredItems.slice(0, 4) : filteredItems;

  return (
    <Card className="col-span-12 glass-card">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {filteredItems.length}/{items.length} 项
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 4 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed((prev) => !prev)}
              >
                {collapsed ? (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    展开全部
                  </>
                ) : (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    折叠导航
                  </>
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setKeyword("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              回到顶部
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 搜索栏 */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="输入关键词筛选导航项"
              className="pl-9 input-enhanced"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setKeyword("")}
            disabled={!keyword.trim()}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator />

        {/* 导航项 */}
        {visibleItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            当前筛选无结果，请调整关键词。
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {visibleItems.map((item) => {
              const active = item.href.startsWith("#")
                ? activeHref === item.href
                : item.href === "/"
                  ? currentPath === "/"
                  : currentPath === item.href || currentPath.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex flex-col gap-1 p-3 rounded-lg border transition-all",
                    "hover:bg-accent/10 hover:border-primary/30",
                    active && "bg-accent/15 border-primary/50 shadow-sm"
                  )}
                >
                  <span className={cn(
                    "text-sm font-medium",
                    active ? "text-primary" : "text-foreground"
                  )}>
                    {item.label}
                  </span>
                  {item.hint && (
                    <span className="text-xs text-muted-foreground">
                      {item.hint}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
