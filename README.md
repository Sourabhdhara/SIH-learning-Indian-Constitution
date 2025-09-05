# Constitution Hub 🏛️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue.svg)](https://pages.github.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-green.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> A comprehensive, interactive web application for learning about the Indian Constitution with AI-powered chat, articles, quizzes, and advanced theme management.

## ✨ Features

### 🤖 **AI-Powered Chat System**
- Interactive chatbot with constitutional knowledge
- Quick question buttons for common queries
- Real-time responses with typing indicators
- Searchable Q&A database

### 📚 **Comprehensive Articles System**
- Browse constitutional articles by category
- Advanced search functionality
- Rich text formatting support
- Responsive article viewer

### 🧩 **Interactive Quiz System**
- Multiple-choice questions
- Real-time scoring and feedback
- Progress tracking
- Randomized question order

### 🎨 **Advanced Theme Customizer**
- 5+ built-in theme presets (Default, Dark, Ocean Blue, Forest Green, Royal Purple)
- Custom color picker for all UI elements
- Real-time preview
- Import/Export theme configurations
- Persistent theme storage

### 📊 **Data Management System**
- Support for local files (TXT, JSON, CSV)
- External source integration (Google Drive, GitHub, Any URL)
- Real-time data loading and parsing
- Backup and restore functionality

### ⚙️ **Admin Panel**
- Complete content management
- External source configuration
- Theme customization interface
- Data import/export tools

---

## 📁 File Structure

```
constitution-hub/
├── 📄 index.html                 # Main HTML file
├── 🎨 style.css                  # Complete CSS with theme system
├── ⚡ script.js                  # Main JavaScript application
├── 📝 qna.txt                    # Q&A data file (optional)
├── 📚 articles.txt               # Articles data file (optional)
├── 🧩 quiz.txt                   # Quiz data file (optional)
├── 📖 README.md                  # Project documentation
├── 📄 LICENSE                    # MIT License file
└── 🚀 .github/workflows/         # GitHub Actions (optional)
    └── deploy.yml                # Auto-deployment workflow
```

### 📋 **Required Files**
- `index.html` - Main application interface
- `style.css` - Styling and theme system
- `script.js` - Core application logic

### 📝 **Optional Data Files**
- `qna.txt` - Questions and answers
- `articles.txt` - Constitutional articles
- `quiz.txt` - Quiz questions
- Any other data files for external sources

---

## 🚀 Quick Start

### 1. **Download/Clone the Repository**
```bash
git clone https://github.com/YOUR-USERNAME/constitution-hub.git
cd constitution-hub
```

### 2. **Set Up Local Development**
- Install [VS Code](https://code.visualstudio.com/) with [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- Right-click `index.html` → "Open with Live Server"
- Or use any local web server (Python, Node.js, etc.)

### 3. **Add Your Content**
Create data files in the specified formats (see [Data File Formats](#data-file-formats))

### 4. **Customize (Optional)**
- Modify themes in Admin Panel
- Add external data sources
- Customize content and branding

---

## 📄 Data File Formats

### 📝 **TXT Format (Recommended)**

#### **Q&A File (qna.txt)**
```
Q: What is the Preamble of Indian Constitution?
A: The Preamble is the introductory statement of the Constitution that sets out the guiding purpose and principles of the document. It declares India to be a sovereign, socialist, secular, democratic republic.

---

Q: How many fundamental rights are there?
A: There are 6 fundamental rights in the Indian Constitution:
1. Right to Equality
2. Right to Freedom
3. Right against Exploitation
4. Right to Freedom of Religion
5. Cultural and Educational Rights
6. Right to Constitutional Remedies
```

#### **Articles File (articles.txt)**
```
Preamble of the Indian Constitution
The Preamble to the Constitution of India is an introductory statement that sets out the guiding purpose and principles of the document. It declares India to be a **sovereign, socialist, secular, democratic republic**.

**Key Features:**
- **SOVEREIGN** - India is free from external control
- **SOCIALIST** - Economic equality and social justice
- **SECULAR** - No state religion; all religions are treated equally

---

Fundamental Rights
Fundamental Rights are the basic human rights guaranteed by the Constitution of India to all its citizens. These rights are essential for the development of personality and dignity of individuals.

**The Six Categories are:**
1. **Right to Equality (Articles 14-18)** - Equality before law
2. **Right to Freedom (Articles 19-22)** - Freedom of speech, assembly
```

#### **Quiz File (quiz.txt)**
```
How many fundamental rights are guaranteed by the Indian Constitution?
A) 5
B) 6
C) 7
D) 8
Correct: B

---

In which year was the Indian Constitution adopted?
A) 1947
B) 1949
C) 1950
D) 1951
Correct: B
```

### 📊 **JSON Format**

#### **Q&A JSON (qna.json)**
```json
[
  {
    "question": "What is the Preamble?",
    "answer": "The Preamble is the introductory statement of the Constitution that explains its objectives and declares India as a sovereign, socialist, secular, democratic republic.",
    "category": "basics",
    "keywords": ["preamble", "introduction", "objectives"]
  }
]
```

#### **Articles JSON (articles.json)**
```json
[
  {
    "title": "Preamble of Indian Constitution",
    "content": "The Preamble is the introductory statement...",
    "category": "fundamentals",
    "author": "Constitution Hub",
    "tags": ["preamble", "introduction", "principles"]
  }
]
```

#### **Quiz JSON (quiz.json)**
```json
[
  {
    "question": "How many fundamental rights are guaranteed?",
    "options": ["5", "6", "7", "8"],
    "correctAnswer": 1,
    "explanation": "The Indian Constitution guarantees 6 fundamental rights.",
    "category": "rights",
    "difficulty": "easy"
  }
]
```

### 📈 **CSV Format**

#### **Q&A CSV (qna.csv)**
```csv
question,answer,category,keywords
"What is the Preamble?","The Preamble is the introductory statement...","basics","preamble,introduction,objectives"
```

---

## 🌐 External Data Sources

### **Supported Sources**
- **Local Files**: Place files in the same directory
- **Google Drive**: Share publicly and use direct download links
- **GitHub Raw**: Raw file URLs from GitHub repositories
- **Any Public URL**: Direct links to text files with CORS enabled

### **Google Drive Setup**
1. Upload your data file to Google Drive
2. Right-click → "Get link" → "Anyone with the link"
3. Convert the sharing URL:
   ```
   From: https://drive.google.com/file/d/1ABC123DEF/view?usp=sharing
   To:   https://drive.google.com/uc?export=download&id=1ABC123DEF
   ```

### **GitHub Raw Setup**
1. Upload files to your GitHub repository
2. Navigate to the file and click "Raw"
3. Copy the raw URL:
   ```
   https://raw.githubusercontent.com/username/repository/main/filename.txt
   ```

### **Adding External Sources**
1. Go to **Admin Panel** (password: `1987`)
2. Navigate to **Data Sources** tab
3. Click **"Add External Source"**
4. Fill in the form:
   - **Name**: Descriptive name for your source
   - **URL**: Direct link to your data file
   - **Type**: qa/articles/quiz
   - **Format**: txt/json/csv

---

## 🎨 Theme System

### **Built-in Themes**
- **Default**: Teal and modern design
- **Dark Mode**: Dark background with bright accents
- **Ocean Blue**: Blue-themed professional look
- **Forest Green**: Nature-inspired green palette
- **Royal Purple**: Elegant purple and pink combination

### **Custom Theme Creation**
1. Access **Admin Panel** → **🎨 Theme Customizer**
2. Use **Quick Presets** or **Advanced Color Controls**
3. **Live Preview** shows changes in real-time
4. **Save Custom Theme** for future use
5. **Export/Import** themes as JSON files

### **Customizable Colors**
- Primary and secondary colors
- Background and surface colors
- Text and border colors
- Success, error, warning, and info colors

---

## 🚀 Deployment

### **GitHub Pages (Recommended)**

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/constitution-hub.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository **Settings**
   - Navigate to **Pages** section
   - Select **Deploy from a branch**
   - Choose **main** branch
   - Save and wait for deployment

3. **Update Default Sources (Optional)**
   Edit `script.js` and update the GitHub URLs:
   ```javascript
   const defaultSources = [
     {
       name: 'Constitutional Articles (GitHub)',
       url: 'https://raw.githubusercontent.com/YOUR-USERNAME/constitution-hub/main/articles.txt',
       // ...
     }
   ];
   ```

### **Other Deployment Options**
- **Netlify**: Drag and drop deployment
- **Vercel**: Git integration with auto-deployments
- **Firebase Hosting**: Google's hosting platform
- **Any Web Server**: Upload files to any web server

---

## 🔧 Configuration

### **Admin Panel Access**
- **Default Password**: `1987`
- **Change Password**: Modify the password check in `script.js`:
  ```javascript
  if (pwd === 'YOUR-NEW-PASSWORD') {
    this.showSection('admin');
  }
  ```

### **Default Data Sources**
To include default external sources, edit the `loadDefaultExternalSources()` method in `script.js`:

```javascript
const defaultSources = [
  {
    id: 'default-1',
    name: 'Your Source Name',
    url: 'https://your-source-url.com/data.txt',
    type: 'articles', // or 'qa' or 'quiz'
    format: 'txt',    // or 'json' or 'csv'
    enabled: true
  }
];
```

---

## 📱 Features Guide

### **🤖 Using the AI Chat**
1. Click **"AI Chat"** in the navigation
2. Type your question or click a **Quick Question** button
3. The AI will respond based on your Q&A database
4. Chat history is maintained during the session

### **📚 Browsing Articles**
1. Click **"Articles"** in the navigation
2. Use the **search box** to find specific topics
3. Click any article in the sidebar to view full content
4. Articles support **Markdown-style formatting**

### **🧩 Taking Quizzes**
1. Click **"Quiz"** in the navigation
2. Click **"Start Quiz"** to begin
3. Answer multiple-choice questions
4. Get real-time feedback and final score
5. Retake quizzes as many times as you want

### **⚙️ Admin Panel**
Access with password `1987`:

#### **Manage Q&A**
- Add, edit, and delete Q&A pairs
- Organize by categories
- Bulk import from files

#### **Manage Articles**
- Create and edit constitutional articles
- Rich text formatting support
- Category and tag management

#### **Manage Quiz**
- Create multiple-choice questions
- Set correct answers and explanations
- Difficulty levels and categories

#### **Data Sources**
- Add external data sources
- Test connection to sources
- Refresh data from sources
- Enable/disable sources

#### **🎨 Theme Customizer**
- Choose from built-in themes
- Create custom color schemes
- Real-time preview
- Import/export themes

#### **Backup/Restore**
- Export all data as JSON
- Import data from backup files
- Reset to default data

---

## 🔍 Troubleshooting

### **Common Issues**

#### **Articles Not Loading**
- ✅ Check that `articles.txt` is in the same folder as `index.html`
- ✅ Verify file format follows the TXT structure with `---` separators
- ✅ Check browser console (F12) for error messages
- ✅ Try adding articles as external sources instead

#### **External Sources Not Working**
- ✅ Ensure URLs are publicly accessible
- ✅ For Google Drive, use the direct download URL format
- ✅ Check CORS headers for custom URLs
- ✅ Test the URL directly in browser

#### **Theme Not Persisting**
- ✅ Check browser localStorage is enabled
- ✅ Clear browser cache and try again
- ✅ Export theme as backup and re-import

#### **Admin Panel Not Opening**
- ✅ Verify password is exactly `1987`
- ✅ Check browser console for JavaScript errors
- ✅ Try refreshing the page

### **Performance Tips**
- Keep data files under 1MB for optimal performance
- Use TXT format for best compatibility
- Limit external sources to avoid loading delays

---

## 🤝 Contributing

### **How to Contribute**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### **Areas for Contribution**
- 🐛 Bug fixes and improvements
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Testing and quality assurance
- 🌐 Internationalization (i18n)

### **Development Setup**
```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/constitution-hub.git
cd constitution-hub

# Start development server
# Use VS Code with Live Server or any local server
```

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Constitution Hub

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Support

### **Getting Help**
- 📖 Check this README for comprehensive documentation
- 🐛 [Open an issue](https://github.com/sourabhdhara/constitution-hub/issues) for bug reports
- 💡 [Request features](https://github.com/sourabhdhara/constitution-hub/issues) for new functionality
- 💬 [Start a discussion](https://github.com/sourabhdhara/constitution-hub/discussions) for questions

### **Project Stats**
![GitHub stars](https://img.shields.io/github/stars/sourabhdhara/constitution-hub?style=social)
![GitHub forks](https://img.shields.io/github/forks/sourabhdhara/constitution-hub?style=social)
![GitHub issues](https://img.shields.io/github/issues/sourabhdhara/constitution-hub)
![GitHub pull requests](https://img.shields.io/github/issues-pr/sourabhdhara/constitution-hub)

---

## 🙏 Acknowledgments

- **Font Awesome** for beautiful icons
- **Google Fonts** for typography
- **CSS Grid** and **Flexbox** for responsive design
- **LocalStorage API** for data persistence
- **Fetch API** for external data loading

---

## 🚀 What's Next?

### **Planned Features**
- 🔍 Advanced search with filters
- 📊 Analytics and usage tracking
- 🌐 Multi-language support
- 📱 Progressive Web App (PWA) capabilities
- 🔔 Notification system
- 👥 User accounts and progress tracking
- 🎯 Advanced quiz features (timed quizzes, difficulty progression)
- 📈 Data visualization and charts

---

**Made with ❤️ for Constitutional Education**

> Empowering citizens with knowledge of their rights and governance structures through technology.

---

*Last updated: September 2025*
