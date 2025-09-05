// Complete Working Constitution Hub - CLEAN VERSION
// This version properly loads and displays articles

class ConstitutionHub {
    constructor() {
        this.qaDatabase = [];
        this.articlesDatabase = [];
        this.quizDatabase = [];
        this.externalSources = [];
        this.currentArticles = [];
        this.currentQuiz = null;
        this.quizScore = 0;
        this.currentQuestionIndex = 0;
        this.dataLoaded = false;
        this.customThemes = {};
        this.currentTheme = 'default';
        this.init();
    }

    // Initialize the application
    async init() {
        try {
            console.log('🚀 Initializing Constitution Hub...');
            this.loadCustomThemes();
            this.loadExternalSourcesFromStorage();
            this.loadDefaultExternalSources(); // ADD DEFAULT SOURCES
            this.setupEventListeners();
            await this.loadAllDataSources();
            this.renderArticlesList();
            this.updateStats();
            this.showSection('chat');
            console.log('✅ Constitution Hub initialized successfully!');
        } catch (error) {
            console.error('❌ Initialization error:', error);
            this.loadDefaultData();
            this.setupEventListeners();
            this.showSection('chat');
        }
    }

    // NEW METHOD: Load Default External Sources
    loadDefaultExternalSources() {
        console.log('🔧 Loading default external sources...');
        
        const defaultSources = [
            {
                id: 'default-1',
                name: 'Constitutional Articles (GitHub)',
                url: 'https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO/main/articles.txt',
                type: 'articles',
                format: 'txt',
                enabled: true,
                isDefault: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'default-2', 
                name: 'Constitutional Q&A (GitHub)',
                url: 'https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO/main/qna.txt',
                type: 'qa',
                format: 'txt',
                enabled: true,
                isDefault: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'default-3',
                name: 'Constitutional Quiz (GitHub)',
                url: 'https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO/main/quiz.txt',
                type: 'quiz',
                format: 'txt',
                enabled: true,
                isDefault: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        
        // Load existing sources from localStorage
        const existingSources = JSON.parse(localStorage.getItem('constitutionHub_sources') || '[]');
        
        // Add default sources if they don't exist
        defaultSources.forEach(defaultSource => {
            const exists = existingSources.find(source => source.id === defaultSource.id);
            if (!exists) {
                existingSources.push(defaultSource);
                console.log(`✅ Added default source: ${defaultSource.name}`);
            }
        });
        
        // Save updated sources
        this.externalSources = existingSources;
        localStorage.setItem('constitutionHub_sources', JSON.stringify(this.externalSources));
        
        console.log(`📂 Loaded ${this.externalSources.length} total sources`);
    }

    // Setup Event Listeners - FIXED VERSION
    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');

        // Navigation buttons
        const chatToggle = document.getElementById('chatToggle');
        const articlesToggle = document.getElementById('articlesToggle');
        const quizToggle = document.getElementById('quizToggle');
        const adminToggle = document.getElementById('adminToggle');

        if (chatToggle) chatToggle.addEventListener('click', () => this.showSection('chat'));
        if (articlesToggle) articlesToggle.addEventListener('click', () => this.showSection('articles'));
        if (quizToggle) quizToggle.addEventListener('click', () => this.showSection('quiz'));
        
        if (adminToggle) {
            adminToggle.onclick = (e) => {
                e.preventDefault();
                const pwd = prompt('Enter password to access Manage:');
                if (pwd === '1987') {
                    this.showSection('admin');
                } else if (pwd !== null) {
                    alert('Incorrect password.');
                }
            };
        }

        // Chat functionality
        const chatForm = document.getElementById('chatForm');
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => this.handleChatSubmit(e));
        }

        // Quick questions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-btn')) {
                const question = e.target.getAttribute('data-question');
                const userInput = document.getElementById('userInput');
                if (userInput) {
                    userInput.value = question;
                    this.handleChatSubmit(new Event('submit'));
                }
            }
        });

        // Article search
        const articleSearch = document.getElementById('articleSearch');
        if (articleSearch) {
            articleSearch.addEventListener('input', (e) => this.handleArticleSearch(e));
        }

        // Quiz start button
        const startQuizBtn = document.getElementById('startQuizBtn');
        if (startQuizBtn) {
            startQuizBtn.addEventListener('click', () => this.startQuiz());
        }

        // Admin tabs
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                if (tabName) {
                    this.showAdminTab(tabName);
                }
            });
        });

        // Setup form and theme listeners
        this.setupFormEventListeners();
        this.setupThemeEventListeners();
        this.setupBackupEventListeners();

        console.log('✅ Event listeners set up successfully!');
    }

    // FIXED ARTICLES FUNCTIONS
    renderArticlesList() {
        console.log('📚 Rendering articles list...');
        const articlesList = document.getElementById('articlesList');
        if (!articlesList) {
            console.error('❌ Articles list container not found');
            return;
        }

        if (this.articlesDatabase.length === 0) {
            console.log('📝 No articles found, showing placeholder');
            articlesList.innerHTML = `
                <div class="no-data" style="padding: 20px; text-align: center; color: #757575;">
                    <p>Articles feature available - browse constitutional articles!</p>
                    <p style="font-size: 12px; margin-top: 10px;">Add articles.txt file to load content</p>
                </div>
            `;
            return;
        }

        console.log(`📚 Rendering ${this.articlesDatabase.length} articles`);
        articlesList.innerHTML = '';

        this.currentArticles.forEach((article, index) => {
            const articleItem = document.createElement('div');
            articleItem.className = 'article-item';
            articleItem.dataset.articleId = article.id;
            
            articleItem.innerHTML = `
                <h4>${article.title}</h4>
                <p>${article.summary || article.content.substring(0, 150) + '...'}</p>
            `;

            articleItem.addEventListener('click', () => {
                console.log(`📖 Loading article: ${article.title}`);
                this.showArticle(article);
            });

            articlesList.appendChild(articleItem);
        });

        console.log('✅ Articles list rendered successfully');
    }

    showArticle(article) {
        console.log('📖 Displaying article:', article.title);
        const articleViewer = document.getElementById('articleViewer');
        if (!articleViewer) {
            console.error('❌ Article viewer not found');
            return;
        }

        // Remove active class from all article items
        document.querySelectorAll('.article-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to clicked item
        const clickedItem = document.querySelector(`[data-article-id="${article.id}"]`);
        if (clickedItem) {
            clickedItem.classList.add('active');
        }

        // Format content (convert markdown-like syntax to HTML)
        let formattedContent = article.content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
            .replace(/\n\n/g, '</p><p>') // Paragraphs
            .replace(/\n- /g, '<br>• ') // List items
            .replace(/\n(\d+\.\s)/g, '<br>$1'); // Numbered lists

        articleViewer.innerHTML = `
            <div class="article-content-display">
                <div class="article-meta">
                    <span><i class="fas fa-folder"></i> ${article.category || 'General'}</span>
                    <span><i class="fas fa-calendar"></i> ${new Date(article.createdAt || Date.now()).toLocaleDateString()}</span>
                    <span><i class="fas fa-user"></i> ${article.author || 'Constitution Hub'}</span>
                </div>
                <h1>${article.title}</h1>
                <div class="article-body">
                    <p>${formattedContent}</p>
                </div>
            </div>
        `;

        console.log('✅ Article displayed successfully');
    }

    handleArticleSearch(e) {
        const query = e.target.value.toLowerCase().trim();
        console.log('🔍 Searching articles for:', query);

        if (!query) {
            this.currentArticles = [...this.articlesDatabase];
        } else {
            this.currentArticles = this.articlesDatabase.filter(article =>
                article.title.toLowerCase().includes(query) ||
                article.content.toLowerCase().includes(query) ||
                (article.tags && article.tags.some(tag => tag.toLowerCase().includes(query)))
            );
        }

        console.log(`🔍 Found ${this.currentArticles.length} matching articles`);
        this.renderArticlesList();
    }

    // Section Management
    showSection(section) {
        console.log(`🔄 Switching to section: ${section}`);
        
        // Remove active class from all nav buttons and sections
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        
        // Add active class to selected elements
        switch (section) {
            case 'chat':
                const chatToggle = document.getElementById('chatToggle');
                const chatSection = document.getElementById('chatSection');
                if (chatToggle) chatToggle.classList.add('active');
                if (chatSection) chatSection.classList.add('active');
                break;
            case 'articles':
                const articlesToggle = document.getElementById('articlesToggle');
                const articlesSection = document.getElementById('articlesSection');
                if (articlesToggle) articlesToggle.classList.add('active');
                if (articlesSection) articlesSection.classList.add('active');
                // Make sure articles are rendered when section is shown
                this.renderArticlesList();
                break;
            case 'quiz':
                const quizToggle = document.getElementById('quizToggle');
                const quizSection = document.getElementById('quizSection');
                if (quizToggle) quizToggle.classList.add('active');
                if (quizSection) quizSection.classList.add('active');
                this.resetQuizUI();
                break;
            case 'admin':
                const adminToggle = document.getElementById('adminToggle');
                const adminSection = document.getElementById('adminSection');
                if (adminToggle) adminToggle.classList.add('active');
                if (adminSection) adminSection.classList.add('active');
                this.renderQAList();
                this.renderArticleAdminList();
                this.renderQuizList();
                this.renderSourcesList();
                this.renderCustomThemes();
                this.updateStats();
                break;
        }
    }

    // Admin Tab Management
    showAdminTab(tab) {
        console.log(`🔄 Switching to admin tab: ${tab}`);
        
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
        
        const selectedTab = document.querySelector(`[data-tab="${tab}"]`);
        const selectedContent = document.getElementById(`${tab}Tab`);
        
        if (selectedTab) selectedTab.classList.add('active');
        if (selectedContent) selectedContent.classList.add('active');
        
        // Load specific content for tabs
        if (tab === 'sources') {
            this.renderSourcesList();
        } else if (tab === 'theme') {
            this.renderCustomThemes();
        }
    }

    // Data loading functions
    async loadAllDataSources() {
        this.updateDataStatus('🔄 Loading data sources...');
        
        try {
            await this.loadLocalTextFiles();
            
            if (this.qaDatabase.length === 0 && this.articlesDatabase.length === 0 && this.quizDatabase.length === 0) {
                this.loadDefaultData();
                this.updateDataStatus('Using default data');
            } else {
                this.updateDataStatus(`✅ Loaded ${this.getTotalDataCount()} items`);
            }
            
            this.dataLoaded = true;
        } catch (error) {
            console.error('❌ Error loading data sources:', error);
            this.loadDefaultData();
            this.updateDataStatus('Using default data (file load failed)');
        }
    }

    async loadLocalTextFiles() {
        const files = [
            { name: 'qna.txt', type: 'qa' },
            { name: 'articles.txt', type: 'articles' },
            { name: 'quiz.txt', type: 'quiz' }
        ];

        for (const file of files) {
            try {
                console.log(`📂 Loading ${file.name}...`);
                const response = await fetch(file.name);
                
                if (response.ok) {
                    const content = await response.text();
                    await this.parseAndLoadData(content, file.type, 'txt');
                    console.log(`✅ Successfully loaded ${file.name}`);
                } else {
                    console.log(`⚠️ File ${file.name} not found (${response.status})`);
                }
            } catch (error) {
                console.log(`❌ Could not load ${file.name}:`, error.message);
            }
        }
    }

    async parseAndLoadData(content, type, format) {
        let data = [];
        
        try {
            if (format === 'txt') {
                data = this.parsePlainText(content, type);
            }

            switch (type) {
                case 'qa':
                    this.qaDatabase = [...this.qaDatabase, ...data];
                    console.log(`✅ Loaded ${data.length} Q&A items`);
                    break;
                case 'articles':
                    this.articlesDatabase = [...this.articlesDatabase, ...data];
                    this.currentArticles = [...this.articlesDatabase];
                    console.log(`✅ Loaded ${data.length} articles`);
                    // Re-render articles list after loading
                    setTimeout(() => this.renderArticlesList(), 100);
                    break;
                case 'quiz':
                    this.quizDatabase = [...this.quizDatabase, ...data];
                    console.log(`✅ Loaded ${data.length} quiz questions`);
                    break;
            }
        } catch (error) {
            console.error(`❌ Error parsing ${type} data:`, error);
        }
    }

    parsePlainText(content, type) {
        const data = [];
        const sections = content.split('---').filter(section => section.trim());
        
        console.log(`📝 Parsing ${sections.length} ${type} sections`);

        sections.forEach((section, index) => {
            const lines = section.trim().split('\n').filter(line => line.trim());
            const item = {
                id: Date.now() + index + Math.random(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            if (type === 'qa') {
                item.question = lines[0]?.replace(/^Q:\s*/, '').trim() || '';
                item.answer = lines.slice(1).join('\n').replace(/^A:\s*/, '').trim() || '';
                item.category = 'general';
                item.keywords = this.extractKeywords(item.question);
            } else if (type === 'articles') {
                item.title = lines[0]?.trim() || `Article ${index + 1}`;
                item.content = lines.slice(1).join('\n').trim() || '';
                item.summary = item.content.substring(0, 200) + '...';
                item.category = this.extractCategoryFromTitle(item.title);
                item.tags = this.extractKeywords(item.title);
                item.author = 'Constitution Hub';
                
                console.log(`📄 Parsed article: "${item.title}"`);
            } else if (type === 'quiz') {
                item.question = lines[0]?.trim() || '';
                const optionLines = lines.slice(1).filter(line => line.match(/^[A-D][\)\.]\s*/));
                item.options = optionLines.map(line => line.replace(/^[A-D][\)\.]\s*/, '').trim());
                
                const correctLine = lines.find(line => line.toLowerCase().includes('correct:'));
                if (correctLine) {
                    const match = correctLine.match(/[A-D]/i);
                    item.correctAnswer = match ? match[0].charCodeAt(0) - 65 : 0;
                } else {
                    item.correctAnswer = 0;
                }
                
                item.explanation = '';
                item.category = 'general';
                item.difficulty = 'medium';
            }
            
            data.push(item);
        });
        
        console.log(`✅ Parsed ${data.length} ${type} items`);
        return data;
    }

    extractCategoryFromTitle(title) {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('preamble')) return 'fundamentals';
        if (titleLower.includes('rights')) return 'rights';
        if (titleLower.includes('directive')) return 'governance';
        if (titleLower.includes('union') || titleLower.includes('state')) return 'federalism';
        if (titleLower.includes('amendment')) return 'amendments';
        if (titleLower.includes('separation')) return 'governance';
        return 'general';
    }

    // Chat functionality
    handleChatSubmit(e) {
        e.preventDefault();
        const input = document.getElementById('userInput');
        if (!input) return;
        
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
        }, 1000 + Math.random() * 1000);
    }

    findAnswer(question) {
        const lowerQuestion = question.toLowerCase();
        
        const qaMatch = this.qaDatabase.find(qa => 
            lowerQuestion.includes(qa.question.toLowerCase()) ||
            qa.keywords.some(keyword => lowerQuestion.includes(keyword.toLowerCase()))
        );
        
        if (qaMatch) {
            return qaMatch.answer;
        }
        
        return "I couldn't find a specific answer to your question. Please try rephrasing it or browse through our articles section for more detailed information about the Indian Constitution.";
    }

    addMessage(sender, content) {
        const chatWindow = document.getElementById('chatWindow');
        if (!chatWindow) return '';
        
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
        if (!chatWindow) return '';
        
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

    // Quiz functionality
    startQuiz() {
        if (this.quizDatabase.length === 0) {
            alert('No quiz questions available. Please add some questions first.');
            return;
        }

        this.currentQuiz = [...this.quizDatabase].sort(() => Math.random() - 0.5);
        this.quizScore = 0;
        this.currentQuestionIndex = 0;

        const quizWelcome = document.querySelector('.quiz-welcome');
        const quizStats = document.getElementById('quizStats');
        
        if (quizWelcome) quizWelcome.style.display = 'none';
        if (quizStats) quizStats.style.display = 'flex';
        
        this.showQuestion();
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.currentQuiz.length) {
            this.showQuizResults();
            return;
        }

        const question = this.currentQuiz[this.currentQuestionIndex];
        const options = question.options || [];

        const currentQuestionEl = document.getElementById('currentQuestion');
        const totalQuestionsEl = document.getElementById('totalQuestions');
        const currentScoreEl = document.getElementById('currentScore');

        if (currentQuestionEl) currentQuestionEl.textContent = this.currentQuestionIndex + 1;
        if (totalQuestionsEl) totalQuestionsEl.textContent = this.currentQuiz.length;
        if (currentScoreEl) currentScoreEl.textContent = this.quizScore;

        const quizContent = document.getElementById('quizContent');
        if (!quizContent) return;
        
        quizContent.innerHTML = `
            <div class="quiz-question">
                <h3>Question ${this.currentQuestionIndex + 1}</h3>
                <p class="question-text">${question.question}</p>
                <div class="quiz-options">
                    ${options.map((option, index) => `
                        <button class="quiz-option" data-index="${index}">
                            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                            <span class="option-text">${option}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectAnswer(e));
        });
    }

    selectAnswer(e) {
        const selectedIndex = parseInt(e.currentTarget.dataset.index);
        const question = this.currentQuiz[this.currentQuestionIndex];
        const correctAnswer = parseInt(question.correctAnswer);
        const isCorrect = selectedIndex === correctAnswer;

        document.querySelectorAll('.quiz-option').forEach(option => {
            option.disabled = true;
            const index = parseInt(option.dataset.index);
            if (index === correctAnswer) {
                option.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                option.classList.add('incorrect');
            }
        });

        if (isCorrect) {
            this.quizScore++;
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn--primary';
        nextBtn.style.marginTop = '16px';
        nextBtn.innerHTML = `${this.currentQuestionIndex === this.currentQuiz.length - 1 ? 'Finish Quiz' : 'Next Question'}`;
        nextBtn.addEventListener('click', () => this.nextQuestion());
        document.querySelector('.quiz-question').appendChild(nextBtn);
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.showQuestion();
    }

    showQuizResults() {
        const percentage = Math.round((this.quizScore / this.currentQuiz.length) * 100);
        
        const quizContent = document.getElementById('quizContent');
        if (!quizContent) return;
        
        quizContent.innerHTML = `
            <div class="quiz-results">
                <h3>Quiz Complete!</h3>
                <div class="result-score">
                    <span class="score-number">${this.quizScore}</span>
                    <span class="score-total">/ ${this.currentQuiz.length}</span>
                </div>
                <div class="result-percentage">${percentage}%</div>
                <div class="result-actions">
                    <button id="retakeQuizBtn" class="btn btn--primary">Take Again</button>
                    <button id="backToQuizBtn" class="btn btn--secondary">Back to Quiz Home</button>
                </div>
            </div>
        `;

        const retakeBtn = document.getElementById('retakeQuizBtn');
        const backBtn = document.getElementById('backToQuizBtn');
        
        if (retakeBtn) retakeBtn.addEventListener('click', () => this.startQuiz());
        if (backBtn) backBtn.addEventListener('click', () => this.resetQuizUI());
    }

    resetQuizUI() {
        const quizWelcome = document.querySelector('.quiz-welcome');
        const quizStats = document.getElementById('quizStats');
        const quizContent = document.getElementById('quizContent');
        
        if (quizWelcome) quizWelcome.style.display = 'block';
        if (quizStats) quizStats.style.display = 'none';
        if (quizContent) {
            quizContent.innerHTML = `
                <div class="quiz-welcome">
                    <i class="fas fa-puzzle-piece" style="font-size: 4rem; color: var(--color-primary); margin-bottom: 16px;"></i>
                    <h3>Ready to test your knowledge?</h3>
                    <p>Challenge yourself with questions about the Indian Constitution</p>
                    <button id="startQuizBtn" class="btn btn--primary btn--lg">
                        <i class="fas fa-play"></i> Start Quiz
                    </button>
                </div>
            `;
            
            const startBtn = document.getElementById('startQuizBtn');
            if (startBtn) startBtn.addEventListener('click', () => this.startQuiz());
        }
    }

    // Theme Management Functions
    setupThemeEventListeners() {
        const colorInputs = [
            'primaryColor', 'primaryHover', 'secondaryColor', 'backgroundColor', 
            'surfaceColor', 'textColor', 'textSecondary', 'borderColor',
            'successColor', 'errorColor', 'warningColor', 'infoColor', 'cardBorder'
        ];

        colorInputs.forEach(inputId => {
            const element = document.getElementById(inputId);
            if (element) {
                element.addEventListener('input', (e) => this.updateColorVariable(inputId, e.target.value));
                element.addEventListener('change', (e) => this.updateColorVariable(inputId, e.target.value));
            }
        });

        document.querySelectorAll('.theme-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.closest('.theme-preset').dataset.theme;
                if (theme) {
                    this.applyThemePreset(theme);
                }
            });
        });
    }

    updateColorVariable(property, value) {
        const cssVarMap = {
            primaryColor: '--color-primary',
            primaryHover: '--color-primary-hover', 
            secondaryColor: '--color-secondary',
            backgroundColor: '--color-background',
            surfaceColor: '--color-surface',
            textColor: '--color-text',
            textSecondary: '--color-text-secondary',
            borderColor: '--color-border',
            successColor: '--color-success',
            errorColor: '--color-error',
            warningColor: '--color-warning',
            infoColor: '--color-info',
            cardBorder: '--color-card-border'
        };

        const cssVariable = cssVarMap[property];
        if (cssVariable) {
            document.documentElement.style.setProperty(cssVariable, value);
            this.updateColorPreview(property, value);
            this.saveCurrentColors();
        }
    }

    updateColorPreview(property, value) {
        const preview = document.getElementById(property + 'Preview');
        if (preview) {
            preview.style.backgroundColor = value;
            preview.textContent = value.toUpperCase();
        }
    }

    applyThemePreset(themeName) {
        const themes = {
            default: {
                primaryColor: '#218380',
                primaryHover: '#1d7471',
                secondaryColor: '#e91e63',
                backgroundColor: '#fafafa',
                surfaceColor: '#ffffff',
                textColor: '#212121',
                textSecondary: '#757575',
                borderColor: '#e0e0e0',
                successColor: '#218380',
                errorColor: '#c01530',
                warningColor: '#a84b2f',
                infoColor: '#626c71',
                cardBorder: '#e0e0e0'
            },
            dark: {
                primaryColor: '#32b8c6',
                primaryHover: '#2da6b2',
                secondaryColor: '#ff5489',
                backgroundColor: '#1f2121',
                surfaceColor: '#262828',
                textColor: '#f5f5f5',
                textSecondary: '#a7a9a9',
                borderColor: '#777c7c',
                successColor: '#32b8c6',
                errorColor: '#ff5459',
                warningColor: '#e68161',
                infoColor: '#a7a9a9',
                cardBorder: '#777c7c'
            }
        };

        const selectedTheme = themes[themeName] || themes.default;
        
        Object.entries(selectedTheme).forEach(([property, value]) => {
            const input = document.getElementById(property);
            if (input) {
                input.value = value;
                this.updateColorVariable(property, value);
            }
        });

        document.querySelectorAll('.theme-preset').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === themeName);
        });

        this.currentTheme = themeName;
    }

    saveCurrentColors() {
        const currentColors = {};
        const colorInputs = [
            'primaryColor', 'primaryHover', 'secondaryColor', 'backgroundColor', 
            'surfaceColor', 'textColor', 'textSecondary', 'borderColor',
            'successColor', 'errorColor', 'warningColor', 'infoColor', 'cardBorder'
        ];
        
        colorInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                currentColors[inputId] = input.value;
            }
        });
        
        localStorage.setItem('constitutionHub_theme', JSON.stringify(currentColors));
    }

    loadCustomThemes() {
        const savedTheme = localStorage.getItem('constitutionHub_theme');
        
        if (savedTheme) {
            const colors = JSON.parse(savedTheme);
            setTimeout(() => {
                Object.entries(colors).forEach(([inputId, value]) => {
                    const input = document.getElementById(inputId);
                    if (input) {
                        input.value = value;
                        this.updateColorVariable(inputId, value);
                    }
                });
            }, 500);
        }
    }

    // Stub implementations for admin functions
    setupFormEventListeners() {
        // Add external source button fix
        setTimeout(() => {
            const addSourceBtn = document.getElementById('addSourceBtn');
            if (addSourceBtn) {
                addSourceBtn.onclick = (e) => {
                    e.preventDefault();
                    this.showSimpleSourceForm();
                };
            }
        }, 1000);
    }

    showSimpleSourceForm() {
        const name = prompt('Enter source name:\n(e.g., "My Constitutional Articles")');
        if (!name) return;
        
        const url = prompt('Enter source URL:\n(Google Drive, GitHub Raw, or direct link)');
        if (!url) return;
        
        const type = prompt('Enter data type:\nType "qa" for Q&A\nType "articles" for Articles\nType "quiz" for Quiz') || 'articles';
        
        let processedUrl = url;
        const driveMatch = url.match(/https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (driveMatch) {
            processedUrl = `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
        }
        
        const newSource = {
            id: Date.now(),
            name: name,
            url: processedUrl,
            type: type,
            format: 'txt',
            enabled: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.externalSources.push(newSource);
        localStorage.setItem('constitutionHub_sources', JSON.stringify(this.externalSources));
        
        alert('✅ External source added successfully!');
        this.renderSourcesList();
    }

    setupBackupEventListeners() {}
    renderQAList() {
        const qaList = document.getElementById('qaList');
        if (qaList) {
            qaList.innerHTML = '<div class="no-data">Q&A management available</div>';
        }
    }
    renderArticleAdminList() {
        const articleList = document.getElementById('articleAdminList');
        if (articleList) {
            articleList.innerHTML = '<div class="no-data">Article management available</div>';
        }
    }
    renderQuizList() {
        const quizList = document.getElementById('quizList');
        if (quizList) {
            quizList.innerHTML = '<div class="no-data">Quiz management available</div>';
        }
    }
    renderSourcesList() {
        const sourcesList = document.getElementById('sourcesList');
        if (!sourcesList) return;

        if (this.externalSources.length === 0) {
            sourcesList.innerHTML = '<div class="no-data">No external sources configured</div>';
            return;
        }

        sourcesList.innerHTML = '';
        this.externalSources.forEach(source => {
            const item = document.createElement('div');
            item.className = 'data-item';
            item.innerHTML = `
                <h4>${source.name} ${source.enabled ? '✓' : '✗ Disabled'}</h4>
                <p><strong>URL:</strong> ${source.url.length > 80 ? source.url.substring(0, 80) + '...' : source.url}</p>
                <small>Type: ${source.type} | Format: ${source.format}</small>
            `;
            sourcesList.appendChild(item);
        });
    }
    renderCustomThemes() {}
    
    updateDataStatus(status) {
        const statusElement = document.getElementById('dataStatus');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }
    
    getTotalDataCount() {
        return this.qaDatabase.length + this.articlesDatabase.length + this.quizDatabase.length;
    }
    
    updateStats() {
        const qaCount = document.getElementById('qaCount');
        const articleCount = document.getElementById('articleCount');
        const quizCount = document.getElementById('quizCount');
        
        if (qaCount) qaCount.textContent = this.qaDatabase.length;
        if (articleCount) articleCount.textContent = this.articlesDatabase.length;
        if (quizCount) quizCount.textContent = this.quizDatabase.length;
    }
    
    loadExternalSourcesFromStorage() {
        const sourcesData = localStorage.getItem('constitutionHub_sources');
        this.externalSources = sourcesData ? JSON.parse(sourcesData) : [];
    }
    
    extractKeywords(text) {
        const commonWords = ['the', 'is', 'are', 'was', 'were', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
        return text.toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 2 && !commonWords.includes(word))
            .slice(0, 5);
    }

    // Default data
    loadDefaultData() {
        this.qaDatabase = [
            {
                id: 1,
                question: "What is the Preamble?",
                answer: "The Preamble is the introductory statement of the Constitution that explains its objectives and declares India as a sovereign, socialist, secular, democratic republic.",
                keywords: ["preamble", "introduction", "objectives"],
                category: "basics",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        
        this.quizDatabase = [
            {
                id: 1,
                question: "How many fundamental rights are guaranteed by the Indian Constitution?",
                options: ["5", "6", "7", "8"],
                correctAnswer: 1,
                explanation: "The Indian Constitution guarantees 6 fundamental rights.",
                category: "rights",
                difficulty: "easy",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        
        this.articlesDatabase = [];
        this.currentArticles = [];
    }
}

// Initialize the application when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing Constitution Hub...');
    app = new ConstitutionHub();
});