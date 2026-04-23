const vscode = require('vscode');
const axios = require('axios');

function activate(context) {

    let disposable = vscode.commands.registerCommand('explain-error.start', async function () {

        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showInformationMessage('Open a file first');
            return;
        }

        const code = editor.document.getText();   // ✅ store code
        let storedCode = code;

        const panel = vscode.window.createWebviewPanel(
            'explainError',
            'AI Debug Assistant',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        panel.webview.html = `<h2>🤖 Analyzing your code...</h2>`;

        const response = await getAIResponse(code);

        panel.webview.html = getWebviewContent(response);

        // ✅ FIXED: chat now uses code context
        panel.webview.onDidReceiveMessage(async (message) => {

            if (message.command === "ask") {

                const reply = await getAIResponseWithContext(storedCode, message.text);

                panel.webview.postMessage(reply);
            }
        });

    });

    context.subscriptions.push(disposable);
}


// 🔥 First AI call (initial explanation)
async function getAIResponse(input) {

    const apiKey = "Your_Api_Key";

    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "user",
                        content: `You are a senior software engineer.

Explain clearly using proper formatting:
- Use bullet points
- Keep it clean and readable
- Mention errors only if present

Code:
${input}`
                    }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content;

    } catch (error) {
        console.log("FULL ERROR:", error.response?.data || error.message);
        return "Error: " + JSON.stringify(error.response?.data || error.message);
    }
}


// 🔥 NEW: Context-aware chat function
async function getAIResponseWithContext(code, question) {

    const apiKey = "Your_Api_Key";

    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "user",
                        content: `You are a senior software engineer.

Here is the user's code:
${code}

Now answer this question based ONLY on this code:
${question}

Rules:
- Be short
- Be relevant
- Do NOT give unrelated answers`
                    }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content;

    } catch (error) {
        return "Error answering question";
    }
}


// 🔥 UI
function getWebviewContent(response) {
    return `
    
    <!DOCTYPE html>
    <html>
    <head>
    <style>
    body {
        font-family: Arial;
        padding: 20px;
        background-color: #1e1e1e;
        color: white;
    }

    h1 {
        color: #00ffcc;
    }

    .box {
        background: #2d2d2d;
        padding: 15px;
        border-radius: 10px;
        margin-top: 10px;
        line-height: 1.6;
        white-space: pre-wrap;
    }

    .chat-container {
        margin-top: 20px;
        max-height: 300px;
        overflow-y: auto;
    }

    .msg {
        padding: 10px;
        margin-top: 10px;
        border-radius: 8px;
        white-space: pre-wrap;
    }

    .user {
        background: #007acc;
        text-align: right;
    }

    .ai {
        background: #333;
    }

    button {
        background: #00ffcc;
        border: none;
        padding: 10px;
        margin-top: 10px;
        cursor: pointer;
        border-radius: 5px;
    }

    input {
        width: 70%;
        padding: 10px;
        border-radius: 5px;
        border: none;
        margin-top: 15px;
    }
    </style>
    </head>

    <body>

    <h1>🧠 AI Debug Assistant</h1>

    <div class="box" id="mainResponse">
        ${response}
    </div>

    <button onclick="copyText()">Copy</button>

    <div class="chat-container" id="chatContainer"></div>

    <input id="question" placeholder="Ask follow-up question..." />
    <button onclick="askAI()">Ask</button>

    <script>
    const vscode = acquireVsCodeApi();

    function copyText() {
        const text = document.getElementById("mainResponse").innerText;
        navigator.clipboard.writeText(text);
        alert("Copied!");
    }

    function addMessage(text, type) {
        const container = document.getElementById("chatContainer");

        const msg = document.createElement("div");
        msg.className = "msg " + type;
        msg.innerText = text;

        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }

    function askAI() {
        const input = document.getElementById("question");
        const question = input.value;

        if (!question) return;

        addMessage(question, "user");

        vscode.postMessage({
            command: "ask",
            text: question
        });

        input.value = "";
    }

    window.addEventListener('message', event => {
        addMessage(event.data, "ai");
    });
    </script>

    </body>
    </html>
    `;

}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};