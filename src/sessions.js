/**
 * DATA STRUCTURE
 * 
 * Each Session is an array of 2 dimensional objects
 * 
 * Session1:
 * [
 * window0: { windowData: values, ... , tabs: { tabData: values, ... , url: <URL> } }
 *  ...
 * windowN: { windowData: values, ... , tabs: { tabData: values, ... , url: <URL> } }
 * metadata: { name: <name>, ... }
 * ]
 * 
 * 
 * Chrome storage save object
 * An object of all sessions and some metadata for user interface
 * 
 * Save Object:
 * {
 * sessionId1: Session1
 *  ...
 * sessionIdN: SessionN
 *  ... 
 *  <Metadata>
 * "recentlyClickedSavedSession": <recentlyClickedSessionId>
 * }
 */

// Each session has a unique id for chrome to reserve it for storage
export const generateUniqueId = () => {
    /**
     * Unique ID is [ID.float]:
     * [Date in integer milliseconds] + [Float randomness to guarantee uniqueness] 
     *
     * Uses date to as a metadata of when session was saved and
     * to make ensure each id is unique
     */

    const uniqueSessionId = Date.now() + Math.random();
    return uniqueSessionId;
}

// Turn ID into metadata (when user saved the session)
export const getDateFromId = (id) => {
    const dateInMillisecs = Math.trunc(id);
    const date = new Date(dateInMillisecs);

    return date.toLocaleString();
}


// Get the session from its id
export const getSessionFromId = async (id) => {
    const allSessions = await getAllSaved();

    for (let sessionId in allSessions) {
        if (sessionId == id) {
            return allSessions[sessionId];
        }
    }
}


// Get current session
export const getCurrentSession = () => {
    return new Promise(resolve => {
        chrome.windows.getAll({ populate: true }, function(data) {
            resolve(data);
        })
    });
}


// Save new metadata given session id
export const saveMetadataGivenId = async (id, metadataCategory, newMetadata) => {
    const session = await getSessionFromId(id);
    session[session.length - 1][metadataCategory] = newMetadata;
    
    saveSession(id, session);
}

// Save new metadata given a session object
export const saveMetadataGivenSessionAndId = async (id, session, metadataCategory, newMetadata) => {
    session[session.length - 1][metadataCategory] = newMetadata;

    saveSession(id, session);
}

// Save a session object (replaces old session if there is existing id)
export const saveSession = async (id, toBeSavedSssion) => {
    const session = {};
    session[id] = toBeSavedSssion;

    chrome.storage.local.set(session);
}


// Save current session with an id for retrieval
export const saveCurrent = async (id, name) => {
    const session = {};
    const metadata = {};

    // Save metadata along with the actual session
    metadata["name"] = name;
    
    session[id] = await getCurrentSession();
    session[id].push(metadata);

    chrome.storage.local.set(session);
}

// Get a saved session from a session ID
export const getSaved = (id) => {
    return new Promise(resolve => {
        chrome.storage.local.get(id, function(savedSessions) {
            resolve(savedSessions);
        })
    });
}

// Get all saved sessions
export const getAllSaved = () => {
    return new Promise(resolve => {
        chrome.storage.local.get(null, function(savedSessions) {
            resolve(savedSessions);
        })
    });
}


// Save which saved session was most recently clicked
export const saveRecentlyClickedSavedSessionId = (id) => {
    chrome.storage.local.set({ "recentlyClickedSavedSession": id });
}

// Get which saved session was most recently clicked
export const getRecentlyClickedSavedSessionId = () => {
    return new Promise(resolve => {
        chrome.storage.local.get("recentlyClickedSavedSession", function(savedData) {
            resolve(savedData["recentlyClickedSavedSession"]);
        })
    });
}


// Get the ID of the session displayed in detail
export const getDetailedDisplayId = () => {
    return document.getElementById("sessionContainer").className;
}


// Delete a session from storage given id
export const deleteSessionById = (id) => {
    chrome.storage.local.remove(id);
}

// Delete the session displayed in detail
export const deleteDetailedDisplaySession = () => {
    const sessionId = getDetailedDisplayId();
    deleteSessionById(sessionId);
}