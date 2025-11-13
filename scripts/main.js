const apiKeyForm = document.getElementById("api-key-form");
const apiKeyInput = document.getElementById("api-key-input");
const apiStatus = document.getElementById("api-status");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const chatLog = document.getElementById("chat-log");
const helperText = document.getElementById("form-helper");

const MODEL_NAME = "gemini-1.5-flash-latest";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

const conversation = [];
let apiKey = "";

const setChatAvailability = (enabled) => {
  messageInput.disabled = !enabled;
  sendButton.disabled = !enabled;
  helperText.textContent = enabled
    ? "Shift + Enter to add a new line."
    : "Enter an API key to enable chat.";
};

const setApiStatus = (message, tone = "neutral") => {
  apiStatus.textContent = message;
  apiStatus.dataset.tone = tone;
};

const renderMarkdown = (text) => {
  if (window.marked) {
    const html = marked.parse(text, { mangle: false, headerIds: false });
    const temp = document.createElement("div");
    temp.innerHTML = html;
    temp.querySelectorAll("script, style").forEach((el) => el.remove());
    temp.querySelectorAll("a").forEach((anchor) => {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    });
    return temp.innerHTML;
  }

  const safe = text
    .replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char]))
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br />");
  return `<p>${safe}</p>`;
};

const createMessageElement = (role, content) => {
  const wrapper = document.createElement("article");
  wrapper.classList.add("message", `message--${role}`);

  const author = document.createElement("p");
  author.classList.add("message__author");
  author.textContent = role === "user" ? "You" : role === "model" ? "Gemini" : "System";

  const body = document.createElement("div");
  body.classList.add("message__content");
  body.innerHTML = renderMarkdown(content);

  wrapper.append(author, body);
  return wrapper;
};

const appendMessage = (role, content) => {
  const message = createMessageElement(role, content);
  chatLog.append(message);
  chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: "smooth" });
};

const sendPrompt = async (prompt) => {
  conversation.push({ role: "user", parts: [{ text: prompt }] });
  appendMessage("user", prompt);

  setFormBusy(true);

  try {
    const response = await fetch(
      `${API_BASE}/models/${MODEL_NAME}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents: conversation }),
      }
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .join("\n")
      .trim();

    if (!text) {
      throw new Error("The model did not return any content.");
    }

    conversation.push({ role: "model", parts: [{ text }] });
    appendMessage("model", text);
  } catch (error) {
    console.error(error);
    conversation.pop();
    appendMessage("system", `Something went wrong: ${error.message}`);
  } finally {
    setFormBusy(false);
  }
};

const setFormBusy = (busy) => {
  messageForm.dataset.busy = busy ? "true" : "false";
  chatLog.setAttribute("aria-busy", busy ? "true" : "false");
  messageInput.disabled = busy;
  sendButton.disabled = busy;
  if (busy) {
    helperText.textContent = "Waiting for Gemini...";
  } else {
    helperText.textContent = "Shift + Enter to add a new line.";
    messageInput.focus();
  }
};

apiKeyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const key = apiKeyInput.value.trim();

  if (!key) {
    setApiStatus("API key is required", "error");
    return;
  }

  apiKey = key;
  apiKeyInput.value = "";
  conversation.length = 0;
  chatLog.innerHTML = "";
  setApiStatus("API key saved. You can start chatting!", "success");
  setChatAvailability(true);
  messageInput.focus();
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!apiKey) {
    setApiStatus("Please provide an API key first", "error");
    return;
  }

  const prompt = messageInput.value.trim();
  if (!prompt) {
    return;
  }

  messageInput.value = "";
  sendPrompt(prompt);
});

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    messageForm.requestSubmit();
  }
});

setChatAvailability(false);
