# AI Code Debug Assistant (VS Code Extension)

This is a simple VS Code extension I built that helps in understanding code errors and getting quick suggestions using AI. Instead of searching errors manually, you can just click a button and it explains what’s going on in your code. You can also ask follow-up questions like a chat.

---

## 🚀 Features

- Explains your code in simple terms
- Detects possible errors
- Suggests fixes
- Chat-style interface for follow-up questions
- Automatically reads code (no need to paste manually)

---

## 🛠️ Tech Stack

- JavaScript (VS Code Extension API)
- Axios (for API calls)
- Groq API (LLaMA model for AI responses)

---

## ⚙️ How It Works

1. Open any file in VS Code  
2. Click **"Explain Error"** button (top right or command palette)  
3. Extension reads your code automatically  
4. AI analyzes and shows:
   - Explanation  
   - Errors (if any)  
   - Suggestions  
5. You can ask more questions in the chat box  

---

## 📦 Installation (Manual)

1. Clone this repository: https://github.com/moonglow2003/AI-Code-Debug-Assistant.git
2. Open the project in VS Code
3. Install dependencies: npm install
4. Add your API key inside `extension.js`:
```js
const apiKey = "";
```
5. Press F5 to run the extension 


---

## 📸 Screenshots 


✅ 1. Extension Button<img width="340" height="60" alt="Extension Button" src="https://github.com/user-attachments/assets/ba1090e6-52db-4ed1-97d4-4c904b6337aa" />
✅ 2. Random Files (Code with Errors)<img width="1908" height="906" alt="Code with Errors" src="https://github.com/user-attachments/assets/12b58865-3728-4596-a869-78f144e491cb" />

✅ 3. AI Response <img width="1918" height="880" alt="AI Response" src="https://github.com/user-attachments/assets/8b7bfd6b-2d6e-4c48-a61a-ff550581676d" />

✅ 4. Chat Feature <img width="1909" height="975" alt="Chat Feature" src="https://github.com/user-attachments/assets/948f38f7-d8fd-475d-ae6d-2dd8ae3364cc" />





