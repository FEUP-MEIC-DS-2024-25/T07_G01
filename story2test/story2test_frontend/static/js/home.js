function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('expanded');

    const collapsedIcon = document.querySelector('.collapsed-icon');
    const expandedIcon = document.querySelector('.expanded-icon');
    const settingsWord = document.querySelector('.settings-description');
    const helpWord = document.querySelector('.help-description');
    const newChatCollapsed = document.querySelector('.new-chat-collapsed');
    const newChatExpanded = document.querySelector('.new-chat-expanded');

    if (collapsedIcon.style.display === 'none') {
        collapsedIcon.style.display = 'block';
        expandedIcon.style.display = 'none';
        settingsWord.style.display = 'none';
        helpWord.style.display = 'none';
        newChatCollapsed.style.display = 'block';
        newChatExpanded.style.display = 'none';
    } else {
        collapsedIcon.style.display = 'none';
        expandedIcon.style.display = 'block';
        settingsWord.style.display = 'block';
        helpWord.style.display = 'block';
        newChatCollapsed.style.display = 'none';
        newChatExpanded.style.display = 'block';
    }
}

async function sendToBackend() {
    const userInput = document.getElementById("user_story_input").value;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    const response = await fetch("/api/gemini/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken
        },
        body: JSON.stringify({user_story: userInput})
    });

    const data = await response.json();
    alert(`Resposta do Gemini: ${data.message}`);
}