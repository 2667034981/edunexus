let pyodideInstance: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

export async function loadPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (loadPromise) return loadPromise;

  isLoading = true;
  loadPromise = (async () => {
    try {
      // @ts-ignore
      const pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
      });
      pyodideInstance = pyodide;
      return pyodide;
    } catch (error) {
      console.error("Failed to load Pyodide:", error);
      throw error;
    } finally {
      isLoading = false;
    }
  })();

  return loadPromise;
}

export async function executePython(code: string, timeout = 5000): Promise<{ output: string; error?: string }> {
  try {
    const pyodide = await loadPyodide();

    // Capture stdout
    const captureCode = `
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`;

    await pyodide.runPythonAsync(captureCode);

    // Execute user code with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("执行超时（5秒）")), timeout)
    );

    const executePromise = pyodide.runPythonAsync(code);

    await Promise.race([executePromise, timeoutPromise]);

    // Get output
    const stdout = await pyodide.runPythonAsync("sys.stdout.getvalue()");
    const stderr = await pyodide.runPythonAsync("sys.stderr.getvalue()");

    if (stderr) {
      return { output: stdout || "", error: stderr };
    }

    return { output: stdout || "执行成功（无输出）" };
  } catch (error) {
    return {
      output: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
