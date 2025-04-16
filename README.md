# ComfyUI Note Manager
A powerful extension for ComfyUI that enables adding notes to many node in your workflow. Keep track of important settings, reminders, and workflow documentation directly within your ComfyUI canvas.

## Features
-   📝 **Add/Edit/View Notes:** Easily add, modify, and view multiple timestamped notes for many node.
-   🔢 **Note Count Indicator:** Shows a clear icon with the note count on nodes that contain notes (when not collapsed).
-   💾 **Auto-Saves with Workflow:** Notes are saved directly within your workflow JSON file.
-   🎨 **Modern UI:** Clean modal windows for managing notes per node.
-   📤 **Node-Specific Import/Export:** Share or back up notes for individual nodes using JSON format. 
-   🔍 **Selective Export:** Choose specific notes to include when exporting from a node.
-   📋 **Global Notes Panel:** View, search, and manage notes from *all* nodes in a dedicated, toggleable side panel.
-   🖱️ **Draggable Panel Toggle:** A floating `📋` icon lets you toggle the Global Notes Panel and can be dragged anywhere on the screen.
-   ✈️ **Jump to Node:** Quickly navigate to a node in your workflow by clicking its title in the Global Notes Panel. 
-   🌍 **Global Import/Export:** Manage notes for the *entire* workflow, including an intelligent import mapping feature. 
-   🧩 **Broad Compatibility:** Designed to work with many types of ComfyUI nodes.
## Installation

Manually:

Clone this repo to ComfyUI/custom_nodes

## Usage

### Basic Note Management

1.  **Add a note to a node**:
    * Right-click on any node and select "📝 Add Note" from the context menu.
    * Enter your note in the modal window and click "Save". 
2.  **View notes on a node**:
    * Right-click on a node with notes and select "📑 View Notes (`N`)" from the context menu (where `N` is the note count). 
3.  **Edit or delete notes**:
    * In the notes modal, use the ✏️ button to edit a note. 
    * Use the 🗑️ button to delete a note. 
4.  **Identify nodes with notes**:
    * Nodes with notes display an orange circle with the number of notes above the title (when not collapsed).

### Global Notes Panel

1.  **Access the global notes panel**:
    * Click the draggable `📋` icon on the screen to toggle the panel.
    * All notes from your workflow are displayed, organized by node.
2.  **Quick navigation**:
    * Click on a node name in the global panel to center the canvas on that node.
3.  **Manage & Search**:
    * Use the search bar to filter notes across the entire workflow.
    * Edit/Delete notes directly from the panel list.
    * Use the global Import/Export buttons for workflow-wide note management.

### Import and Export

1.  **Export notes**:
    * **Node Specific:** Open the notes modal for a node, click "Import/Export", choose "Export Node Notes", select notes via checkboxes, and click "Export Selected". 
    * **Global:** Open the Global Notes Panel and click the "Export" button
2.  **Import notes**:
    * **Node Specific:** Open the notes modal for the target node, click "Import/Export", choose "Import Node Notes", and select the JSON file. 
    * **Global:** Open the Global Notes Panel, click the "Import" button, select the JSON file, and use the mapping dialog to assign notes to the correct nodes before confirming.

## Tips and Tricks
-   **Updating notes**: When adding or editing notes, or when you open a new workflow tab, you need to refresh the manager using the 🔄 button next to the note search field; otherwise, you may experience a synchronization issue.
-   **Workflow Documentation**: Use notes on key nodes (like Loaders, Checkpoints, Samplers) to explain their role or settings. 
-   **Parameter Tracking**: Note down specific seeds, CFG scales, or prompt keywords that produced interesting results.
-   **Troubleshooting**: Document errors encountered or specific settings needed to make a custom node work correctly.
-   **Idea Repository**: Jot down ideas for workflow improvements or variations directly on the relevant nodes.
-   **Global Overview**: Use the global panel to quickly review all annotations in a complex workflow. 

## Screenshots
![General](https://github.com/user-attachments/assets/a93a2882-b01e-44df-b2d1-88678cf58191)

### Context menu
![menu](https://github.com/user-attachments/assets/51fa5b1e-ae8d-4fb8-86b3-f9b9637dd9cb)

### Note Modal Window
![window](https://github.com/user-attachments/assets/5b3f7113-036b-4f11-8498-8533ee6bddc8)

### Global Import Mapping Dialog
![import](https://github.com/user-attachments/assets/78422fdf-39b8-40c3-bcb7-63644804069a)
Here are the 5 options:
-   🔴 Node selection required – You must manually select the node to which the note should be added.
-   🟡 Title match – Matches the node's name, but not its ID.
-   🟡 ID match – Use this if you renamed the node to which you want to attach the note and are absolutely sure of your actions.
-   🟢 Full match (ID and title) – The best option for loading; it ensures a 100% match.
-   ⚪ Selected manually – The node is selected manually.

### Export Selection
![export](https://github.com/user-attachments/assets/c133553f-ff44-4879-af3f-84c0642b8f0d)








