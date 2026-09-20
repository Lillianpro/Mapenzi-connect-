import React, { useState, useEffect } from 'react';
import { X, Code2, Copy, Check, Folder, FileCode, ExternalLink } from 'lucide-react';

interface FlutterFile {
  name: string;
  path: string;
  content: string;
}

interface FlutterCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterCodeModal: React.FC<FlutterCodeModalProps> = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState<FlutterFile[]>([]);
  const [activeFile, setActiveFile] = useState<FlutterFile | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/flutter-code')
        .then((res) => res.json())
        .then((data) => {
          if (data.files && data.files.length > 0) {
            setFiles(data.files);
            // Default to main.dart or pubspec.yaml
            const mainFile = data.files.find((f: FlutterFile) => f.name === 'main.dart') || data.files[0];
            setActiveFile(mainFile);
          }
        })
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Flutter + Firebase Project Source Files
              </h2>
              <p className="text-[11px] text-slate-500">
                Ready for Android Studio, VS Code, and Flutter CLI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Sidebar files + Code Editor */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 overflow-y-auto max-h-40 sm:max-h-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
              Flutter Files
            </span>
            {loading ? (
              <p className="text-xs text-slate-500 p-2">Loading source files...</p>
            ) : (
              <div className="space-y-1">
                {files.map((f) => (
                  <button
                    key={f.path}
                    onClick={() => setActiveFile(f)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition ${
                      activeFile?.path === f.path
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{f.path}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active File Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-900 text-slate-100">
            <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-emerald-400">{activeFile?.path || 'Select file'}</span>
              <button
                onClick={handleCopy}
                disabled={!activeFile}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition active:scale-95 disabled:opacity-50"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy File</span>
                  </>
                )}
              </button>
            </div>

            <pre className="flex-1 p-4 font-mono text-xs overflow-auto leading-relaxed selection:bg-emerald-600 selection:text-white">
              {activeFile?.content || '// Select a file from the explorer'}
            </pre>
          </div>
        </div>

        {/* Footer Build Command */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>Command to build APK: <code className="text-emerald-600 dark:text-emerald-400 font-mono">flutter build apk --release --split-per-abi</code></span>
          <span className="text-[11px]">Produces lightweight &lt;20MB installable APK</span>
        </div>
      </div>
    </div>
  );
};
