import { app } from "/scripts/app.js";

// Store notes data for each node
// Format: nodeNotes[nodeId] = [ { text: "note text", date: "2023-04-15 10:30" }, ... ]
const nodeNotes = {};

// Flag to control notes visibility
let notesVisible = true;

// Create UI for notes modal
function createNotesUI() {
    // Create modal container if it doesn't exist
    if (!document.getElementById('notes-modal-container')) {
        const modalContainer = document.createElement('div');
        modalContainer.id = 'notes-modal-container';
        modalContainer.className = 'notes-modal-container';
        modalContainer.style.display = 'none';
        
        // Modal content
        modalContainer.innerHTML = `
            <div class="notes-modal">
                <div class="notes-modal-header">
                    <h3 id="notes-modal-title">Node Notes</h3>
                    <button class="notes-modal-close">&times;</button>
                </div>
                <div class="notes-modal-body">
                    <div id="notes-view-container">
                        <div id="notes-list"></div>
                    </div>
                    <div id="notes-edit-container" style="display: none;">
                        <textarea id="notes-edit-textarea" placeholder="Enter your note here..."></textarea>
                    </div>
                </div>
                <div class="notes-modal-footer">
                    <div class="notes-modal-footer-left">
                        <div class="notes-dropdown">
                            <button class="notes-dropdown-btn">Import/Export</button>
                            <div class="notes-dropdown-content">
                                <button id="notes-export-btn">Export Node Notes</button>
                                <button id="notes-import-btn">Import Node Notes</button>
                                <button id="notes-export-all-btn">Export All Notes</button>
                            </div>
                        </div>
                    </div>
                    <div class="notes-modal-footer-right">
                        <button id="notes-add-btn" class="notes-modal-btn">Add Note</button>
                        <button id="notes-save-btn" class="notes-modal-btn" style="display: none;">Save</button>
                        <button id="notes-cancel-btn" class="notes-modal-btn" style="display: none;">Cancel</button>
                        <button id="notes-close-btn" class="notes-modal-btn">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalContainer);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notes-modal-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            
            .notes-modal {
                background-color: #222;
                border-radius: 8px;
                width: 500px;
                max-width: 90%;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
                border: 1px solid #444;
            }
            
            .notes-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid #444;
                background-color: #333;
                border-radius: 8px 8px 0 0;
            }
            
            .notes-modal-header h3 {
                margin: 0;
                color: #FF9800;
                font-size: 18px;
            }
            
            .notes-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #aaa;
            }
            
            .notes-modal-close:hover {
                color: #FF9800;
            }
            
            .notes-modal-body {
                padding: 15px;
                overflow-y: auto;
                max-height: 60vh;
                flex-grow: 1;
            }
            
            .notes-modal-footer {
                padding: 15px;
                display: flex;
                justify-content: space-between;
                border-top: 1px solid #444;
                background-color: #333;
                border-radius: 0 0 8px 8px;
            }
            
            .notes-modal-footer-right {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
            
            .notes-modal-btn {
                padding: 8px 16px;
                background-color: #444;
                border: none;
                border-radius: 4px;
                color: white;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .notes-modal-btn:hover {
                background-color: #555;
            }
            
            #notes-add-btn, #notes-save-btn {
                background-color: #FF9800;
                color: #111;
            }
            
            #notes-add-btn:hover, #notes-save-btn:hover {
                background-color: #FFA726;
            }
            
            .notes-dropdown {
                position: relative;
                display: inline-block;
            }
            
            .notes-dropdown-btn {
                padding: 8px 16px;
                background-color: #444;
                border: none;
                border-radius: 4px;
                color: white;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .notes-dropdown-btn:hover {
                background-color: #555;
            }
            
            .notes-dropdown-content {
                display: none;
                position: absolute;
                bottom: 40px;
                left: 0;
                background-color: #333;
                min-width: 180px;
                box-shadow: 0 8px 16px rgba(0,0,0,0.3);
                z-index: 1;
                border-radius: 4px;
                border: 1px solid #444;
            }
            
            .notes-dropdown:hover .notes-dropdown-content {
                display: block;
            }
            
            .notes-dropdown-content button {
                width: 100%;
                text-align: left;
                padding: 10px 15px;
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;
            }
            
            .notes-dropdown-content button:hover {
                background-color: #444;
            }
            
            #notes-edit-textarea {
                width: 100%;
                min-height: 150px;
                background-color: #333;
                color: white;
                border: 1px solid #555;
                border-radius: 4px;
                padding: 10px;
                resize: vertical;
                font-family: inherit;
                font-size: 14px;
            }
            
            .note-item {
                background-color: #333;
                border-radius: 4px;
                padding: 10px 15px;
                margin-bottom: 10px;
                border-left: 3px solid #FF9800;
            }
            
            .note-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                font-size: 12px;
                color: #aaa;
            }
            
            .note-actions {
                display: flex;
                gap: 5px;
            }
            
            .note-action-btn {
                background: none;
                border: none;
                color: #aaa;
                cursor: pointer;
                font-size: 14px;
                padding: 0 5px;
            }
            
            .note-action-btn:hover {
                color: #FF9800;
            }
            
            .note-content {
                white-space: pre-wrap;
                color: white;
                font-size: 14px;
            }
            
            .note-item:last-child {
                margin-bottom: 0;
            }
        `;
        
        document.head.appendChild(style);
        
        // Event listeners for the modal
        setupModalEventListeners();
        
        // Initialize dropdown behavior
        initDropdownBehavior();
    }
}

// Set up event listeners for modal buttons
function setupModalEventListeners() {
    // Close modal when clicking close button
    document.querySelector('.notes-modal-close').addEventListener('click', closeModal);
    document.getElementById('notes-close-btn').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    document.getElementById('notes-modal-container').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Add note button
    document.getElementById('notes-add-btn').addEventListener('click', function() {
        showEditMode();
    });
    
    // Save button
    document.getElementById('notes-save-btn').addEventListener('click', saveNote);
    
    // Cancel button
    document.getElementById('notes-cancel-btn').addEventListener('click', function() {
        showViewMode();
    });
    
    // Export/Import buttons
    document.getElementById('notes-export-btn').addEventListener('click', function() {
        exportNotes(true); // Export for current node only
    });
    
    document.getElementById('notes-import-btn').addEventListener('click', function() {
        importNotes(true); // Import for current node only
    });
    
    document.getElementById('notes-export-all-btn').addEventListener('click', function() {
        exportNotes(false); // Export all nodes
    });
}

// Initialize dropdown behavior
function initDropdownBehavior() {
    // Make sure the dropdown is closed when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.matches('.notes-dropdown-btn') && !event.target.closest('.notes-dropdown-content')) {
            const dropdowns = document.getElementsByClassName('notes-dropdown-content');
            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                if (openDropdown.style.display === 'block') {
                    openDropdown.style.display = 'none';
                }
            }
        }
    });
    
    // Toggle dropdown when clicking the button
    document.querySelectorAll('.notes-dropdown-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const content = this.nextElementSibling;
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });
}

// Open modal with notes for a node
function openNotesModal(node) {
    createNotesUI(); // Make sure UI is created
    
    const modal = document.getElementById('notes-modal-container');
    const title = document.getElementById('notes-modal-title');
    const nodeTitle = node.title || `Node #${node.id}`;
    
    // Set title and show the modal
    title.textContent = `Notes: ${nodeTitle}`;
    modal.style.display = 'flex';
    
    // Store reference to current node
    modal.dataset.nodeId = node.id;
    
    // Show notes in view mode
    showViewMode();
    renderNotes(node);
}

// Close the modal
function closeModal() {
    const modal = document.getElementById('notes-modal-container');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Show modal in view mode
function showViewMode() {
    document.getElementById('notes-view-container').style.display = 'block';
    document.getElementById('notes-edit-container').style.display = 'none';
    document.getElementById('notes-add-btn').style.display = 'inline-block';
    document.getElementById('notes-save-btn').style.display = 'none';
    document.getElementById('notes-cancel-btn').style.display = 'none';
    document.getElementById('notes-close-btn').style.display = 'inline-block';
}

// Show modal in edit mode
function showEditMode(noteText = '', editIndex = -1) {
    document.getElementById('notes-view-container').style.display = 'none';
    document.getElementById('notes-edit-container').style.display = 'block';
    document.getElementById('notes-add-btn').style.display = 'none';
    document.getElementById('notes-save-btn').style.display = 'inline-block';
    document.getElementById('notes-cancel-btn').style.display = 'inline-block';
    document.getElementById('notes-close-btn').style.display = 'none';
    
    const textarea = document.getElementById('notes-edit-textarea');
    textarea.value = noteText;
    textarea.focus();
    
    // Store edit index in the textarea dataset
    textarea.dataset.editIndex = editIndex;
}

// Get current node from modal
function getCurrentNode() {
    const modal = document.getElementById('notes-modal-container');
    const nodeId = parseInt(modal.dataset.nodeId);
    return app.graph._nodes_by_id[nodeId];
}

// Render all notes for a node
function renderNotes(node) {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    
    if (!node.notes || node.notes.length === 0) {
        notesList.innerHTML = '<div class="note-item"><div class="note-content">No notes yet. Click "Add Note" to create one.</div></div>';
        return;
    }
    
    // Display notes from newest to oldest
    for (let i = node.notes.length - 1; i >= 0; i--) {
        const note = node.notes[i];
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        
        noteElement.innerHTML = `
            <div class="note-header">
                <span>${note.date}</span>
                <div class="note-actions">
                    <button class="note-action-btn edit-note" data-index="${i}">✏️</button>
                    <button class="note-action-btn delete-note" data-index="${i}">🗑️</button>
                </div>
            </div>
            <div class="note-content">${escapeHTML(note.text)}</div>
        `;
        
        notesList.appendChild(noteElement);
    }
    
    // Add event listeners to edit and delete buttons
    notesList.querySelectorAll('.edit-note').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            editExistingNote(index);
        });
    });
    
    notesList.querySelectorAll('.delete-note').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            deleteNote(index);
        });
    });
}

// Edit an existing note
function editExistingNote(index) {
    const node = getCurrentNode();
    if (node.notes && index < node.notes.length) {
        showEditMode(node.notes[index].text, index);
    }
}

// Save the current note
function saveNote() {
    const node = getCurrentNode();
    const textarea = document.getElementById('notes-edit-textarea');
    const noteText = textarea.value.trim();
    const editIndex = parseInt(textarea.dataset.editIndex);
    
    if (noteText) {
        const date = new Date();
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        const note = {
            text: noteText,
            date: editIndex >= 0 ? `${formattedDate} (edited)` : formattedDate
        };
        
        if (!node.notes) {
            node.notes = [];
        }
        
        if (editIndex >= 0 && editIndex < node.notes.length) {
            // Edit existing note
            node.notes[editIndex] = note;
        } else {
            // Add new note
            node.notes.push(note);
        }
        
        // Update global notes storage
        const noteId = node.id.toString();
        nodeNotes[noteId] = [...node.notes];
        
        // Update icon visibility
        if (node.notes.length > 0) {
            node.flags.hasNotes = true;
        }
        
        // Mark graph as dirty to ensure it gets saved
        if (app.graph) {
            app.graph.change();
        }
        
        // Switch back to view mode and render updated notes
        showViewMode();
        renderNotes(node);
    }
}

// Delete a note
function deleteNote(index) {
    if (!confirm("Delete this note?")) return;
    
    const node = getCurrentNode();
    if (node.notes && index < node.notes.length) {
        node.notes.splice(index, 1);
        
        // Update global notes storage
        const noteId = node.id.toString();
        nodeNotes[noteId] = [...node.notes];
        
        // Hide icon if there are no more notes
        if (node.notes.length === 0) {
            node.flags.hasNotes = false;
        }
        
        // Mark graph as dirty to ensure it gets saved
        if (app.graph) {
            app.graph.change();
        }
        
        // Render updated notes
        renderNotes(node);
    }
}

// Helper function to escape HTML content
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export notes to a JSON file
function exportNotes(nodeOnly = false) {
    if (nodeOnly) {
        // Export selected notes for the current node
        showExportSelectionModal(true);
    } else {
        // Export selected notes from all nodes
        showExportSelectionModal(false);
    }
}

// Show modal for selecting notes to export
function showExportSelectionModal(nodeOnly = false) {
    // Create a container for the export selection modal
    const modalContainer = document.createElement('div');
    modalContainer.id = 'notes-export-modal-container';
    modalContainer.className = 'notes-modal-container';
    
    let notesToExport = [];
    
    if (nodeOnly) {
        // Get notes for current node only
        const node = getCurrentNode();
        if (!node || !node.notes || node.notes.length === 0) {
            alert("No notes to export for this node.");
            return;
        }
        notesToExport.push({
            nodeId: node.id,
            nodeTitle: node.title || `Node #${node.id}`,
            notes: node.notes
        });
    } else {
        // Get all notes
        if (Object.keys(nodeNotes).length === 0) {
            alert("No notes to export.");
            return;
        }
        
        // Collect all notes with node information
        for (const nodeId in nodeNotes) {
            if (Array.isArray(nodeNotes[nodeId]) && nodeNotes[nodeId].length > 0) {
                const node = app.graph._nodes_by_id[parseInt(nodeId)];
                notesToExport.push({
                    nodeId: nodeId,
                    nodeTitle: node ? (node.title || `Node #${nodeId}`) : `Node #${nodeId}`,
                    notes: nodeNotes[nodeId]
                });
            }
        }
    }
    
    // Create the modal content
    modalContainer.innerHTML = `
        <div class="notes-modal">
            <div class="notes-modal-header">
                <h3>Select Notes to Export</h3>
                <button class="notes-modal-close">&times;</button>
            </div>
            <div class="notes-modal-body">
                <div id="export-selection-container">
                    ${notesToExport.map((nodeData, nodeIdx) => `
                        <div class="export-node-section">
                            <div class="export-node-header">
                                <label class="export-checkbox-label">
                                    <input type="checkbox" class="export-node-checkbox" data-node-idx="${nodeIdx}" checked>
                                    <strong>${nodeData.nodeTitle}</strong>
                                </label>
                                <button class="toggle-selection-btn" data-node-idx="${nodeIdx}">Toggle All</button>
                            </div>
                            <div class="export-note-items">
                                ${nodeData.notes.map((note, noteIdx) => `
                                    <div class="export-note-item">
                                        <label class="export-checkbox-label">
                                            <input type="checkbox" class="export-note-checkbox" 
                                                data-node-idx="${nodeIdx}" 
                                                data-note-idx="${noteIdx}" 
                                                checked>
                                            <span class="export-note-preview">${note.date} - ${escapeHTML(note.text.length > 50 ? note.text.substring(0, 50) + '...' : note.text)}</span>
                                        </label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="notes-modal-footer">
                <div class="notes-modal-footer-left">
                    <button id="select-all-notes-btn" class="notes-modal-btn">Select All</button>
                    <button id="deselect-all-notes-btn" class="notes-modal-btn">Deselect All</button>
                </div>
                <div class="notes-modal-footer-right">
                    <button id="export-selected-btn" class="notes-modal-btn">Export Selected</button>
                    <button id="cancel-export-btn" class="notes-modal-btn">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalContainer);
    
    // Add additional styles for the export selection modal
    const style = document.createElement('style');
    style.textContent = `
        #export-selection-container {
            max-height: 60vh;
            overflow-y: auto;
        }
        
        .export-node-section {
            margin-bottom: 20px;
            border: 1px solid #444;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .export-node-header {
            background-color: #333;
            padding: 10px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .export-note-items {
            padding: 0 15px;
        }
        
        .export-note-item {
            padding: 8px 0;
            border-bottom: 1px solid #444;
        }
        
        .export-note-item:last-child {
            border-bottom: none;
        }
        
        .export-checkbox-label {
            display: flex;
            align-items: flex-start;
            cursor: pointer;
        }
        
        .export-checkbox-label input[type="checkbox"] {
            margin-top: 3px;
            margin-right: 10px;
        }
        
        .export-note-preview {
            color: #ccc;
            font-size: 13px;
            white-space: pre-line;
        }
        
        .toggle-selection-btn {
            background-color: #444;
            border: none;
            color: white;
            padding: 4px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        }
        
        .toggle-selection-btn:hover {
            background-color: #555;
        }
    `;
    
    document.head.appendChild(style);
    
    // Set up event listeners for the export selection modal
    setupExportSelectionModalEventListeners(notesToExport, nodeOnly);
}

function setupExportSelectionModalEventListeners(notesToExport, nodeOnly) {
    const modalContainer = document.getElementById('notes-export-modal-container');
    
    // Close button
    modalContainer.querySelector('.notes-modal-close').addEventListener('click', function() {
        modalContainer.remove();
    });
    
    // Cancel button
    document.getElementById('cancel-export-btn').addEventListener('click', function() {
        modalContainer.remove();
    });
    
    // Select All button
    document.getElementById('select-all-notes-btn').addEventListener('click', function() {
        modalContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
        });
    });
    
    // Deselect All button
    document.getElementById('deselect-all-notes-btn').addEventListener('click', function() {
        modalContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    });
    
    // Toggle All buttons for each node
    modalContainer.querySelectorAll('.toggle-selection-btn').forEach(button => {
        button.addEventListener('click', function() {
            const nodeIdx = this.dataset.nodeIdx;
            const nodeCheckbox = modalContainer.querySelector(`.export-node-checkbox[data-node-idx="${nodeIdx}"]`);
            const noteCheckboxes = modalContainer.querySelectorAll(`.export-note-checkbox[data-node-idx="${nodeIdx}"]`);
            
            // Check if all note checkboxes are currently checked
            const allChecked = Array.from(noteCheckboxes).every(cb => cb.checked);
            
            // Toggle all checkboxes
            noteCheckboxes.forEach(checkbox => {
                checkbox.checked = !allChecked;
            });
            
            // Update node checkbox based on note checkboxes
            nodeCheckbox.checked = !allChecked && Array.from(noteCheckboxes).some(cb => cb.checked);
        });
    });
    
    // Node checkboxes control note checkboxes
    modalContainer.querySelectorAll('.export-node-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const nodeIdx = this.dataset.nodeIdx;
            const noteCheckboxes = modalContainer.querySelectorAll(`.export-note-checkbox[data-node-idx="${nodeIdx}"]`);
            
            noteCheckboxes.forEach(noteCheckbox => {
                noteCheckbox.checked = this.checked;
            });
        });
    });
    
    // Note checkboxes affect node checkbox
    modalContainer.querySelectorAll('.export-note-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const nodeIdx = this.dataset.nodeIdx;
            const nodeCheckbox = modalContainer.querySelector(`.export-node-checkbox[data-node-idx="${nodeIdx}"]`);
            const noteCheckboxes = modalContainer.querySelectorAll(`.export-note-checkbox[data-node-idx="${nodeIdx}"]`);
            
            // If at least one note is checked, the node checkbox should be checked
            // If no notes are checked, the node checkbox should be unchecked
            nodeCheckbox.checked = Array.from(noteCheckboxes).some(cb => cb.checked);
        });
    });
    
    // Export Selected button
    document.getElementById('export-selected-btn').addEventListener('click', function() {
        // Collect selected notes
        let exportData = {};
        
        notesToExport.forEach((nodeData, nodeIdx) => {
            const nodeCheckbox = modalContainer.querySelector(`.export-node-checkbox[data-node-idx="${nodeIdx}"]`);
            
            if (nodeCheckbox.checked) {
                const selectedNotes = [];
                
                nodeData.notes.forEach((note, noteIdx) => {
                    const noteCheckbox = modalContainer.querySelector(`.export-note-checkbox[data-node-idx="${nodeIdx}"][data-note-idx="${noteIdx}"]`);
                    
                    if (noteCheckbox && noteCheckbox.checked) {
                        selectedNotes.push(note);
                    }
                });
                
                if (selectedNotes.length > 0) {
                    exportData[nodeData.nodeId] = selectedNotes;
                }
            }
        });
        
        if (Object.keys(exportData).length === 0) {
            alert("No notes selected for export.");
            return;
        }
        
        // Create a download link and trigger the download
        const fileName = nodeOnly ? 
            `notes_node_${getCurrentNode().id}.json` : 
            "node_notes.json";
            
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", fileName);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        
        // Close the modal
        modalContainer.remove();
    });
}

// Import notes from a JSON file
function importNotes() {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const importData = JSON.parse(event.target.result);
                const node = getCurrentNode();
                const nodeId = node.id.toString();
                
                // Check if the imported data is an array (notes for a single node)
                if (Array.isArray(importData)) {
                    node.notes = importData;
                    nodeNotes[nodeId] = [...importData];
                } 
                // Check if the imported data is an object with node IDs
                else if (typeof importData === 'object' && importData !== null) {
                    // Check if current node ID exists in imported data
                    if (importData[nodeId] && Array.isArray(importData[nodeId])) {
                        node.notes = [...importData[nodeId]];
                        nodeNotes[nodeId] = [...importData[nodeId]];
                    } 
                    // If not, take the first node's notes
                    else {
                        const firstNodeId = Object.keys(importData)[0];
                        if (firstNodeId && Array.isArray(importData[firstNodeId])) {
                            node.notes = [...importData[firstNodeId]];
                            nodeNotes[nodeId] = [...importData[firstNodeId]];
                        } else {
                            throw new Error("Invalid import format. Expected an array of notes or an object with node IDs.");
                        }
                    }
                } else {
                    throw new Error("Invalid import format. Expected an array of notes or an object with node IDs.");
                }
                
                // Update node display
                if (node.notes.length > 0) {
                    node.flags.hasNotes = true;
                } else {
                    node.flags.hasNotes = false;
                }
                
                // Refresh the notes display
                renderNotes(node);
                
                // Mark graph as dirty to ensure it gets saved
                if (app.graph) {
                    app.graph.change();
                }
                
            } catch (error) {
                console.error("Error importing notes:", error);
                alert("Error importing notes: " + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    // Trigger file selection
    fileInput.click();
}

// Create the draggable notes icon
function createNotesIcon() {
    const style = document.createElement('style');
    style.textContent = `
        #notes-icon {
            position: fixed;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background: #1a1a1a;
            border-radius: 4px;
            border: 1px solid #333;
            color: #ddd;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: move;
            z-index: 999;
            transition: all 0.2s;
            user-select: none;
        }
        
        #notes-icon:hover {
            background: #333;
            color: #fff;
        }
        
        #notes-icon.active {
            color: #FF9800;
            border-color: #FF9800;
        }
    `;
    document.head.appendChild(style);
    
    const notesIcon = document.createElement('div');
    notesIcon.id = 'notes-icon';
    notesIcon.innerHTML = '📋';
    notesIcon.title = 'Toggle Notes Panel';
    
    notesIcon.addEventListener('click', function(e) {
        if (!notesIcon.isDragging) {
            toggleGlobalNotesPanel();
            notesIcon.classList.toggle('active', 
                document.getElementById('global-notes-panel-container').style.display === 'flex');
        }
        notesIcon.isDragging = false;
    });
    
    // Add drag functionality
    let offsetX, offsetY;
    let isDragging = false;
    
    notesIcon.addEventListener('mousedown', function(e) {
        offsetX = e.clientX - notesIcon.getBoundingClientRect().left;
        offsetY = e.clientY - notesIcon.getBoundingClientRect().top;
        isDragging = true;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            notesIcon.style.left = `${x}px`;
            notesIcon.style.top = `${y}px`;
            notesIcon.style.transform = 'none';
            
            notesIcon.isDragging = true;
        }
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
        setTimeout(() => {
            if (notesIcon.isDragging) {
                notesIcon.isDragging = false;
            }
        }, 10);
    });
    
    document.body.appendChild(notesIcon);
}

app.registerExtension({
    name: "NodeNotes",
    
    async beforeRegisterNodeDef(nodeType, nodeData) {
        // Store the original methods to call later
        const origOnNodeCreated = nodeType.prototype.onNodeCreated;
        const origGetComputeSize = nodeType.prototype.getComputeSize;
        const origOnDrawForeground = nodeType.prototype.onDrawForeground;
        const origGetExtraMenuOptions = nodeType.prototype.getExtraMenuOptions;
        const origOnSerialize = nodeType.prototype.onSerialize;
        const origOnConfigure = nodeType.prototype.onConfigure;
        const origCollapse = nodeType.prototype.collapse;
        const origOnResize = nodeType.prototype.onResize;

        // Add notes array to the node
        nodeType.prototype.notes = [];
        
        // Override the onNodeCreated function
        nodeType.prototype.onNodeCreated = function() {
            if (origOnNodeCreated) {
                origOnNodeCreated.apply(this, arguments);
            }
            
            // Initialize note flags
            if (!this.flags) {
                this.flags = {};
            }
            
            // Initialize empty notes array
            this.notes = [];
        };
        
        // Override onSerialize to save notes with the node
        nodeType.prototype.onSerialize = function(o) {
            if (origOnSerialize) {
                origOnSerialize.apply(this, arguments);
            }
            
            // Save notes in the node's serialized data
            if (this.notes && this.notes.length > 0) {
                o.notes = this.notes;
            }
        };
        
        // Override onConfigure to load notes when a node is configured
        nodeType.prototype.onConfigure = function(o) {
            if (origOnConfigure) {
                origOnConfigure.apply(this, arguments);
            }
            
            // Load notes from the node's configuration data
            if (o.notes && Array.isArray(o.notes)) {
                this.notes = o.notes;
                
                // Update global notes storage
                const noteId = this.id.toString();
                nodeNotes[noteId] = [...this.notes];
                
                // Mark node as having notes
                if (this.notes.length > 0) {
                    this.flags.hasNotes = true;
                    app.graph.setDirtyCanvas(true);
                }
            }
        };

        // Override getExtraMenuOptions to add our menu items
        nodeType.prototype.getExtraMenuOptions = function(_, options) {
            // Call original method if it exists
            if (origGetExtraMenuOptions) {
                origGetExtraMenuOptions.apply(this, arguments);
            }
            
            // Add a separator
            options.push(null);
            
            // Check if node has notes
            if (this.notes && this.notes.length > 0) {
                // Add view notes entry
                options.push({
                    content: `📑 View Notes (${this.notes.length})`,
                    callback: () => {
                        openNotesModal(this);
                    }
                });
            } else {
                // Add add note entry
                options.push({
                    content: "📝 Add Note",
                    callback: () => {
                        openNotesModal(this);
                    }
                });
            }
            
            return options;
        };
        
        // Override getComputeSize to make room for the note icon
        nodeType.prototype.getComputeSize = function() {
            let size = origGetComputeSize ? origGetComputeSize.apply(this, arguments) : [200, 100];
            
            // Only add extra space if we have notes
            if (this.flags && this.flags.hasNotes) {
                size[0] += 20; // Add a bit of width for our icon
            }
            
            return size;
        };
        
        // Override onDrawForeground to draw the note icon
        nodeType.prototype.onDrawForeground = function(ctx) {
            if (origOnDrawForeground) {
                origOnDrawForeground.apply(this, arguments);
            }
            
            if (this.flags && this.flags.hasNotes && this.notes && this.notes.length > 0 && !this.flags.collapsed) {
                ctx.save();
                
                const noteIconSize = 16;
                const x = this.size[0] - noteIconSize - 5;
                const y = -noteIconSize - 4;
                
                // Draw a small info circle
                ctx.fillStyle = "#FF9800";
                ctx.beginPath();
                ctx.arc(x + noteIconSize/2, y + noteIconSize/2, noteIconSize/2, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw a number indicating how many notes
                ctx.fillStyle = "white";
                ctx.font = "bold 10px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                
                const noteCount = Math.min(this.notes.length, 9);
                const noteCountText = this.notes.length > 9 ? "9+" : noteCount.toString();
                ctx.fillText(noteCountText, x + noteIconSize/2, y + noteIconSize/2);
                
                ctx.restore();
            }
        };
        
        // Override the collapse method to update canvas when collapsing
        nodeType.prototype.collapse = function(collapse) {
            if (origCollapse) {
                origCollapse.apply(this, arguments);
            } else {
                if (collapse === undefined) {
                    collapse = !this.flags.collapsed;
                }
                this.flags.collapsed = collapse;
            }
            
            if (this.graph) {
                this.graph.setDirtyCanvas(true, true);
            }
        };
        
        // Override the onResize method to update icon position when resizing
        nodeType.prototype.onResize = function(size) {
            if (origOnResize) {
                origOnResize.apply(this, arguments);
            }
            
            if (this.graph && this.flags && this.flags.hasNotes) {
                this.graph.setDirtyCanvas(true, true);
            }
        };
    },
    
    async setup() {
        // Create the UI early
        createNotesUI();
        
        // Create the draggable notes icon
        createNotesIcon();
        
        // Hook into the graph serialization process to save notes
        const origGraphToJSON = LiteGraph.LGraph.prototype.toJSON;
        
        LiteGraph.LGraph.prototype.toJSON = function() {
            const graphData = origGraphToJSON.apply(this, arguments);
            
            // Make sure there's an 'extra' field to store our data
            if (!graphData.extra) {
                graphData.extra = {};
            }
            
            graphData.extra.nodeNotes = JSON.parse(JSON.stringify(nodeNotes));
            
            return graphData;
        };
        
        // Override graph load to restore notes
        const origLoadGraphData = app.loadGraphData;
        app.loadGraphData = function(graphData) {
            const result = origLoadGraphData.apply(this, arguments);
            
            // Load notes from graph extra data
            if (graphData && graphData.extra && graphData.extra.nodeNotes) {
                Object.assign(nodeNotes, JSON.parse(JSON.stringify(graphData.extra.nodeNotes)));
            }
            
            return result;
        };
        
        // Explicitly register the extension with ComfyUI workflow serialization
        if (app.registerExtension) {
            app.registerExtension({
                name: "NodeNotes.Serialization",
                
                beforeRegisterNodeDef(nodeType) {
                    // If the node already has our extension loaded, don't add it again
                    if (nodeType.prototype.hasOwnProperty("notes")) {
                        return;
                    }
                    
                    // Initialize empty notes array
                    nodeType.prototype.notes = [];
                },
                
                // Add properties to save in workflow
                getNodeProperties(node) {
                    // If the node has notes, add them to saved properties
                    if (node.notes && node.notes.length > 0) {
                        return { notes: node.notes };
                    }
                    return {};
                },
                
                // When loading properties from workflow
                loadedGraphNode(node, properties) {
                    // If there are notes in the saved properties, restore them
                    if (properties.notes && Array.isArray(properties.notes)) {
                        node.notes = properties.notes;
                        
                        // Store in global collection
                        const noteId = node.id.toString();
                        nodeNotes[noteId] = [...node.notes];
                        
                        // Show note icon if there are notes
                        if (node.notes.length > 0) {
                            if (!node.flags) node.flags = {};
                            node.flags.hasNotes = true;
                        }
                    }
                }
            });
        }
        
        console.log("Node Notes extension loaded");
    }
});

// Create UI for the global notes panel
function createGlobalNotesPanel() {
    if (!document.getElementById('global-notes-panel-container')) {
        const panelContainer = document.createElement('div');
        panelContainer.id = 'global-notes-panel-container';
        panelContainer.className = 'global-notes-panel-container';
        panelContainer.style.display = 'none';
        
        // Panel content
        panelContainer.innerHTML = `
            <div class="global-notes-panel">
                <div class="global-notes-panel-header">
                    <div class="global-notes-panel-controls">
                        <input type="text" id="global-notes-search" placeholder="Search notes...">
                        <button id="global-notes-refresh-btn" title="Refresh Notes">🔄</button>
                        <button id="global-notes-close-btn" title="Close" style="margin-right: 15px;">&times;</button>
                    </div>
                </div>
                <div class="global-notes-panel-body">
                    <div id="global-notes-list"></div>
                </div>
                <div class="global-notes-panel-footer">
                    <button id="global-notes-import-all-btn" title="Import Notes">Import</button>
                    <button id="global-notes-export-btn" title="Export Notes">Export</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panelContainer);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .global-notes-panel-container {
                position: fixed;
                top: 0;
                right: 0;
                width: 350px;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.3);
                z-index: 9000;
                display: flex;
                justify-content: flex-end;
            }
            
            .global-notes-panel {
                width: 100%;
                height: 100%;
                background-color: #222;
                border-left: 1px solid #444;
                display: flex;
                flex-direction: column;
            }
            
            .global-notes-panel-header {
                padding: 15px;
                background-color: #333;
                border-bottom: 1px solid #444;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .global-notes-panel-controls {
                display: flex;
                width: 100%;
                justify-content: space-between;
                align-items: center;
            }
            
            #global-notes-search {
                padding: 5px 10px;
                background-color: #444;
                border: 1px solid #555;
                border-radius: 4px;
                color: white;
                flex-grow: 1;
                margin-right: 10px;
            }
            
            #global-notes-refresh-btn {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #aaa;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
            }
            
            #global-notes-refresh-btn:hover {
                color: #FF9800;
            }
            
            .global-notes-panel-footer {
                padding: 15px;
                background-color: #333;
                border-top: 1px solid #444;
                display: flex;
                gap: 10px;
            }
            
            #global-notes-import-all-btn, #global-notes-export-btn {
                padding: 8px 16px;
                background-color: #FF9800;
                color: #111;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                flex-grow: 1;
            }
            
            #global-notes-import-all-btn:hover, #global-notes-export-btn:hover {
                background-color: #FFA726;
            }
            
            #global-notes-close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #aaa;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            #global-notes-close-btn:hover {
                color: #FF9800;
            }
            
            .global-notes-panel-body {
                flex-grow: 1;
                overflow-y: auto;
                padding: 15px;
            }
            
            .global-node-notes-group {
                margin-bottom: 20px;
                border: 1px solid #444;
                border-radius: 4px;
                overflow: hidden;
            }
            
            .global-node-header {
                background-color: #333;
                padding: 10px 15px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #444;
            }
            
            .global-node-header.collapsed .collapse-indicator {
                transform: rotate(-90deg);
            }
            
            .collapse-indicator {
                display: inline-block;
                margin-right: 5px;
                transition: transform 0.2s ease;
                color: #FF9800;
                font-size: 10px;
                cursor: pointer;
            }
            
            .global-node-title-text {
                cursor: pointer;
            }
            
            .global-node-notes-count {
                cursor: pointer;
            }
            
            .global-node-notes {
                padding: 10px 15px;
                max-height: 300px;
                overflow-y: auto;
            }
            
            .global-note-item {
                padding: 8px 0;
                border-bottom: 1px solid #444;
            }
            
            .global-note-item:last-child {
                border-bottom: none;
            }
            
            .global-note-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                font-size: 12px;
                color: #aaa;
            }
            
            .global-note-content {
                color: white;
                font-size: 14px;
                white-space: pre-wrap;
                max-height: 100px;
                overflow-y: auto;
            }
            
            .global-note-actions {
                display: flex;
                gap: 5px;
                margin-top: 5px;
                justify-content: flex-end;
            }
            
            .global-note-btn {
                padding: 3px 8px;
                background-color: #444;
                border: none;
                border-radius: 3px;
                color: white;
                cursor: pointer;
                font-size: 12px;
            }
            
            .global-note-btn:hover {
                background-color: #555;
            }
            
            .no-notes-message {
                color: #aaa;
                text-align: center;
                padding: 20px;
            }
        `;
        document.head.appendChild(style);
        
        // Setup event listeners
        setupGlobalNotesPanelEventListeners();
    }
}

// Setup event listeners for global notes panel
function setupGlobalNotesPanelEventListeners() {
    const panelContainer = document.getElementById('global-notes-panel-container');
    
    // Close button
    document.getElementById('global-notes-close-btn').addEventListener('click', function() {
        panelContainer.style.display = 'none';
    });
    
    // Refresh button
    document.getElementById('global-notes-refresh-btn').addEventListener('click', function() {
        refreshGlobalNotes();
    });
    
    // Export button
    document.getElementById('global-notes-export-btn').addEventListener('click', function() {
        exportAllNotes();
    });
    
    // Import button
    document.getElementById('global-notes-import-all-btn').addEventListener('click', function() {
        importAllNotes();
    });
    
    // Search functionality
    document.getElementById('global-notes-search').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterGlobalNotes(searchTerm);
    });
}

// Filter global notes based on search term
function filterGlobalNotes(searchTerm) {
    const nodeGroups = document.querySelectorAll('.global-node-notes-group');
    
    nodeGroups.forEach(group => {
        const notes = group.querySelectorAll('.global-note-item');
        let hasVisibleNotes = false;
        
        notes.forEach(note => {
            const content = note.querySelector('.global-note-content').textContent.toLowerCase();
            const date = note.querySelector('.global-note-date').textContent.toLowerCase();
            
            if (content.includes(searchTerm) || date.includes(searchTerm)) {
                note.style.display = 'block';
                hasVisibleNotes = true;
            } else {
                note.style.display = 'none';
            }
        });
        
        // Show or hide the node group based on whether it has any visible notes
        group.style.display = hasVisibleNotes ? 'block' : 'none';
    });
}

// Render all notes for a node in global panel
function renderGlobalNotes() {
    const notesList = document.getElementById('global-notes-list');
    notesList.innerHTML = '';
    
    // Check if we have any notes
    const hasNotes = Object.keys(nodeNotes).some(nodeId => 
        Array.isArray(nodeNotes[nodeId]) && nodeNotes[nodeId].length > 0
    );
    
    if (!hasNotes) {
        notesList.innerHTML = '<div class="no-notes-message">No notes found in this workflow</div>';
        return;
    }
    
    // Group notes by node
    for (const nodeId in nodeNotes) {
        if (Array.isArray(nodeNotes[nodeId]) && nodeNotes[nodeId].length > 0) {
            const node = app.graph._nodes_by_id[parseInt(nodeId)];
            const nodeTitle = node ? (node.title || `Node #${nodeId}`) : `Node #${nodeId}`;
            
            const nodeGroup = document.createElement('div');
            nodeGroup.className = 'global-node-notes-group';
            nodeGroup.dataset.nodeId = nodeId;
            
            // Check if this node group was previously collapsed
            const storageKey = `node_notes_collapsed_${nodeId}`;
            const isCollapsed = localStorage.getItem(storageKey) === 'true';
            const collapsedClass = isCollapsed ? 'collapsed' : '';
            
            nodeGroup.innerHTML = `
                <div class="global-node-header ${collapsedClass}">
                    <div class="global-node-title">
                        <span class="collapse-indicator">▼</span>
                        <span class="global-node-title-text">${escapeHTML(nodeTitle)}</span>
                        <span class="global-node-notes-count">${nodeNotes[nodeId].length}</span>
                    </div>
                </div>
                <div class="global-node-notes" style="${isCollapsed ? 'display:none;' : ''}">
                    ${nodeNotes[nodeId].map((note, index) => `
                        <div class="global-note-item" data-note-index="${index}">
                            <div class="global-note-header">
                                <span class="global-note-date">${note.date}</span>
                            </div>
                            <div class="global-note-content">${escapeHTML(note.text)}</div>
                            <div class="global-note-actions">
                                <button class="global-note-btn global-edit-note" data-node-id="${nodeId}" data-note-index="${index}">Edit</button>
                                <button class="global-note-btn global-delete-note" data-node-id="${nodeId}" data-note-index="${index}">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            notesList.appendChild(nodeGroup);
        }
    }
    
    // Add event listeners to the node headers to focus the node and toggle collapse
    notesList.querySelectorAll('.global-node-header').forEach(header => {
        header.addEventListener('click', function(e) {
            const nodeId = parseInt(this.parentElement.dataset.nodeId);
            const node = app.graph._nodes_by_id[nodeId];
            
            if (e.target.closest('.collapse-indicator')) {
                const nodeGroup = this.parentElement;
                const notesContainer = nodeGroup.querySelector('.global-node-notes');
                const isCollapsed = this.classList.toggle('collapsed');
                
                const storageKey = `node_notes_collapsed_${nodeId}`;
                localStorage.setItem(storageKey, isCollapsed);
                
                if (isCollapsed) {
                    notesContainer.style.display = 'none';
                } else {
                    notesContainer.style.display = 'block';
                }
                
                e.stopPropagation();
            }
            else if (e.target.closest('.global-node-title-text') || e.target.closest('.global-node-notes-count')) {
                if (node) {
                    app.canvas.centerOnNode(node);
                }
            }
        });
    });
    
    // Add event listeners for edit/delete buttons
    notesList.querySelectorAll('.global-edit-note').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const nodeId = parseInt(this.dataset.nodeId);
            const noteIndex = parseInt(this.dataset.noteIndex);
            const node = app.graph._nodes_by_id[nodeId];
            
            if (node) {
                // Open the notes modal in edit mode for this specific note
                openNotesModal(node);
                setTimeout(() => {
                    editExistingNote(noteIndex);
                }, 100);
            }
        });
    });
    
    notesList.querySelectorAll('.global-delete-note').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const nodeId = parseInt(this.dataset.nodeId);
            const noteIndex = parseInt(this.dataset.noteIndex);
            const node = app.graph._nodes_by_id[nodeId];
            
            if (node && confirm("Delete this note?")) {
                if (node.notes && noteIndex < node.notes.length) {
                    node.notes.splice(noteIndex, 1);
                    
                    // Update global notes storage
                    nodeNotes[nodeId] = [...node.notes];
                    
                    if (node.notes.length === 0) {
                        node.flags.hasNotes = false;
                    }
                    
                    // Mark graph as dirty to ensure it gets saved
                    if (app.graph) {
                        app.graph.change();
                    }
                    
                    // Refresh the global notes panel
                    renderGlobalNotes();
                }
            }
        });
    });
}

// Open global notes panel and populate it with all notes
function openGlobalNotesPanel() {
    createGlobalNotesPanel();
    
    const panelContainer = document.getElementById('global-notes-panel-container');
    panelContainer.style.display = 'flex';
    
    renderGlobalNotes();
}

// Function to update the notes list in the panel
function refreshGlobalNotes() {
    Object.keys(nodeNotes).forEach(key => delete nodeNotes[key]);
    
    const nodes = app.graph._nodes;
    if (nodes && nodes.length > 0) {
        nodes.forEach(node => {
            if (node.notes && node.notes.length > 0) {
                nodeNotes[node.id.toString()] = [...node.notes];
            }
        });
    }
    
    if (document.getElementById('global-notes-panel-container').style.display === 'flex') {
        renderGlobalNotes();
    }
}

// Export all notes
function exportAllNotes() {
    const notesToExport = {};
    
    for (const nodeId in nodeNotes) {
        if (Array.isArray(nodeNotes[nodeId]) && nodeNotes[nodeId].length > 0) {
            notesToExport[nodeId] = [...nodeNotes[nodeId]];
        }
    }
    
    notesToExport._nodeTitles = {};
    app.graph._nodes.forEach(node => {
        if (node.title) {
            notesToExport._nodeTitles[node.id.toString()] = node.title;
        }
    });
    
    if (Object.keys(notesToExport).length <= 1) { // if only _nodeTitles exist
        alert("No notes to export.");
        return;
    }
    
    const fileName = "node_notes.json";
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notesToExport, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Temporarily highlight a node
function highlightNode(node) {
    app.canvas.centerOnNode(node);
}

// Toggle global notes panel
function toggleGlobalNotesPanel() {
    const panelContainer = document.getElementById('global-notes-panel-container');
    
    if (panelContainer && panelContainer.style.display === 'flex') {
        panelContainer.style.display = 'none';
    } else {
        openGlobalNotesPanel();
    }
}

// Import notes through the panel
function importAllNotes() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const importData = JSON.parse(event.target.result);
                
                if (typeof importData === 'object' && importData !== null) {
                    const importedNodeTitles = {};
                    if (importData._nodeTitles) {
                        Object.assign(importedNodeTitles, importData._nodeTitles);
                        delete importData._nodeTitles;
                    }
                    
                    const validNodes = Object.keys(importData).filter(nodeId => 
                        Array.isArray(importData[nodeId]) && importData[nodeId].length > 0
                    );
                    
                    if (validNodes.length === 0) {
                        alert("No notes to import in the selected file.");
                        return;
                    }
                    
                    const importMapping = prepareImportMapping(importData, importedNodeTitles);
                    showImportMappingDialog(importMapping);
                } else {
                    throw new Error("Invalid import format. Expected an object with node IDs and note arrays.");
                }
            } catch (error) {
                console.error("Error importing notes:", error);
                alert("Error importing notes: " + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    fileInput.click();
}

// Prepare data for import dialog
function prepareImportMapping(importData, importedNodeTitles) {
    const existingNodes = {};
    const existingNodesByTitle = {};
    
    app.graph._nodes.forEach(node => {
        const nodeId = node.id.toString();
        const nodeTitle = node.title || `Node #${nodeId}`;
        const nodeType = node.type;
        
        existingNodes[nodeId] = {
            id: nodeId,
            title: nodeTitle,
            type: nodeType,
            node: node
        };
        
        if (node.title) {
            if (!existingNodesByTitle[node.title]) {
                existingNodesByTitle[node.title] = [];
            }
            existingNodesByTitle[node.title].push(existingNodes[nodeId]);
        }
    });
    
    const importMapping = [];
    
    for (const sourceNodeId in importData) {
        const notes = importData[sourceNodeId];
        if (!Array.isArray(notes) || notes.length === 0) continue;
        
        let sourceNodeTitle = '';
        
        if (importedNodeTitles && importedNodeTitles[sourceNodeId]) {
            sourceNodeTitle = importedNodeTitles[sourceNodeId];
        } 
        else if (notes[0] && notes[0].nodeTitle) {
            sourceNodeTitle = notes[0].nodeTitle;
        }
        
        let suggestedTarget = null;
        let matchReason = '';
        
        // Check for matching options
        if (existingNodes[sourceNodeId] && 
            (!sourceNodeTitle || existingNodes[sourceNodeId].title === sourceNodeTitle)) {
            suggestedTarget = existingNodes[sourceNodeId];
            matchReason = 'Full match (ID and title)';
        }
        else if (existingNodes[sourceNodeId]) {
            suggestedTarget = existingNodes[sourceNodeId];
            matchReason = 'ID match';
        }
        else if (sourceNodeTitle && existingNodesByTitle[sourceNodeTitle]) {
            if (existingNodesByTitle[sourceNodeTitle].length === 1) {
                suggestedTarget = existingNodesByTitle[sourceNodeTitle][0];
                matchReason = 'Title match';
            }
        }
        
        importMapping.push({
            sourceNodeId: sourceNodeId,
            sourceNodeTitle: sourceNodeTitle || `Node #${sourceNodeId}`,
            notes: notes,
            notesCount: notes.length,
            previewText: notes[0].text.substring(0, 100) + (notes[0].text.length > 100 ? '...' : ''),
            suggestedTarget: suggestedTarget,
            matchReason: matchReason,
            targetNode: suggestedTarget ? suggestedTarget.node : null
        });
    }
    
    return {
        mappings: importMapping,
        existingNodes: existingNodes,
        existingNodesByTitle: existingNodesByTitle
    };
}

// Show dialog for selecting target nodes for all notes
function showImportMappingDialog(importMapping) {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'notes-import-mapping-modal';
    modalContainer.className = 'notes-modal-container';
    modalContainer.style.display = 'flex';
    
    const existingNodes = Object.values(importMapping.existingNodes);
    const nodesByType = {};
    
    existingNodes.forEach(node => {
        if (!nodesByType[node.type]) {
            nodesByType[node.type] = [];
        }
        nodesByType[node.type].push(node);
    });
    
    const sortedTypes = Object.keys(nodesByType).sort();
    sortedTypes.forEach(type => {
        nodesByType[type].sort((a, b) => a.title.localeCompare(b.title));
    });

    const allNodes = existingNodes.map(node => ({
        id: node.id,
        title: node.title,
        type: node.type,
        searchText: `${node.title.toLowerCase()} ${node.type.toLowerCase()} ${node.id}`
    }));
    
    modalContainer.innerHTML = `
        <div class="notes-modal">
            <div class="notes-modal-header">
                <h3>Select Notes to Import</h3>
                <button class="notes-modal-close">&times;</button>
            </div>
            <div class="notes-modal-body">
                <div id="import-selection-container">
                    <p>Review and confirm note assignments for each node:</p>
                    <div class="import-select-all-container">
                        <label><input type="checkbox" id="select-all-checkbox" checked> Select All</label>
                        <button id="apply-suggested-btn" class="small-btn">Apply Suggestions</button>
                    </div>
                </div>
                <div id="import-mappings-container">
                    ${importMapping.mappings.map((mapping, index) => {
                        const isAutoMatched = mapping.suggestedTarget !== null;
                        const matchClass = isAutoMatched ? 'has-match' : 'no-match';
                        const matchIcon = isAutoMatched ? '✓' : '❓';
                        
                        return `
                            <div class="import-mapping-item ${matchClass}" data-index="${index}">
                                <div class="import-mapping-checkbox">
                                    <input type="checkbox" class="mapping-checkbox" data-index="${index}" ${isAutoMatched ? 'checked' : ''}>
                                </div>
                                <div class="import-mapping-content">
                                    <div class="import-mapping-source">
                                        <strong>${mapping.sourceNodeTitle}</strong>
                                        <span class="notes-count">(${mapping.notesCount} notes)</span>
                                        <div class="import-mapping-preview">${escapeHTML(mapping.previewText)}</div>
                                    </div>
                                    <div class="import-mapping-arrow">
                                        <span class="match-icon" title="${mapping.matchReason || 'No automatic match'}">${matchIcon}</span>
                                        <span class="arrow">→</span>
                                    </div>
                                    <div class="import-mapping-target">
                                        <div class="select-with-search">
                                            <div class="search-container">
                                                <input type="text" class="node-search-input" data-index="${index}" placeholder="Search node...">
                                            </div>
                                            <select class="target-node-select" data-index="${index}">
                                                <option value="">-- Select node --</option>
                                                ${sortedTypes.map(type => `
                                                    <optgroup label="${type}">
                                                        ${nodesByType[type].map(node => {
                                                            const selected = mapping.suggestedTarget && mapping.suggestedTarget.id === node.id ? 'selected' : '';
                                                            return `<option value="${node.id}" data-type="${node.type}" ${selected}>${node.title}</option>`;
                                                        }).join('')}
                                                    </optgroup>
                                                `).join('')}
                                            </select>
                                        </div>
                                        ${isAutoMatched ? 
                                            `<div class="match-reason">${mapping.matchReason}</div>` : 
                                            '<div class="match-reason no-match">Node selection required</div>'}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            <div class="notes-modal-footer">
                <button id="import-selected-mappings-btn" class="notes-modal-btn">Import Selected (0)</button>
                <button id="cancel-import-mapping-btn" class="notes-modal-btn">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalContainer);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        #import-mappings-container {
            max-height: 60vh;
            overflow-y: auto;
        }
        
        .import-instructions {
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .import-select-all-container {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .small-btn {
            padding: 4px 8px;
            background-color: #555;
            border: none;
            border-radius: 3px;
            color: white;
            cursor: pointer;
            font-size: 12px;
        }
        
        .small-btn:hover {
            background-color: #666;
        }
        
        .import-mapping-item {
            margin-bottom: 15px;
            padding: 12px;
            border: 1px solid #444;
            border-radius: 4px;
            background-color: #333;
            display: flex;
            gap: 10px;
        }
        
        .import-mapping-item.has-match {
            border-left: 3px solid #4CAF50;
        }
        
        .import-mapping-item.no-match {
            border-left: 3px solid #FFC107;
        }
        
        .import-mapping-checkbox {
            display: flex;
            align-items: center;
            padding-top: 10px;
        }
        
        .import-mapping-content {
            flex-grow: 1;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .import-mapping-source {
            flex: 1;
        }
        
        .import-mapping-arrow {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 5px;
        }
        
        .match-icon {
            font-size: 14px;
            margin-bottom: 5px;
        }
        
        .arrow {
            font-size: 18px;
            color: #FF9800;
        }
        
        .import-mapping-target {
            flex: 1;
        }
        
        .import-mapping-preview {
            color: #aaa;
            font-size: 13px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 5px;
        }
        
        .select-with-search {
            position: relative;
            margin-bottom: 5px;
        }
        
        .search-container {
            margin-bottom: 5px;
        }
        
        .node-search-input {
            width: 100%;
            padding: 6px;
            background-color: #333;
            border: 1px solid #555;
            border-radius: 4px;
            color: white;
            font-size: 13px;
        }
        
        .target-node-select {
            width: 100%;
            padding: 8px;
            background-color: #444;
            border: 1px solid #555;
            border-radius: 4px;
            color: white;
        }
        
        .match-reason {
            font-size: 12px;
            color: #4CAF50;
        }
        
        .match-reason.no-match {
            color: #FFC107;
        }
        
        .notes-count {
            color: #FF9800;
            font-size: 13px;
            margin-left: 5px;
        }
        
        .option-highlighted {
            background-color: #FF9800;
            color: #000;
        }
    `;
    document.head.appendChild(style);
    
    // Event listeners
    document.querySelector('#notes-import-mapping-modal .notes-modal-close').addEventListener('click', function() {
        modalContainer.remove();
    });
    
    document.getElementById('cancel-import-mapping-btn').addEventListener('click', function() {
        modalContainer.remove();
    });
    
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    selectAllCheckbox.addEventListener('change', function() {
        const isChecked = this.checked;
        document.querySelectorAll('.mapping-checkbox').forEach(checkbox => {
            checkbox.checked = isChecked;
        });
        updateImportButtonLabel();
    });
    
    document.getElementById('apply-suggested-btn').addEventListener('click', function() {
        importMapping.mappings.forEach((mapping, index) => {
            const select = document.querySelector(`.target-node-select[data-index="${index}"]`);
            const checkbox = document.querySelector(`.mapping-checkbox[data-index="${index}"]`);
            
            if (mapping.suggestedTarget) {
                select.value = mapping.suggestedTarget.id;
                checkbox.checked = true;
                
                const mappingItem = document.querySelector(`.import-mapping-item[data-index="${index}"]`);
                mappingItem.classList.add('has-match');
                mappingItem.classList.remove('no-match');
                
                const matchIcon = mappingItem.querySelector('.match-icon');
                matchIcon.textContent = '✓';
                matchIcon.title = mapping.matchReason;
                
                const matchReason = mappingItem.querySelector('.match-reason');
                matchReason.textContent = mapping.matchReason;
                matchReason.classList.remove('no-match');
            }
        });
        
        updateImportButtonLabel();
    });
    
    // Search functionality
    document.querySelectorAll('.node-search-input').forEach(input => {
        input.addEventListener('input', function() {
            const index = this.dataset.index;
            const select = document.querySelector(`.target-node-select[data-index="${index}"]`);
            const searchTerm = this.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                resetSelectOptions(select);
            } else {
                filterSelectOptions(select, searchTerm, allNodes);
            }
        });
    });
    
    function resetSelectOptions(select) {
        const optgroups = select.querySelectorAll('optgroup');
        
        optgroups.forEach(group => {
            group.style.display = '';
            const options = group.querySelectorAll('option');
            options.forEach(option => {
                option.style.display = '';
                option.classList.remove('option-highlighted');
            });
        });
    }
    
    function filterSelectOptions(select, searchTerm, allNodes) {
        const optgroups = select.querySelectorAll('optgroup');
        
        // Hide all options first
        optgroups.forEach(group => {
            group.style.display = 'none';
            const options = group.querySelectorAll('option');
            options.forEach(option => {
                option.style.display = 'none';
                option.classList.remove('option-highlighted');
            });
        });
        
        // Find matching nodes
        const matchingNodes = allNodes.filter(node => 
            node.searchText.includes(searchTerm)
        );
        
        // Show matching options
        matchingNodes.forEach(node => {
            const option = select.querySelector(`option[value="${node.id}"]`);
            if (option) {
                option.style.display = '';
                if (node.title.toLowerCase().includes(searchTerm)) {
                    option.classList.add('option-highlighted');
                }
                
                const group = option.closest('optgroup');
                if (group) {
                    group.style.display = '';
                }
            }
        });
        
        // Auto-select single match
        if (matchingNodes.length === 1) {
            select.value = matchingNodes[0].id;
            
            const event = new Event('change');
            select.dispatchEvent(event);
        }
    }
    
    // Change handlers for dropdowns
    document.querySelectorAll('.target-node-select').forEach(select => {
        select.addEventListener('change', function() {
            const index = this.dataset.index;
            const mappingItem = document.querySelector(`.import-mapping-item[data-index="${index}"]`);
            const checkbox = document.querySelector(`.mapping-checkbox[data-index="${index}"]`);
            const matchIcon = mappingItem.querySelector('.match-icon');
            const matchReason = mappingItem.querySelector('.match-reason');
            
            if (this.value) {
                mappingItem.classList.add('has-match');
                mappingItem.classList.remove('no-match');
                matchIcon.textContent = '✓';
                matchIcon.title = 'Selected manually';
                matchReason.textContent = 'Selected manually';
                matchReason.classList.remove('no-match');
                checkbox.checked = true;
            } else {
                mappingItem.classList.remove('has-match');
                mappingItem.classList.add('no-match');
                matchIcon.textContent = '❓';
                matchIcon.title = 'No automatic match';
                matchReason.textContent = 'Node selection required';
                matchReason.classList.add('no-match');
                checkbox.checked = false;
            }
            
            updateImportButtonLabel();
        });
    });
    
    // Checkbox handlers
    document.querySelectorAll('.mapping-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateImportButtonLabel();
            
            const allChecked = Array.from(document.querySelectorAll('.mapping-checkbox')).every(cb => cb.checked);
            selectAllCheckbox.checked = allChecked;
        });
    });
    
    function updateImportButtonLabel() {
        const checkedCount = document.querySelectorAll('.mapping-checkbox:checked').length;
        const importButton = document.getElementById('import-selected-mappings-btn');
        importButton.textContent = `Import Selected (${checkedCount})`;
        importButton.disabled = checkedCount === 0;
    }
    
    updateImportButtonLabel();
    
    // Import button action
    document.getElementById('import-selected-mappings-btn').addEventListener('click', function() {
        const selectedMappings = [];
        
        document.querySelectorAll('.mapping-checkbox:checked').forEach(checkbox => {
            const index = parseInt(checkbox.dataset.index);
            const select = document.querySelector(`.target-node-select[data-index="${index}"]`);
            const targetNodeId = select.value;
            
            if (targetNodeId && index < importMapping.mappings.length) {
                selectedMappings.push({
                    mapping: importMapping.mappings[index],
                    targetNodeId: targetNodeId
                });
            }
        });
        
        if (selectedMappings.length > 0) {
            let importCount = 0;
            
            selectedMappings.forEach(item => {
                const targetNodeId = item.targetNodeId;
                const notes = item.mapping.notes;
                const targetNode = importMapping.existingNodes[targetNodeId].node;
                
                if (targetNode) {
                    targetNode.notes = targetNode.notes || [];
                    
                    const notesToImport = notes.filter(note => 
                        typeof note === 'object' && note !== null && note.text);
                    
                    if (targetNode.title) {
                        notesToImport.forEach(note => {
                            note.nodeTitle = targetNode.title;
                        });
                    }
                    
                    targetNode.notes = [...targetNode.notes, ...notesToImport];
                    nodeNotes[targetNodeId] = [...targetNode.notes];
                    
                    targetNode.flags = targetNode.flags || {};
                    targetNode.flags.hasNotes = true;
                    
                    importCount++;
                }
            });
            
            modalContainer.remove();
            app.graph.setDirtyCanvas(true);
            
            const totalImportCount = importCount;
            if (totalImportCount > 0) {
                alert(`Successfully imported notes for ${totalImportCount} nodes.`);
                openGlobalNotesPanel();
                
                if (app.graph) {
                    app.graph.change();
                }
            } else {
                alert("No notes were imported.");
            }
        } else {
            alert("No nodes selected for importing notes.");
        }
    });
}
  