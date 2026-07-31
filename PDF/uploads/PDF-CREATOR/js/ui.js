const pageSizes = {
  '8.5x11': { width: 612, height: 792 },
  '11x17':  { width: 792, height: 1224 }
};

export function getDims(size, orientation) {
  const s = pageSizes[size];
  return orientation === 'landscape'
    ? { width: s.height, height: s.width }
    : { width: s.width, height: s.height };
}

export function getAspectStyle(item) {
  const dims = getDims(item.pageSize, item.orientation);
  return `aspect-ratio: ${dims.width} / ${dims.height};`;
}

export function updatePreview(previewEl, item) {
  const dims = getDims(item.pageSize, item.orientation);
  previewEl.style.aspectRatio = `${dims.width} / ${dims.height}`;
  const label = previewEl.querySelector('.page-label');
  if (label) label.textContent = `${item.pageSize} ${item.orientation[0].toUpperCase()}`;
}

export class UIManager {
  constructor() {
    this.items = [];
    this.textCounter = 1;
    this.fileCounter = 1;

    this.itemList    = document.getElementById('itemList');
    this.chatHistory = document.getElementById('chatHistory');
    this.textInput   = document.getElementById('textInput');
    this.dropzone    = document.getElementById('dropzone');
    this.fileInput   = document.getElementById('fileInput');
    this.addTextBtn  = document.getElementById('addTextBtn');

    this.bindEvents();
  }

  bindEvents() {
    this.dropzone.addEventListener('click', () => this.fileInput.click());
    this.dropzone.addEventListener('dragover', e => {
      e.preventDefault();
      this.dropzone.classList.add('dragover');
    });
    this.dropzone.addEventListener('dragleave', () => this.dropzone.classList.remove('dragover'));
    this.dropzone.addEventListener('drop', e => {
      e.preventDefault();
      this.dropzone.classList.remove('dragover');
      Array.from(e.dataTransfer.files).forEach(f => this.processFile(f));
    });
    this.fileInput.addEventListener('change', e =>
      Array.from(e.target.files).forEach(f => this.processFile(f))
    );

    this.addTextBtn.addEventListener('click', () => this.handleAddText());
    document.addEventListener('paste', e => this.handlePaste(e));

    this.itemList.addEventListener('change', e => this.handleItemChange(e));
    this.itemList.addEventListener('click',  e => this.handleItemClick(e));
    this.itemList.addEventListener('dragover', e => e.preventDefault());
    this.itemList.addEventListener('drop',   e => this.handleItemDrop(e));
  }

  async processFile(file) {
    if (file.type === 'application/pdf') {
      this.addItem({
        type: 'pdf', name: 'FILE ' + this.fileCounter++,
        data: await file.arrayBuffer(),
        pageSize: '8.5x11', orientation: 'portrait', included: true
      });
    } else if (file.type.startsWith('image/')) {
      await this.processImageFile(file);
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      this.addItem({
        type: 'text', name: 'FILE ' + this.fileCounter++,
        content: await file.text(),
        pageSize: '8.5x11', orientation: 'portrait', included: true
      });
    } else {
      alert('Unsupported file type: ' + file.name);
    }
  }

  async processImageFile(file, customName) {
    const name = customName || ('FILE ' + this.fileCounter++);
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      this.addItem({
        type: 'image', name,
        data: new Uint8Array(await file.arrayBuffer()),
        imageType: file.type === 'image/jpeg' ? 'jpg' : 'png',
        pageSize: '8.5x11', orientation: 'portrait', included: true
      });
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await new Promise(r => img.onload = r);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0);
    const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
    this.addItem({
      type: 'image', name,
      data: new Uint8Array(await blob.arrayBuffer()),
      imageType: 'png',
      pageSize: '8.5x11', orientation: 'portrait', included: true
    });
    URL.revokeObjectURL(url);
  }

  handleAddText() {
    const text = this.textInput.value.trim();
    if (!text) return;
    const label = 'INPUT ' + this.textCounter++;
    this.addItem({
      type: 'text', name: label, content: text,
      pageSize: '8.5x11', orientation: 'portrait', included: true
    });
    this.addChatBubble(label, text, null);
    this.textInput.value = '';
  }

  async handlePaste(e) {
    for (const item of e.clipboardData.items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const label = 'FILE ' + this.fileCounter++;
          await this.processImageFile(file, label);
          this.addChatBubble(label, null, URL.createObjectURL(file));
        }
      }
    }
  }

  addItem(item) {
    if (item.type === 'image') {
      const blob = new Blob([item.data], { type: item.imageType === 'jpg' ? 'image/jpeg' : 'image/png' });
      item.objectUrl = URL.createObjectURL(blob);
    }
    this.items.push(item);
    this.renderItems();
  }

  addChatBubble(label, text, imgUrl) {
    const empty = this.chatHistory.querySelector('#chatEmpty');
    if (empty) empty.remove();
    const div = document.createElement('div');
    div.className = 'chat-bubble';
    div.innerHTML = `<div class="bubble-label">${label}</div>`;
    if (text) {
      const span = document.createElement('span');
      span.textContent = text;
      div.appendChild(span);
    }
    if (imgUrl) {
      const img = document.createElement('img');
      img.src = imgUrl;
      div.appendChild(img);
    }
    this.chatHistory.appendChild(div);
    this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
  }

  handleItemChange(e) {
    const card = e.target.closest('.item-card');
    if (!card) return;
    const item = this.items[+card.dataset.index];
    if (e.target.classList.contains('include-check')) item.included = e.target.checked;
    if (e.target.classList.contains('page-size')) {
      item.pageSize = e.target.value;
      updatePreview(card.querySelector('.preview'), item);
    }
    if (e.target.classList.contains('orientation')) {
      item.orientation = e.target.value;
      updatePreview(card.querySelector('.preview'), item);
    }
  }

  handleItemClick(e) {
    if (!e.target.classList.contains('remove-btn')) return;
    const card = e.target.closest('.item-card');
    const idx = +card.dataset.index;
    if (this.items[idx].objectUrl) URL.revokeObjectURL(this.items[idx].objectUrl);
    this.items.splice(idx, 1);
    this.renderItems();
  }

  handleItemDrop(e) {
    e.preventDefault();
    const from = +e.dataTransfer.getData('text/plain');
    const card = e.target.closest('.item-card');
    const to = card ? +card.dataset.index : this.items.length;
    if (from === to) return;
    const [moved] = this.items.splice(from, 1);
    this.items.splice(to, 0, moved);
    this.renderItems();
  }

  renderItems() {
    this.itemList.innerHTML = '';
    if (!this.items.length) {
      this.itemList.innerHTML = '<div class="empty-state">Upload files or add text to get started</div>';
      return;
    }
    const frag = document.createDocumentFragment();
    this.items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'item-card';
      card.draggable = true;
      card.dataset.index = index;

      card.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', index);
        card.classList.add('dragging');
      });
      card.addEventListener('dragend', () => card.classList.remove('dragging'));

      const aspectStyle = getAspectStyle(item);
      const pageLabel = `${item.pageSize} ${item.orientation[0].toUpperCase()}`;

      let previewHtml = '';
      if (item.type === 'image') {
        previewHtml = `<img src="${item.objectUrl}" alt=""><span class="page-label">${pageLabel}</span>`;
      } else if (item.type === 'pdf') {
        previewHtml = `<div class="pdf-icon">PDF</div><span class="page-label">${pageLabel}</span>`;
      } else {
        const snippet = item.content.replace(/\n/g, ' ').substring(0, 60) + (item.content.length > 60 ? '…' : '');
        previewHtml = `<div class="text-preview">${snippet}</div><span class="page-label">${pageLabel}</span>`;
      }

      card.innerHTML = `
        <div class="drag-handle">☰</div>
        <input type="checkbox" class="include-check" title="Include in PDF" ${item.included ? 'checked' : ''}>
        <div class="preview" style="${aspectStyle}">${previewHtml}</div>
        <div class="details">
          <div class="name" title="${item.name}">${item.name}</div>
          <div class="controls">
            <select class="page-size">
              <option value="8.5x11" ${item.pageSize === '8.5x11' ? 'selected' : ''}>8.5×11</option>
              <option value="11x17" ${item.pageSize === '11x17' ? 'selected' : ''}>11×17</option>
            </select>
            <select class="orientation">
              <option value="portrait" ${item.orientation === 'portrait' ? 'selected' : ''}>Portrait</option>
              <option value="landscape" ${item.orientation === 'landscape' ? 'selected' : ''}>Landscape</option>
            </select>
            <span class="badge">${item.type.toUpperCase()}</span>
          </div>
        </div>
        <button class="remove-btn" title="Remove">×</button>
      `;
      frag.appendChild(card);
    });
    this.itemList.appendChild(frag);
  }

  getItems() {
    return this.items;
  }
}
