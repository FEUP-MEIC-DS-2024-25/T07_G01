function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('expanded');

    const collapsedIcon = document.querySelector('.collapsed-icon');
    const expandedIcon = document.querySelector('.expanded-icon');
    const settingsWord = document.querySelector('.settings-description');
    const helpWord = document.querySelector('.help-description');
    const newChatCollapsed = document.querySelector('.new-chat-collapsed');
    const newChatExpanded = document.querySelector('.new-chat-expanded');
    const chatHistory = document.querySelector('.chat-history-container');

    if (collapsedIcon.style.display === 'none') {
        collapsedIcon.style.display = 'block';
        expandedIcon.style.display = 'none';
        settingsWord.style.display = 'none';
        helpWord.style.display = 'none';
        newChatCollapsed.style.display = 'block';
        newChatExpanded.style.display = 'none';
        chatHistory.style.display = 'none';
    } else {
        collapsedIcon.style.display = 'none';
        expandedIcon.style.display = 'block';
        settingsWord.style.display = 'block';
        helpWord.style.display = 'block';
        newChatCollapsed.style.display = 'none';
        newChatExpanded.style.display = 'block';
        chatHistory.style.display = 'block';
    }
}

function toggleThreePrompts() {

}

function uploadFile() {
    var input = document.createElement('input');
    input.type = 'file';
    input.click();
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        sendToBackend();
    }
}

async function loadPreviousMessages(conversationId) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
    const chatSection = document.getElementById("chat-section");

    // Clear the chat section to avoid duplication when reloading
    chatSection.innerHTML = "";

    // Fetch previous messages from the backend
    try {
        const response = await fetch(`/api/conversations/${conversationId}/messages/`, {
            method: "GET",
            headers: {
                "X-CSRFToken": csrfToken
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching previous messages: ' + response.statusText);
        }

        const data = await response.json();

        if (data.messages.length > 0) {
            const contentHeader = document.querySelector(".content-header");
            contentHeader.style.display = "none";
        }

        // Loop through the messages and render each one
        data.messages.forEach(message => {
            const messageContainer = document.createElement("div");
            messageContainer.classList.add("chat-message", message.is_user ? "user-message" : "gemini-message-container");

            if (message.is_user) {
                const userMessage = document.createElement("div");
                userMessage.classList.add("chat-message", "user-message");
                userMessage.innerText = message.text;
                messageContainer.appendChild(userMessage);
            } else {
                const geminiMessageContainer = document.createElement("div");
                geminiMessageContainer.classList.add("gemini-message-container");

                const robotImage = document.createElement("div");
                robotImage.classList.add("robot-image");
                robotImage.innerHTML = `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14 2C14 2.74028 13.5978 3.38663 13 3.73244V4H20C21.6569 4 23 5.34315 23 7V19C23 20.6569 21.6569 22 20 22H4C2.34315 22 1 20.6569 1 19V7C1 5.34315 2.34315 4 4 4H11V3.73244C10.4022 3.38663 10 2.74028 10 2C10 0.895431 10.8954 0 12 0C13.1046 0 14 0.895431 14 2ZM4 6H11H13H20C20.5523 6 21 6.44772 21 7V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V7C3 6.44772 3.44772 6 4 6ZM15 11.5C15 10.6716 15.6716 10 16.5 10C17.3284 10 18 10.6716 18 11.5C18 12.3284 17.3284 13 16.5 13C15.6716 13 15 12.3284 15 11.5ZM16.5 8C14.567 8 13 9.567 13 11.5C13 13.433 14.567 15 16.5 15C18.433 15 20 13.433 20 11.5C20 9.567 18.433 8 16.5 8ZM7.5 10C6.67157 10 6 10.6716 6 11.5C6 12.3284 6.67157 13 7.5 13C8.32843 13 9 12.3284 9 11.5C9 10.6716 8.32843 10 7.5 10ZM4 11.5C4 9.567 5.567 8 7.5 8C9.433 8 11 9.567 11 11.5C11 13.433 9.433 15 7.5 15C5.567 15 4 13.433 4 11.5ZM10.8944 16.5528C10.6474 16.0588 10.0468 15.8586 9.55279 16.1056C9.05881 16.3526 8.85858 16.9532 9.10557 17.4472C9.68052 18.5971 10.9822 19 12 19C13.0178 19 14.3195 18.5971 14.8944 17.4472C15.1414 16.9532 14.9412 16.3526 14.4472 16.1056C13.9532 15.8586 13.3526 16.0588 13.1056 16.5528C13.0139 16.7362 12.6488 17 12 17C11.3512 17 10.9861 16.7362 10.8944 16.5528Z" fill="#000000"/>
        </svg>`;

                const geminiMessage = document.createElement("div");
                geminiMessage.classList.add("gemini-message");

                const parsedMessage = marked.parse(message.text);
                geminiMessage.innerHTML = parsedMessage;

                geminiMessageContainer.appendChild(robotImage);
                geminiMessageContainer.appendChild(geminiMessage);
                messageContainer.appendChild(geminiMessageContainer);
            }

            // Append the message container to the chat section
            chatSection.appendChild(messageContainer);
        });

        // Scroll to the bottom of the chat section
        chatSection.scrollTop = chatSection.scrollHeight;

    } catch (error) {
        console.error('Error:', error);
    }
}

async function sendToBackend() {
    const conversationId = document.getElementById("conversation_id").value;
    const userInput = document.getElementById("user_story_input").value;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
    const chatSection = document.getElementById("chat-section");
    const contentHeader = document.querySelector('.content-header');

    const userMessage = document.createElement("div");
    userMessage.classList.add("chat-message", "user-message");
    userMessage.innerText = `${userInput}`;
    chatSection.appendChild(userMessage);
    chatSection.scrollTop = chatSection.scrollHeight;
    document.getElementById("user_story_input").value = "";

    if (chatSection.classList.contains("hidden")) {
        contentHeader.classList.add('hidden');
        chatSection.classList.remove('hidden');
    }

    const geminiMessageContainer = document.createElement("div");
    geminiMessageContainer.classList.add("chat-message", "gemini-message-container");

    const robotImage = document.createElement("div");
    robotImage.classList.add("robot-image");
    robotImage.innerHTML = `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> ... </svg>`;

    const geminiMessage = document.createElement("div");
    geminiMessage.classList.add("gemini-message");

    geminiMessageContainer.appendChild(geminiMessage);
    chatSection.appendChild(geminiMessageContainer);
    chatSection.appendChild(robotImage);

    try {
        const response = await fetch(`/api/gemini/${conversationId}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            body: JSON.stringify({ user_story: userInput })
        });

        if (!response.ok) {
            throw new Error('Server error: ' + response.statusText);
        }

        const data = await response.json();

        const renderer = new marked.Renderer();
        renderer.code = (code, language) => {
            const langClass = language ? `language-${language}` : '';
            return `<pre><code class="${langClass}">${code.text}</code></pre>`;
        };
        const parsedMessage = marked.parse(data.message, { renderer });

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = parsedMessage;

        async function typeMessage(element, parentElement, delay = 2) {
            for (let child of element.childNodes) {
                if (child.nodeType === Node.ELEMENT_NODE) {
                    const clonedElement = child.cloneNode(false);
                    parentElement.appendChild(clonedElement);
                    await typeMessage(child, clonedElement, delay);
                } else if (child.nodeType === Node.TEXT_NODE) {
                    const textContent = child.textContent;
                    let index = 0;

                    while (index < textContent.length) {
                        parentElement.appendChild(document.createTextNode(textContent.charAt(index)));
                        index++;
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
                chatSection.scrollTop = chatSection.scrollHeight;
            }
        }

        await typeMessage(tempDiv, geminiMessage);

    } catch (error) {
        document.getElementById("user_story_input").value = "";

        console.error('Error:', error);

        geminiMessage.innerText = 'An error occurred: ' + error.message;
        geminiMessage.classList.add("error-message");

        chatSection.scrollTop = chatSection.scrollHeight;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const conversationId = document.getElementById("conversation_id").value;
    if (conversationId) {
        loadPreviousMessages(conversationId);
    }
});