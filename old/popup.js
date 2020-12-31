function updateControl() {
    let updateButton = document.createElement("button");
    updateButton.className = "update";
    updateButton.id = "update";
    updateButton.innerHTML = "UPDATE NOW";
    document.getElementById("controls").appendChild(updateButton);
    document.getElementById("update").addEventListener('click', function() {
        // window.location.reload();
        displaySaved();
    });
}

function saveControl() {
    let saveButton = document.createElement("button");
    saveButton.className = "save";
    saveButton.id = "save";
    saveButton.innerHTML = "SAVE SESSION";
    document.getElementById("controls").appendChild(saveButton);
    document.getElementById("save").addEventListener('click', async function() {
        let session = await getCurrentSession();
        let a = [];
        a.push(session);
        saveSession(session);
        displaySaved();
    });
}

async function displaySession() {
    let session = await loadSession();

    // For each window in the session
    for (let winIndex in session) {       
        let windowTabs = session[winIndex].tabs;
        let numberOfTabs = windowTabs.length;

        // Window Container (holds the window and the tab container)
        let windowContainer = document.createElement("div");
        windowContainer.className = "windowContainer";
        document.getElementById("displayedSession").appendChild(windowContainer);

        // Window text
        let windowTitle = document.createElement("p");
        windowTitle.className = "windowTitle";
        windowTitle.innerHTML = "Window";
        windowContainer.appendChild(windowTitle);

        // Tab Container (holds the list of all tabs in that window)
        let tabsContainer = document.createElement("div");
        tabsContainer.className = "tabsContainer";
        windowContainer.appendChild(tabsContainer);

        // Tab (each of this holds an individual tab)
        for (let tabIndex = 0; tabIndex < numberOfTabs; tabIndex++) {
            let tab = windowTabs[tabIndex];

            let tabLink = document.createElement("button");
            tabLink.className = "tabLink";
            tabLink.title = tab.title;

            tabLink.innerHTML = tab.title;
            tabsContainer.appendChild(tabLink);
        }
    }
}

async function displaySaved() {
    let saved = await getSavedSession();

    for (let s in saved) {
        let savedContainer = document.createElement("div");
        savedContainer.className = "savedContainer";
        savedContainer.innerHTML = saved[s].tabs[0].title;
        document.getElementById("saved").appendChild(savedContainer);
    }
}

function getCurrentSession() {
    return new Promise(resolve => {
        chrome.windows.getAll({ populate: true }, function(data) {
            resolve(data);
        })
    });
}

function saveSession(session) {
    chrome.storage.local.set({ "session": session });
}

function getSavedSession() {
    return new Promise(resolve => {
        chrome.storage.local.get("session", function(data) {
            resolve(data.session);
        })
    });
}

function loadSession() {
    return new Promise(resolve => {
        chrome.storage.local.get("session", function(data) {
            resolve(data.session);
        })
    });
}

saveControl();
updateControl();

displaySaved();
