import { useEffect, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
}

// Dynamically loaded MDEditor component
export default function RichTextEditor({
  value,
  onChange,
  height = 500,
  placeholder = 'Nhập nội dung Markdown...',
}: RichTextEditorProps) {
  const [MDEditor, setMDEditor] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Dynamically import to avoid SSR and CSS issues
    if (typeof window !== 'undefined') {
      // Load CSS first
      const existing = document.getElementById('md-editor-css');
      if (!existing) {
        const link = document.createElement('link');
        link.id = 'md-editor-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/@uiw/react-md-editor@4.0.4/markdown-editor.css';
        document.head.appendChild(link);
      }

      // Then load component
      import('@uiw/react-md-editor').then((mod) => {
        setMDEditor(() => mod.default);
      });
    }
  }, []);

  if (!mounted || !MDEditor) {
    return (
      <div 
        className="rounded-lg overflow-hidden border border-white/10 p-4 text-white/50 flex items-center justify-center"
        style={{ height, background: '#0F172A' }}
      >
        <span>Đang tải editor...</span>
      </div>
    );
  }

  return (
    <div data-color-mode="dark" className="rounded-lg overflow-hidden border border-white/10">
      <MDEditor
        value={value}
        onChange={(val: string | undefined) => onChange(val ?? '')}
        height={height}
        preview="live"
        textareaProps={{ placeholder }}
        style={{
          background: '#0F172A',
          borderRadius: '0.5rem',
        }}
      />
    </div>
  );
}
