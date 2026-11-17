"use client";

import { useEffect, useState, type ReactNode } from "react";

type CollapsiblePanelProps = {
  id?: string;
  title: string;
  subtitle?: string;
  storageKey: string;
  className?: string;
  defaultExpanded?: boolean;
  children: ReactNode;
};

export function CollapsiblePanel({
  id,
  title,
  subtitle,
  storageKey,
  className = "",
  defaultExpanded = true,
  children
}: CollapsiblePanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const panelBodyId = id ? `${id}__body` : undefined;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`edunexus_collapsible_${storageKey}`);
      if (raw === "0") {
        setExpanded(false);
      } else if (raw === "1") {
        setExpanded(true);
      } else {
        setExpanded(defaultExpanded);
      }
    } catch {
      setExpanded(defaultExpanded);
    }
  }, [defaultExpanded, storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        `edunexus_collapsible_${storageKey}`,
        expanded ? "1" : "0"
      );
    } catch {
      // ignore persistence failures
    }
  }, [expanded, storageKey]);

  return (
    <section
      id={id}
      className={`collapsible-panel ${expanded ? "expanded" : "collapsed"} ${className}`.trim()}
    >
      <header className="collapsible-panel-head">
        <div className="collapsible-panel-meta">
          <strong>{title}</strong>
          {subtitle ? <span>{subtitle}</span> : null}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-controls={panelBodyId}
        >
          <span className="collapsible-panel-toggle-indicator" aria-hidden>
            {expanded ? "−" : "+"}
          </span>
          {expanded ? "收起" : "展开"}
        </button>
      </header>
      {expanded ? (
        <div id={panelBodyId} className="collapsible-panel-body">
          {children}
        </div>
      ) : null}
    </section>
  );
}
