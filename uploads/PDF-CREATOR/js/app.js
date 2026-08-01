import { FilenameManager } from './filename.js';
import { UIManager } from './ui.js';
import { generatePDF } from './pdfEngine.js';

const filenameMgr = new FilenameManager(document.getElementById('filenameDisplay'));
const ui = new UIManager();

document.getElementById('generateBtn').addEventListener('click', async () => {
  const btn = document.getElementById('generateBtn');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Working…';

  try {
    await generatePDF(ui.getItems(), filenameMgr.consume());
  } catch (err) {
    console.error(err);
    alert(err.message || 'Error generating PDF');
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
});
