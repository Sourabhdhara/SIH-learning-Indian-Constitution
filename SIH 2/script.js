// script.js

// Constitution Hub - Complete JavaScript Implementation
// All data is stored in localStorage for persistence

class ConstitutionHub {
    constructor() {
        this.qaDatabase = [];
        this.articlesDatabase = [];
        this.currentArticles = [];
        this.init();
    }

    // Initialize the application
    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.loadDefaultData();
        this.renderArticlesList();
        this.updateStats();
        this.showSection('chat');
    }
    


    

    // Event Listeners Setup
    setupEventListeners() {
        // Navigation
        document.getElementById('chatToggle')
          .addEventListener('click', () => this.showSection('chat'));
        document.getElementById('articlesToggle')
          .addEventListener('click', () => this.showSection('articles'));

        // Password-lock Manage tab
        document.getElementById('adminToggle').addEventListener('click', () => {
            const pwd = prompt('Enter password to access Manage:');
            if (pwd === '1987') {
                this.showSection('admin');
            } else {
                alert('Incorrect password.');
            }
        });

        // Chat functionality
        document.getElementById('chatForm')
          .addEventListener('submit', (e) => this.handleChatSubmit(e));

        // Quick questions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-btn')) {
                const question = e.target.getAttribute('data-question');
                document.getElementById('userInput').value = question;
                this.handleChatSubmit(new Event('submit'));
            }
        });

        // Article search
        document.getElementById('articleSearch')
          .addEventListener('input', (e) => this.handleArticleSearch(e));

        // Admin tabs
        document.querySelectorAll('.admin-tab')
          .forEach(tab => tab.addEventListener('click', (e) =>
            this.showAdminTab(e.target.dataset.tab)));

        // Q&A Management
        document.getElementById('addQABtn')
          .addEventListener('click', () => this.showQAForm());
        document.getElementById('saveQA')
          .addEventListener('click', () => this.saveQA());
        document.getElementById('cancelQA')
          .addEventListener('click', () => this.hideQAForm());

        // Article Management
        document.getElementById('addArticleBtn')
          .addEventListener('click', () => this.showArticleForm());
        document.getElementById('saveArticle')
          .addEventListener('click', () => this.saveArticle());
        document.getElementById('cancelArticle')
          .addEventListener('click', () => this.hideArticleForm());

        // Backup/Restore
        document.getElementById('exportData')
          .addEventListener('click', () => this.exportData());
        document.getElementById('importData')
          .addEventListener('click', () => document.getElementById('importFile').click());
        document.getElementById('importFile')
          .addEventListener('change', (e) => this.importData(e));
        document.getElementById('resetData')
          .addEventListener('click', () => this.resetData());
    }

    // Section Management
    showSection(section) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        switch (section) {
            case 'chat':
                document.getElementById('chatToggle').classList.add('active');
                document.getElementById('chatSection').classList.add('active');
                break;
            case 'articles':
                document.getElementById('articlesToggle').classList.add('active');
                document.getElementById('articlesSection').classList.add('active');
                break;
            case 'admin':
                document.getElementById('adminToggle').classList.add('active');
                document.getElementById('adminSection').classList.add('active');
                this.renderQAList();
                this.renderArticleAdminList();
                this.updateStats();
                break;
        }
    }


    // Chat Functionality
    handleChatSubmit(e) {
        e.preventDefault();
        const input = document.getElementById('userInput');
        const question = input.value.trim();
        if (!question) return;

        this.addMessage('user', question);
        input.value = '';

        // Show typing indicator
        const typingId = this.addTypingIndicator();

        // Process question with delay for better UX
        setTimeout(() => {
            this.removeMessage(typingId);
            const answer = this.findAnswer(question);
            this.addMessage('bot', answer);
        }, 1000 + Math.random() * 1000); // Random delay for realism
    }

    findAnswer(question) {
        const lowerQuestion = question.toLowerCase();
        
        // First, try to find in Q&A database
        const qaMatch = this.qaDatabase.find(qa => 
            lowerQuestion.includes(qa.question.toLowerCase()) ||
            qa.keywords.some(keyword => lowerQuestion.includes(keyword.toLowerCase()))
        );
        
        if (qaMatch) {
            return qaMatch.answer;
        }
        
        // If no direct match, search in articles database
        const articleMatch = this.articlesDatabase.find(article =>
            lowerQuestion.includes(article.title.toLowerCase()) ||
            article.content.toLowerCase().includes(lowerQuestion) ||
            article.tags.some(tag => lowerQuestion.includes(tag.toLowerCase()))
        );
        
        if (articleMatch) {
            return `Based on "${article.title}": ${article.summary || article.content.substring(0, 200) + '...'}`;
        }
        
        // Enhanced fallback with suggestions
        const suggestions = this.getSuggestions(lowerQuestion);
        if (suggestions.length > 0) {
            return `I couldn't find a specific answer, but you might be interested in: ${suggestions.join(', ')}. You can also browse the Articles section for more detailed information.`;
        }
        
        return "I couldn't find a specific answer to your question. Please try rephrasing it or browse through our articles section for more detailed information about the Indian Constitution.";
    }

    getSuggestions(question) {
        const keywords = ['fundamental rights', 'preamble', 'articles', 'amendment', 'constitution', 'government', 'judiciary'];
        return keywords.filter(keyword => question.includes(keyword.split(' ')[0]));
    }

    addMessage(sender, content) {
        const chatWindow = document.getElementById('chatWindow');
        const messageDiv = document.createElement('div');
        const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        messageDiv.id = id;
        messageDiv.className = `message ${sender}-message`;
        
        messageDiv.innerHTML = `
            <div class="${sender}-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <p><strong>${sender === 'user' ? 'You' : 'ConBot'}:</strong> ${content}</p>
            </div>
        `;
        
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
        return id;
    }

    addTypingIndicator() {
        const chatWindow = document.getElementById('chatWindow');
        const typingDiv = document.createElement('div');
        const id = `typing-${Date.now()}`;
        typingDiv.id = id;
        typingDiv.className = 'message bot-message';
        typingDiv.innerHTML = `
            <div class="bot-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p><strong>ConBot:</strong> <i class="fas fa-spinner fa-spin"></i> Thinking...</p>
            </div>
        `;
        
        chatWindow.appendChild(typingDiv);
        chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
        return id;
    }

    removeMessage(id) {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
        }
    }

    // Articles Functionality
    renderArticlesList() {
        const articlesList = document.getElementById('articlesList');
        articlesList.innerHTML = '';
        
        if (this.currentArticles.length === 0) {
            articlesList.innerHTML = '<div class="loading">No articles found</div>';
            return;
        }
        
        this.currentArticles.forEach((article, index) => {
            const articleItem = document.createElement('div');
            articleItem.className = 'article-item';
            articleItem.innerHTML = `
                <h4>${article.title}</h4>
                <p>${article.summary || article.content.substring(0, 100) + '...'}</p>
            `;
            
            articleItem.addEventListener('click', () => this.showArticle(article, articleItem));
            articlesList.appendChild(articleItem);
        });
    }

    showArticle(article, element) {
        // Update active state
        document.querySelectorAll('.article-item').forEach(item => item.classList.remove('active'));
        element.classList.add('active');
        
        // Show article content
        const articleViewer = document.getElementById('articleViewer');
        articleViewer.innerHTML = `
            <div class="article-content-display">
                <h1>${article.title}</h1>
                <div class="article-meta">
                    <span><i class="fas fa-tag"></i> ${(article.tags || []).join(', ')}</span>
                    <span><i class="fas fa-user"></i> ${article.author || 'System'}</span>
                </div>
                <div class="article-body">
                    ${this.formatContent(article.content)}
                </div>
            </div>
        `;
    }

    formatContent(content) {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');
    }

    handleArticleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (!searchTerm) {
            this.currentArticles = [...this.articlesDatabase];
        } else {
            this.currentArticles = this.articlesDatabase.filter(article =>
                article.title.toLowerCase().includes(searchTerm) ||
                article.content.toLowerCase().includes(searchTerm) ||
                (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        }
        
        this.renderArticlesList();
    }

    // Admin Functionality
    showAdminTab(tab) {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}Tab`).classList.add('active');
    }

    // Q&A Management
    showQAForm(qa = null) {
        const form = document.getElementById('qaForm');
        const editId = document.getElementById('qaEditId');
        const question = document.getElementById('qaQuestion');
        const answer = document.getElementById('qaAnswer');
        const category = document.getElementById('qaCategory');
        
        if (qa) {
            editId.value = qa.id;
            question.value = qa.question;
            answer.value = qa.answer;
            category.value = qa.category || 'general';
        } else {
            editId.value = '';
            question.value = '';
            answer.value = '';
            category.value = 'general';
        }
        
        form.style.display = 'block';
        question.focus();
    }

    hideQAForm() {
        document.getElementById('qaForm').style.display = 'none';
    }

    saveQA() {
        const editId = document.getElementById('qaEditId').value;
        const question = document.getElementById('qaQuestion').value.trim();
        const answer = document.getElementById('qaAnswer').value.trim();
        const category = document.getElementById('qaCategory').value;
        
        if (!question || !answer) {
            alert('Please fill in both question and answer');
            return;
        }
        
        const qaItem = {
            id: editId || Date.now(),
            question,
            answer,
            category,
            keywords: this.extractKeywords(question),
            createdAt: editId ? this.qaDatabase.find(q => q.id == editId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (editId) {
            const index = this.qaDatabase.findIndex(q => q.id == editId);
            if (index !== -1) {
                this.qaDatabase[index] = qaItem;
            }
        } else {
            this.qaDatabase.push(qaItem);
        }
        
        this.saveToStorage();
        this.renderQAList();
        this.hideQAForm();
        this.updateStats();
    }

    renderQAList() {
        const qaList = document.getElementById('qaList');
        qaList.innerHTML = '';
        
        this.qaDatabase.forEach(qa => {
            const item = document.createElement('div');
            item.className = 'data-item';
            item.innerHTML = `
                <h4>${qa.question}</h4>
                <p>${qa.answer.substring(0, 150)}${qa.answer.length > 150 ? '...' : ''}</p>
                <small>Category: ${qa.category}</small>
                <div class="data-item-actions">
                    <button class="edit-btn" onclick="app.editQA(${qa.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="app.deleteQA(${qa.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            qaList.appendChild(item);
        });
    }

    editQA(id) {
        const qa = this.qaDatabase.find(q => q.id == id);
        if (qa) {
            this.showQAForm(qa);
        }
    }

    deleteQA(id) {
        if (confirm('Are you sure you want to delete this Q&A item?')) {
            this.qaDatabase = this.qaDatabase.filter(q => q.id != id);
            this.saveToStorage();
            this.renderQAList();
            this.updateStats();
        }
    }

    // Article Management
    showArticleForm(article = null) {
        const form = document.getElementById('articleForm');
        const editId = document.getElementById('articleEditId');
        const title = document.getElementById('articleTitle');
        const content = document.getElementById('articleContent');
        const category = document.getElementById('articleCategory');
        
        if (article) {
            editId.value = article.id;
            title.value = article.title;
            content.value = article.content;
            category.value = article.category || 'general';
        } else {
            editId.value = '';
            title.value = '';
            content.value = '';
            category.value = 'general';
        }
        
        form.style.display = 'block';
        title.focus();
    }

    hideArticleForm() {
        document.getElementById('articleForm').style.display = 'none';
    }

    saveArticle() {
        const editId = document.getElementById('articleEditId').value;
        const title = document.getElementById('articleTitle').value.trim();
        const content = document.getElementById('articleContent').value.trim();
        const category = document.getElementById('articleCategory').value;
        
        if (!title || !content) {
            alert('Please fill in both title and content');
            return;
        }
        
        const articleItem = {
            id: editId || Date.now(),
            title,
            content,
            summary: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
            tags: this.extractKeywords(title),
            category,
            author: 'Admin',
            createdAt: editId ? this.articlesDatabase.find(a => a.id == editId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (editId) {
            const index = this.articlesDatabase.findIndex(a => a.id == editId);
            if (index !== -1) {
                this.articlesDatabase[index] = articleItem;
            }
        } else {
            this.articlesDatabase.push(articleItem);
        }
        
        this.currentArticles = [...this.articlesDatabase];
        this.saveToStorage();
        this.renderArticleAdminList();
        this.renderArticlesList();
        this.hideArticleForm();
        this.updateStats();
    }

    renderArticleAdminList() {
        const articleList = document.getElementById('articleAdminList');
        articleList.innerHTML = '';
        
        this.articlesDatabase.forEach(article => {
            const item = document.createElement('div');
            item.className = 'data-item';
            item.innerHTML = `
                <h4>${article.title}</h4>
                <p>${article.summary || article.content.substring(0, 150) + '...'}</p>
                <small>Category: ${article.category}</small>
                <div class="data-item-actions">
                    <button class="edit-btn" onclick="app.editArticle(${article.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="app.deleteArticle(${article.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            articleList.appendChild(item);
        });
    }

    editArticle(id) {
        const article = this.articlesDatabase.find(a => a.id == id);
        if (article) {
            this.showArticleForm(article);
        }
    }

    deleteArticle(id) {
        if (confirm('Are you sure you want to delete this article?')) {
            this.articlesDatabase = this.articlesDatabase.filter(a => a.id != id);
            this.currentArticles = [...this.articlesDatabase];
            this.saveToStorage();
            this.renderArticleAdminList();
            this.renderArticlesList();
            this.updateStats();
        }
    }

    // Backup/Restore
    exportData() {
        const data = {
            qaDatabase: this.qaDatabase,
            articlesDatabase: this.articlesDatabase,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `constitution-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                
                if (confirm('This will replace all existing data. Are you sure?')) {
                    this.qaDatabase = data.qaDatabase || [];
                    this.articlesDatabase = data.articlesDatabase || [];
                    this.currentArticles = [...this.articlesDatabase];
                    this.saveToStorage();
                    this.renderQAList();
                    this.renderArticleAdminList();
                    this.renderArticlesList();
                    this.updateStats();
                    alert('Data imported successfully!');
                }
            } catch (error) {
                alert('Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset file input
    }

    resetData() {
        if (confirm('This will reset all data to default. Are you sure?')) {
            localStorage.removeItem('constitutionHub_qa');
            localStorage.removeItem('constitutionHub_articles');
            this.loadDefaultData();
            this.renderQAList();
            this.renderArticleAdminList();
            this.renderArticlesList();
            this.updateStats();
            alert('Data reset to default successfully!');
        }
    }

    updateStats() {
        document.getElementById('qaCount').textContent = this.qaDatabase.length;
        document.getElementById('articleCount').textContent = this.articlesDatabase.length;
        document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
    }

    // Utility Functions
    extractKeywords(text) {
        const commonWords = ['the', 'is', 'are', 'was', 'were', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'what', 'how', 'when', 'where', 'why', 'who'];
        return text.toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 2 && !commonWords.includes(word))
            .slice(0, 5);
    }

    // Data Storage
    saveToStorage() {
        localStorage.setItem('constitutionHub_qa', JSON.stringify(this.qaDatabase));
        localStorage.setItem('constitutionHub_articles', JSON.stringify(this.articlesDatabase));
    }

    loadFromStorage() {
        const qaData = localStorage.getItem('constitutionHub_qa');
        const articlesData = localStorage.getItem('constitutionHub_articles');
        
        this.qaDatabase = qaData ? JSON.parse(qaData) : [];
        this.articlesDatabase = articlesData ? JSON.parse(articlesData) : [];
        this.currentArticles = [...this.articlesDatabase];
    }

    // Default Data
    loadDefaultData() {
        if (this.qaDatabase.length === 0) {
            this.qaDatabase = this.getDefaultQAData();
        }
        if (this.articlesDatabase.length === 0) {
            this.articlesDatabase = this.getDefaultArticlesData();
            this.currentArticles = [...this.articlesDatabase];
        }
        this.saveToStorage();
    }

    getDefaultQAData() {
        return [
            
            {
                id: 1,
                question: "What is the Preamble?",
                answer: "The Preamble is the introductory statement of the Constitution that explains its objectives and declares India as a sovereign, socialist, secular, democratic republic.",
                keywords: ["preamble", "introduction", "objectives", "constitution"],
                category: "basics",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 2,
                question: "Who drafted the Constitution?",
                answer: "The Constitution was drafted by the Drafting Committee chaired by Dr. B.R. Ambedkar, with significant contributions from other committee members.",
                keywords: ["drafted", "ambedkar", "committee", "constitution"],
                category: "history",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 3,
                question: "When did the Constitution come into effect?",
                answer: "The Constitution of India came into effect on 26 January 1950, which is celebrated as Republic Day.",
                keywords: ["effect", "date", "republic", "day", "1950"],
                category: "history",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 4,
                question: "How many articles are there in the Constitution?",
                answer: "The Indian Constitution originally had 395 articles in 22 parts. Currently, it has 448 articles due to various amendments.",
                keywords: ["articles", "number", "parts", "amendments"],
                category: "basics",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 5,
                question: "What are Fundamental Rights?",
                answer: "Fundamental Rights are basic human rights guaranteed to all Indian citizens, including Right to Equality, Right to Freedom, Right against Exploitation, Right to Freedom of Religion, Cultural and Educational Rights, and Right to Constitutional Remedies.",
                keywords: ["fundamental", "rights", "equality", "freedom", "human"],
                category: "rights",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }

    getDefaultArticlesData() {
        return [
            {
                id: 1,
                title: "Preamble of the Indian Constitution",
                content: "The Preamble to the Constitution of India is an introductory statement that sets out the guiding purpose and principles of the document. It declares India to be a **sovereign, socialist, secular, democratic republic** and ensures justice, liberty, equality, and fraternity for all citizens.\n\n**Key Features:**\n- **SOVEREIGN** - India is free from external control\n- **SOCIALIST** - Economic equality and social justice\n- **SECULAR** - No state religion; all religions are treated equally\n- **DEMOCRATIC** - Government by the people\n- **REPUBLIC** - Head of state is elected, not hereditary",
                summary: "The introductory statement declaring India's nature and constitutional objectives.",
                tags: ["preamble", "republic", "democracy", "constitution"],
                category: "fundamentals",
                author: "System",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 2,
                title: "Fundamental Rights",
                content: "Fundamental Rights are the basic human rights guaranteed by the Constitution of India to all its citizens. These rights are essential for the development of personality and dignity of individuals.\n\n**The Six Categories are:**\n1. **Right to Equality (Articles 14-18)** - Equality before law, prohibition of discrimination\n2. **Right to Freedom (Articles 19-22)** - Freedom of speech, assembly, movement\n3. **Right against Exploitation (Articles 23-24)** - Prohibition of forced labour, child labour\n4. **Right to Freedom of Religion (Articles 25-28)** - Freedom of conscience and religion\n5. **Cultural and Educational Rights (Articles 29-30)** - Protection of minorities\n6. **Right to Constitutional Remedies (Article 32)** - Right to approach Supreme Court",
                summary: "Basic human rights guaranteed by the Constitution to all Indian citizens.",
                tags: ["rights", "fundamental", "equality", "freedom", "articles"],
                category: "rights",
                author: "System",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }
}




// ---- THEME CUSTOMIZER LOGIC ----
document.addEventListener('DOMContentLoaded', () => {
  // Load theme from localStorage on startup
  const theme = JSON.parse(localStorage.getItem('themeSettings') || '{}');
  for (const [varName, val] of Object.entries(theme)) {
    document.documentElement.style.setProperty(varName, val);
  }
  // Save theme on click
  const saveThemeBtn = document.getElementById('saveTheme');
  if (saveThemeBtn) {
    saveThemeBtn.addEventListener('click', () => {
      const newTheme = {
        '--color-primary':     document.getElementById('primaryColor').value,
        '--color-secondary':   document.getElementById('secondaryColor').value,
        '--color-bg':          document.getElementById('bgColor').value
      };
      for (const [varName, val] of Object.entries(newTheme)) {
        document.documentElement.style.setProperty(varName, val);
      }
      localStorage.setItem('themeSettings', JSON.stringify(newTheme));
      alert('Theme saved!');
    });
  }
});

// Initialize the application when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ConstitutionHub();
});