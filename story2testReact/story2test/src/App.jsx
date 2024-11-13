import { useState, useEffect, useRef } from 'react';
import './App.css';
import * as icons from './icons.js';

function App() {
  const [userStory, setUserStory] = useState('');
  const [messages, setMessages] = useState([]);
  const chatSectionRef = useRef(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toggleThreePrompts = () => {
    console.log("Toggle three prompts");
  };

  const toggleSidebar = () => {
    setSidebarExpanded(prev => !prev);
  };

  const checkEnter = (event) => {
    if (event.key === 'Enter') {
      sendToBackend();
    }
  };

  const uploadFile = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.click();
  };

  const sendToBackend = async () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', content: userStory }
    ]);

    setUserStory('');
    setIsTyping(true);

    try {
      /*const response = await fetch('http://127.0.0.1:8000/api/gemini/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_story: userStory })
      });

      if (!response.ok) {
        throw new Error('Server error: ' + response.statusText);
      }*/

      const response = {
        message: "Resposta teste do Gemini. Por favor diz-me que não está desformatada. Preparação \n Passo 1 \n Pré-aqueça o forno a 220 ºC. \n Passo 2 \n Corte as batatas em cubos e frite-as em azeite. \n Passo 3 \n Coloque o bacalhau num tacho com uma folha de louro e cubra-o com água. Leve-o a cozinhar em lume alto e quando levantar fervura baixe o lume e cozinhe durante 5 minutos. \n Passo 4 \n Retire o bacalhau da água e deixe arrefecer. Remova a pele e as espinhas e desfie-o em lascas. Reserve a água da cozedura para depois. \n Passo 5 \n Derreta 40 g de manteiga num tacho. Adicione 40 g de farinha e mexa de imediato. Sem parar de mexer, junte a água de cozedura do bacalhau, 2,5 dl de leite e 2,5 dl de natas. Tempere com sal, pimenta e noz-moscada. \n Passo 6 \n Quando o molho béchamel tiver engrossado e começar a ferver, retire do lume. \n Passo 7 \n Noutro tacho, coloque 100 ml de azeite e deixe refogar as cebolas, o alho picado e a folha de louro. Adicione o bacalhau, mexa e deixe refogar um pouco. \n Passo 8 \n Junte as batatas e envolva bem. Depois, acrescente 2/3 do molho béchamel. Torne a envolver, retire do lume e reserve. \n Passo 9 \n Pincele um tabuleiro de forno com um fio de azeite. Espalhe bem o preparado de bacalhau no tabuleiro, cubra-o com o resto do molho béchamel e polvilhe com o queijo mozzarella ralado Pingo Doce . \n Passo 10 \n Leve o bacalhau com natas ao forno durante 20 minutos para gratinar."
      }

      const data = /*await*/ response/*.json()*/;
      const parsedMessage = data.message;

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'gemini', content: parsedMessage }
      ]);

    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'error', content: 'An error occurred: ' + error.message }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    if (chatSectionRef.current) {
      chatSectionRef.current.scrollTop = chatSectionRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="app">
      <div className={`sidebar ${sidebarExpanded ? 'expanded' : ''}`} id="sidebar">
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
      <div className='content'>
        <div className={messages.length != 0 ? "conteng-header hidden" : "content-header"}>
          <h1 className="title">Story2Test</h1>
          <p className="subtitle">Turning user stories into testable realities</p>
        </div>
        {messages.length != 0 && <div className="chat-section" id="chat-section" ref={chatSectionRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.type === 'user' ? 'user-message' : msg.type === 'error' ? 'error-message' : 'gemini-message'}`}
              dangerouslySetInnerHTML={{ __html: msg.content }}
            />
          ))}
        </div>}
        {isTyping && <p className="loading-message">A processar...</p>}
        <div className="input-section">
          <div className="input-box">
            <button className="toggle-btn" onClick={() => { toggleThreePrompts }}>
              <img src={icons.convert_to_form} alt="Convert to Form" className='convert-to-form' />
            </button>
            <button className="toggle-btn" onClick={uploadFile}>
              <img src={icons.attach_file} alt="Attach File" className='attach-file' />
            </button>
            <input
              type="text"
              id="user_story_input"
              placeholder="As a &lt;type of user&gt;, I want to &lt;perform an action&gt;, so that &lt;achieve a goal&gt;"
              value={userStory}
              onChange={(e) => setUserStory(e.target.value)}
              onKeyDown={checkEnter}
              autoComplete="off" />
            <button className="toggle-btn" onClick={sendToBackend}>
              <img src={icons.send_circle} alt="Send" className='send-prompt' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
