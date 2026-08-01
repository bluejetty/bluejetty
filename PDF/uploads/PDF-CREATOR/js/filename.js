* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: #f3f4f6;
  color: #1f2937;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

header {
  background: #111827;
  color: #fff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  position: relative;
}
export class FilenameManager {
  constructor(inputElement) {
    this.el = inputElement;
    this.seqNum = 1;
    this.lastMinuteKey = '';
    this.displayedMinuteKey = '';
    this.userEdited = false;

    this.el.addEventListener('input', () => { this.userEdited = true; });
    setInterval(() => this.update(), 2000);
    this.update(true);
  }

  pad(n) {
    return String(n).padStart(2, '0');
  }

  getAuto() {
    const now = new Date();
    const minuteKey = `${now.getFullYear()}${this.pad(now.getMonth() + 1)}${this.pad(now.getDate())}${this.pad(now.getHours())}${this.pad(now.getMinutes())}`;
    if (minuteKey !== this.lastMinuteKey) {
      this.lastMinuteKey = minuteKey;
      this.seqNum = 1;
    }
    const formatted = `${minuteKey.slice(0, 8)}-${minuteKey.slice(8)}`;
    return `${formatted} PDFCreator${String(this.seqNum).padStart(3, '0')}.PDF`;
  }

  update(force = false) {
    const now = new Date();
    const currentKey = `${now.getFullYear()}${this.pad(now.getMonth() + 1)}${this.pad(now.getDate())}${this.pad(now.getHours())}${this.pad(now.getMinutes())}`;
    if (force || currentKey !== this.displayedMinuteKey) {
      if (document.activeElement !== this.el && !this.userEdited) {
        this.el.value = this.getAuto();
        this.displayedMinuteKey = currentKey;
      }
    }
  }

  consume() {
    const fn = this.el.value.trim() || this.getAuto();
    this.seqNum++;
    this.userEdited = false;
    this.update(true);
    return fn;
  }
}
header h1 { font-size: 1.25rem; font-weight: 600; flex-shrink: 0; }

.header-right {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 50%;
  flex-shrink: 0;
}

.filename-display {
  flex: 1;
  min-width: 0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  color: #111827;
  background: #fff;
  padding: 0.4rem 0.6rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  white-space: nowrap;
  letter-spacing: 0.02em;
  text-align: left;
  outline: none;
  cursor: text;
  overflow: hidden;
  text-overflow: ellipsis;
}

.filename-display:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
}

button#generateBtn {
  background: #10b981;
  color: #fff;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}

button#generateBtn:hover { background: #059669; }
button#generateBtn:disabled { background: #6b7280; cursor: not-allowed; }

.main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 50%;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.panel {
  padding: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.panel h3 {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

.dropzone {
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: center;
  color: #6b7280;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.dropzone:hover, .dropzone.dragover {
  border-color: #10b981;
  background: #ecfdf5;
}

#fileInput { display: none; }

.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 120px;
}

.chat-bubble {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.6rem 0.8rem;
  font-size: 0.875rem;
  max-width: 90%;
  word-break: break-word;
  align-self: flex-start;
}

.chat-bubble .bubble-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #3b82f6;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 0.25rem;
}

.chat-bubble img {
  max-width: 100%;
  border-radius: 0.25rem;
  margin-top: 0.25rem;
}

.chat-input {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background: #fff;
}

.chat-input textarea {
  flex: 1;
  resize: vertical;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem;
  font-family: inherit;
  font-size: 0.875rem;
  height: 200px;
}

.chat-input button {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 0 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
}

.chat-input button:hover { background: #2563eb; }

.builder {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1.5rem;
}

.builder h3 {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

.item-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: grab;
  transition: box-shadow 0.2s, transform 0.1s;
}

.item-card.dragging {
  opacity: 0.5;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
}

.item-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.drag-handle {
  color: #9ca3af;
  cursor: grab;
  font-size: 1.1rem;
  user-select: none;
  padding: 0 0.25rem;
}

.include-check {
  width: 1.1rem;
  height: 1.1rem;
  cursor: pointer;
  accent-color: #10b981;
}

.preview {
  width: 70px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 0.25rem;
  overflow: hidden;
  font-size: 0.65rem;
  color: #6b7280;
  border: 1px solid #d1d5db;
  position: relative;
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.page-label {
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 0.55rem;
  background: rgba(17,24,39,0.75);
  color: #fff;
  padding: 1px 3px;
  border-radius: 2px;
  line-height: 1;
  pointer-events: none;
  white-space: nowrap;
}

.pdf-icon {
  font-weight: 700;
  color: #ef4444;
  font-size: 0.75rem;
}

.text-preview {
  padding: 0.25rem;
  font-size: 0.6rem;
  line-height: 1.1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  width: 100%;
}

.details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.name {
  font-weight: 600;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.controls select {
  font-size: 0.8rem;
  padding: 0.2rem 0.4rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background: #fff;
  cursor: pointer;
}

.remove-btn {
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1;
  padding: 0.25rem;
}

.remove-btn:hover { color: #ef4444; }

.badge {
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  border-radius: 9999px;
  background: #e5e7eb;
  color: #374151;
  font-weight: 600;
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 3rem;
  font-size: 0.875rem;
}
