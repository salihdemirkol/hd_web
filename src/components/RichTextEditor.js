'use client';
import { useEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css';

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const onChangeRef = useRef(onChange);

  // Keep latest onChange in ref
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let quillInstance = null;
    let isMounted = true;

    if (typeof window !== 'undefined' && editorRef.current) {
      import('quill').then((QuillModule) => {
        if (!isMounted) return;
        
        const Quill = QuillModule.default;
        
        // Remove previous toolbar if any (Strict mode cleanup)
        const previousToolbar = editorRef.current.parentNode.querySelector('.ql-toolbar');
        if (previousToolbar) {
          previousToolbar.remove();
        }

        // Clean up any existing editor content from a previous strict mode mount
        editorRef.current.innerHTML = '';

        quillInstance = new Quill(editorRef.current, {
          theme: 'snow',
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'align': [] }],
              ['link', 'clean']
            ]
          }
        });
        
        quillRef.current = quillInstance;

        // Set initial value
        if (value) {
          const delta = quillInstance.clipboard.convert({ html: value });
          quillInstance.setContents(delta, 'silent');
        }

        // Listen for changes and propagate using the ref to avoid stale closures
        quillInstance.on('text-change', () => {
          const html = quillInstance.root.innerHTML;
          if (onChangeRef.current) {
            onChangeRef.current(html);
          }
        });
      });
    }

    return () => {
      isMounted = false;
    };
  }, []); // Run only once

  // Handle external value updates (e.g. form reset or edit load)
  useEffect(() => {
    if (quillRef.current) {
      const currentHtml = quillRef.current.root.innerHTML;
      if (value === '') {
        quillRef.current.setContents([]);
      } else if (value && value !== currentHtml) {
        const delta = quillRef.current.clipboard.convert({ html: value });
        quillRef.current.setContents(delta, 'silent');
      }
    }
  }, [value]);

  return (
    <div className="custom-quill" style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
      <div ref={editorRef} style={{ color: '#fff', minHeight: '300px' }} />
      <style jsx global>{`
        .custom-quill .ql-toolbar {
          background-color: rgba(25, 25, 25, 0.9);
          border: none !important;
          border-bottom: 1px solid #333 !important;
        }
        .custom-quill .ql-container {
          border: none !important;
          min-height: 300px;
          font-family: var(--font-sans);
          font-size: 1rem;
          background-color: transparent !important;
        }
        .custom-quill .ql-editor {
          min-height: 300px;
          background-color: transparent !important;
        }
        .custom-quill .ql-stroke {
          stroke: #ccc !important;
        }
        .custom-quill .ql-fill {
          fill: #ccc !important;
        }
        .custom-quill .ql-picker {
          color: #ccc !important;
        }
        .custom-quill .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.3) !important;
        }
      `}</style>
    </div>
  );
}
