import { 
    getSessionFromId,
    getAllSaved, 
    saveRecentlyClickedSavedSessionId,
    getRecentlyClickedSavedSessionId,
    saveMetadataGivenSessionAndId
} from './sessions.js';

import { 
    openTab,
    openWindow
} from './open.js';


// Clear the detailed session display
const clearDetailedDisplay = () => {
    document.getElementById("sessionContainer").innerHTML = "";
}

// Unhighlight savedSession buttons
const unhighlightAllSavedSessionButtons = () => {
    const allSavedSessionsButtons = document.getElementsByClassName("savedSession");

    for (let i in allSavedSessionsButtons) {
        if (allSavedSessionsButtons[i].className == "savedSession savedSessionSelected") {
            allSavedSessionsButtons[i].className = "savedSession savedSessionNotSelected";
        }
    }
}

// Unhighlight a specific savedSession button
const unhighlightSavedSessionButton = (id) => {
    const savedSession = document.getElementById(id);

    if (savedSession != null) {
        savedSession.className = "savedSession savedSessionNotSelected";
    }
}

// Highlight a specific savedSession button
const highlightSavedSessionButton = (id) => {
    const savedSession = document.getElementById(id);

    if (savedSession != null) {
        savedSession.className = "savedSession savedSessionSelected";
    }
}


// Display the most recently saved session in detail
export async function displayMostRecentSessionInDetail() {
    const allSessions = await getAllSaved();

    // Last session saved is the most recently saved session
    for (var sessionId in allSessions);
    displaySessionInDetail(allSessions[sessionId], sessionId);

    // Highlight the session when its displayed in detail
    highlightSavedSessionButton(sessionId);
}

// Display the most recently clicked saved session in detail
export async function displayMostRecentClickedSessionInDetail() {
    const sessionId = await getRecentlyClickedSavedSessionId();
    const recentlyClickedSession = await getSessionFromId(sessionId);

    if (recentlyClickedSession != null) {
        displaySessionInDetail(recentlyClickedSession, sessionId);
    }

    // Highlight the session when its displayed in detail
    highlightSavedSessionButton(sessionId);
}


// Detailed display of the selected session (all windows and its tabs)
function displaySessionInDetail(session, sessionId) {
    // Only show one detailed display at a time
    clearDetailedDisplay();

    // Make the class of sessionContainer the id of the session
    const sessionContainer = document.getElementById("sessionContainer");
    sessionContainer.className = sessionId;

    // Show every window and its tabs in detailed view
    // Check if its the metadata of the session; if so, ignore it
    for (let window in session.slice(0,-1)) {
        const windowTabs = session[window].tabs;
        const numberOfTabs = windowTabs.length;
    
        // Window Container (holds the window text and tab container)
        const windowContainer = document.createElement("div");
        sessionContainer.appendChild(windowContainer);
        windowContainer.className = "windowContainer";
        
            
        // Window text
        const windowTitle = document.createElement("button");
        windowContainer.appendChild(windowTitle);
        windowTitle.className = "windowTitle";
        windowTitle.innerHTML = "Window - " + numberOfTabs + " Tab";
        if (numberOfTabs > 1) {
            windowTitle.innerHTML += "s";
        }
        
    
        // Click each window to open the window with its displayed tabs
        windowTitle.addEventListener("click", function() {
            openWindow(session[window]);
        });
    
        // Tab Container (holds the list of all tabs in that window)
        const tabsContainer = document.createElement("div");
        tabsContainer.className = "tabsContainer";
        windowContainer.appendChild(tabsContainer);
    
        // Display each tab (each of this holds an individual tab)
        for (let tabIndex = 0; tabIndex < numberOfTabs; tabIndex++) {
            const tab = windowTabs[tabIndex];
    
            const tabLink = document.createElement("button");
            tabLink.className = "tabLink";
            tabLink.title = tab.url;
            tabLink.innerHTML = tab.title;
    
            tabsContainer.appendChild(tabLink);
    
            // Click each tab to open its url
            tabLink.addEventListener("click", function() {
                openTab(tab.url);
            });
        }

    }
}


// Display all saved sessions
export async function displayAllSavedSessions() {
    const allSessions = await getAllSaved();

    for (let sessionId in allSessions) {
        const session = allSessions[sessionId];

        if (Array.isArray(session)) {
            const savedSession = document.createElement("button");
            document.getElementById("savedSessionsContainer").appendChild(savedSession);
            savedSession.className = "savedSession savedSessionNotSelected";
            savedSession.id = sessionId;

            // Default name is the metadata of saved time
            // Last "window" (metadata) of the session
            savedSession.innerHTML = session[session.length - 1]["name"];

            // Display in detail when pressed
            savedSession.addEventListener("click", function() {
                displaySessionInDetail(session, sessionId);

                // Make sure only the selected button is highlighted
                unhighlightAllSavedSessionButtons();
                savedSession.className = "savedSession savedSessionSelected";
                
                saveRecentlyClickedSavedSessionId(sessionId);
            });

            // Change the display name of the session (default is time in locale format)
            savedSession.addEventListener("dblclick", async function() {
                const newName = prompt("New Name", savedSession.innerHTML);

                // If user did not cancel and did not put empty string
                // Then, change to new name
                if (newName != null && newName != "") {
                    savedSession.innerHTML = newName;
                    saveMetadataGivenSessionAndId(sessionId, session, "name", newName);
                }
            });

        }
    }

}