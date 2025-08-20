/**
 * Gary's File Management System 📁🐶
 * Handles file uploads, editing, and project management
 */

// Add file management methods to Gary class
Gary.prototype.handleFileUpload = function(files) {
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.files.set(file.name, e.target.result);
            this.updateFileList();
            this.addMessage(`📁 Uploaded ${file.name}! I can now help you with this file.`);
        };
        reader.readAsText(file);
    });
};

Gary.prototype.updateFileList = function() {
    const fileList = document.getElementById('fileList');
    
    if (this.files.size === 0) {
        fileList.innerHTML = '<p class="no-files">No files uploaded yet. Upload some files to get started!</p>';
        return;
    }
    
    let html = '';
    for (const [filename, content] of this.files) {
        const extension = filename.split('.').pop().toLowerCase();
        const icon = this.getFileIcon(extension);
        const size = this.formatFileSize(content.length);
        
        html += `
            <div class="file-item" onclick="gary.openFile('${filename}')">
                <div class="file-icon">${icon}</div>
                <div class="file-info">
                    <div class="file-name">${filename}</div>
                    <div class="file-size">${size}</div>
                </div>
                <div class="file-actions">
                    <button onclick="event.stopPropagation(); gary.deleteFile('${filename}')" class="delete-btn">🗑️</button>
                </div>
            </div>
        `;
    }
    
    fileList.innerHTML = html;
};

Gary.prototype.getFileIcon = function(extension) {
    const icons = {
        'js': '📜',
        'jsx': '⚛️',
        'ts': '📘',
        'tsx': '⚛️',
        'py': '🐍',
        'html': '🌐',
        'css': '🎨',
        'json': '📋',
        'md': '📝',
        'txt': '📄',
        'vue': '💚',
        'php': '🐘',
        'java': '☕',
        'cpp': '⚙️',
        'c': '⚙️',
        'rb': '💎',
        'go': '🐹',
        'rs': '🦀',
        'swift': '🦉'
    };
    
    return icons[extension] || '📄';
};

Gary.prototype.formatFileSize = function(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

Gary.prototype.openFile = function(filename) {
    this.currentFile = filename;
    const content = this.files.get(filename);
    
    document.getElementById('editorTitle').textContent = `📝 ${filename}`;
    document.getElementById('codeTextarea').value = content;
    document.getElementById('codeEditor').style.display = 'flex';
    
    // Set syntax highlighting
    this.updateEditorSyntax(filename);
};

Gary.prototype.updateEditorSyntax = function(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const textarea = document.getElementById('codeTextarea');
    
    // Add syntax highlighting class for styling
    textarea.className = `language-${this.getLanguageClass(extension)}`;
};

Gary.prototype.getLanguageClass = function(extension) {
    const languages = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'html': 'html',
        'css': 'css',
        'json': 'json',
        'md': 'markdown'
    };
    
    return languages[extension] || 'text';
};

Gary.prototype.deleteFile = function(filename) {
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
        this.files.delete(filename);
        this.updateFileList();
        this.addMessage(`🗑️ Deleted ${filename}`);
        
        if (this.currentFile === filename) {
            this.closeEditor();
        }
    }
};

// Global file management functions
function toggleFileManager() {
    const fileManager = document.getElementById('fileManager');
    fileManager.classList.toggle('open');
}

function saveFile() {
    if (!gary.currentFile) return;
    
    const content = document.getElementById('codeTextarea').value;
    gary.files.set(gary.currentFile, content);
    gary.addMessage(`💾 Saved changes to ${gary.currentFile}`);
}

function downloadFile() {
    if (!gary.currentFile) return;
    
    const content = document.getElementById('codeTextarea').value;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = gary.currentFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function closeEditor() {
    document.getElementById('codeEditor').style.display = 'none';
    gary.currentFile = null;
}

// Enhanced file operations for AI assistance
Gary.prototype.createFile = function(filename, content) {
    this.files.set(filename, content);
    this.updateFileList();
    this.addMessage(`📁 Created ${filename}!`);
};

Gary.prototype.modifyFile = function(filename, newContent) {
    if (this.files.has(filename)) {
        this.files.set(filename, newContent);
        this.updateFileList();
        this.addMessage(`✏️ Modified ${filename}!`);
        return true;
    }
    return false;
};

Gary.prototype.getFileContent = function(filename) {
    return this.files.get(filename) || null;
};

Gary.prototype.listFiles = function() {
    return Array.from(this.files.keys());
};