import { getSessionFromId } from './sessions.js';

// Gets a list of all the tabs from a window
const getListOfWindowURLs = (window) => {
    const tabsList = [];

    for (let tab in window.tabs) {
        tabsList.push(window.tabs[tab].url);
    }

    return tabsList;
}

// Open the session given a session object
export const openSessionGivenSession = (session) => {
    // Last element in session contains the metadata for that session
    // ignore it in creating windows
    for (let window in session.slice(0,-1)) {
        const tabsList = getListOfWindowURLs(session[window]);
        
        chrome.windows.create({ url: tabsList });
    } 
}

// Open the session given a session id
export const openSessionGivenId = async (sessionId) => {
    const session = await getSessionFromId(sessionId);
    openSessionGivenSession(session);
}


// Open a specific tab
export const openTab = (url) => {
    chrome.windows.create({ url: url });
}


// Open a window and its tabs
export const openWindow = (window) => {
    const tabsList = getListOfWindowURLs(window);
    chrome.windows.create({ url: tabsList })
}