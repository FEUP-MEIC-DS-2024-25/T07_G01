import { useState } from "react";
import * as icons from './icons.js';

function Sidebar() {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    const toggleSidebar = () => {
        setSidebarExpanded(prev => !prev);
    };

    return (<div className={`sidebar ${sidebarExpanded ? 'expanded' : ''}`} id="sidebar">
        <div className="expand-container">
            <button className="toggle-btn" onClick={toggleSidebar}>
                <img src={sidebarExpanded ? icons.left_arrow : icons.right_arrow} alt="Toggle Sidebar" className="collapsed-icon" />
            </button>
        </div>
        <div className="new-chat-container">
            <button className="toggle-btn">
                <img src={sidebarExpanded ? icons.new_chat : icons.add_circle} alt="New Chat" className={sidebarExpanded ? "new-chat-expanded" : "new-chat-collapsed"} />
            </button>
        </div>
        <div className="help-container">
            <button className="toggle-btn">
                <img src={icons.help_circle} alt="Help" className="help" />
            </button>
            {sidebarExpanded && <p className="help-description">Help</p>}
        </div>
        <div className="settings-container">
            <button className="toggle-btn">
                <img src={icons.settings} alt="Settings" className="settings" />
            </button>
            {sidebarExpanded && <p className="settings-description">Settings</p>}
        </div>
    </div>
    );
}

export default Sidebar;