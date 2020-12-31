import { 
    saveControl, 
    clearControl, 
    openControl, 
    deleteControl 
} from './controlSessions.js';

import { 
    displayAllSavedSessions,
    displayMostRecentSessionInDetail,
    displayMostRecentClickedSessionInDetail
} from './display.js';


displayAllSavedSessions();
// displayMostRecentSessionInDetail();
displayMostRecentClickedSessionInDetail();
saveControl();
clearControl();
openControl();
deleteControl();