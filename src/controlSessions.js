import { 
    saveCurrent,
    generateUniqueId,
    getDetailedDisplayId,
    deleteDetailedDisplaySession,
    getDateFromId
} from './sessions.js';

import { openSessionGivenId } from './open.js';


// Button to save current session
export const saveControl = ()  => {
    const saveButton = document.createElement("button");
    saveButton.id = "save";
    saveButton.innerHTML = "SAVE";
    saveButton.className = "controls";
    document.getElementById("controls").appendChild(saveButton);

    // Each session is saved with a unique string identifier
    // of its date in milliseconds
    saveButton.addEventListener("click", async function() {
        const uniqueSessionId = generateUniqueId();
        const saveTime = getDateFromId(uniqueSessionId);
        saveCurrent(uniqueSessionId, saveTime);

        window.location.reload();
    });
}

// Button to clear all saved sessions
export const clearControl = () => {
    const clearButton = document.createElement("button");
    clearButton.id = "clear";
    clearButton.innerHTML = "CLEAR";
    clearButton.className = "controls";
    document.getElementById("controls").appendChild(clearButton);

    // Clear chrome local storage on press
    clearButton.addEventListener("click", function() {
        chrome.storage.local.clear();
        window.location.reload();
    });
}

// Button to open the selected saved session
export const openControl = () => {
    const openButton = document.createElement("button");
    openButton.id = "open";
    openButton.innerHTML = "OPEN";
    openButton.className = "controls";
    document.getElementById("controls").appendChild(openButton);

    openButton.addEventListener("click", async function() {
        const sessionId = getDetailedDisplayId();
        openSessionGivenId(sessionId);
    });
}

// Button to delete selected saved session
export const deleteControl = () => {
    const deleteButton = document.createElement("button");
    deleteButton.id = "delete";
    deleteButton.innerHTML = "DELETE";
    deleteButton.className = "controls";
    document.getElementById("controls").appendChild(deleteButton);

    deleteButton.addEventListener("click", async function() {
        deleteDetailedDisplaySession();
        window.location.reload();
    });
}