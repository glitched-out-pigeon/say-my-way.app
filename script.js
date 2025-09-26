class AdvancedSoundboardApp {
    constructor() {
        this.channels = [];
        this.activeChannelId = null;
        this.currentlyPlaying = null;
        this.isRecording = false;
        this.pendingAudioFile = null;
        this.channelCounter = 1;
        this.activeSection = 'soundboard';
        this.channelSelectionTimer = null;
        this.channelStartTime = null;
        this.logs = [];
        this.sessionStartTime = Date.now();
        this.totalActions = 1; // Starting with system start
        this.moods = [];
        this.sentenceWords = [];
        this.recommendations = {
            sounds: new Map(),
            words: new Map(),
            moods: new Map()
        };

        // Communication words bank
        this.wordBank = [
            'hello', 'goodbye', 'please', 'thank', 'you', 'yes', 'no', 'maybe',
            'good', 'bad', 'happy', 'sad', 'angry', 'excited', 'tired', 'hungry',
            'water', 'food', 'help', 'stop', 'go', 'come', 'here', 'there',
            'now', 'later', 'today', 'tomorrow', 'love', 'like', 'want', 'need',
            'sorry', 'excuse', 'me', 'welcome', 'beautiful', 'amazing', 'great',
            'wonderful', 'terrible', 'okay', 'fine', 'perfect', 'work', 'home',
            'family', 'friend', 'music', 'sound', 'loud', 'quiet', 'fast', 'slow'
        ];

        this.initializeElements();
        this.setupEventListeners();
        this.renderChannels();
        this.renderWordBank();
        this.updateStatus('Advanced Soundboard initialized! 🚀');
        this.addLog('SYSTEM', 'Application started');
        this.startSessionTimer();
        this.loadVoices();
    }

    initializeElements() {
        this.elements = {
            // Header elements
            activeSection: document.getElementById('activeSection'),
            activeChannelName: document.getElementById('activeChannelName'),
            statusText: document.getElementById('statusText'),
            alertBtn: document.getElementById('alertBtn'),

            // Navigation
            iconNavBtns: document.querySelectorAll('.icon-nav-btn'),
            sidebarSections: document.querySelectorAll('.sidebar-section'),
            contentSections: document.querySelectorAll('.content-section'),

            // Soundboard elements
            channelsList: document.getElementById('channelsList'),
            addChannelBtn: document.getElementById('addChannelBtn'),
            clearAllBtn: document.getElementById('clearAllBtn'),
            channelTitle: document.getElementById('channelTitle'),
            channelDescription: document.getElementById('channelDescription'),
            channelTimer: document.getElementById('channelTimer'),
            timerDisplay: document.getElementById('timerDisplay'),
            channelControls: document.getElementById('channelControls'),
            addSoundBtn: document.getElementById('addSoundBtn'),
            soundsGrid: document.getElementById('soundsGrid'),

            // Logs elements
            logsList: document.getElementById('logsList'),
            logsTerminal: document.getElementById('logsTerminal'),
            clearLogsBtn: document.getElementById('clearLogsBtn'),
            totalActions: document.getElementById('totalActions'),
            sessionTime: document.getElementById('sessionTime'),

            // Communication elements
            wordsGrid: document.getElementById('wordsGrid'),
            sentenceBox: document.getElementById('sentenceBox'),
            currentSentenceDisplay: document.getElementById('currentSentenceDisplay'),
            clearSentence: document.getElementById('clearSentence'),
            speakSentence: document.getElementById('speakSentence'),
            speakBtn: document.getElementById('speakBtn'),
            voiceSelect: document.getElementById('voiceSelect'),
            speechRate: document.getElementById('speechRate'),
            rateValue: document.getElementById('rateValue'),

            // Mood elements
            moodSliders: document.getElementById('moodSliders'),
            addMoodBtn: document.getElementById('addMoodBtn'),
            moodDisplay: document.getElementById('moodDisplay'),
            moodVisualization: document.getElementById('moodVisualization'),

            // Recommendations elements
            recommendedSounds: document.getElementById('recommendedSounds'),
            recommendedWords: document.getElementById('recommendedWords'),
            recommendedMoods: document.getElementById('recommendedMoods'),
            refreshRecommendations: document.getElementById('refreshRecommendations'),

            // Modal elements
            createSoundModal: document.getElementById('createSoundModal'),
            closeSoundModalBtn: document.getElementById('closeSoundModalBtn'),
            soundName: document.getElementById('soundName'),
            recordAudioBtn: document.getElementById('recordAudioBtn'),
            importAudioBtn: document.getElementById('importAudioBtn'),
            audioStatus: document.getElementById('audioStatus'),
            audioFileName: document.getElementById('audioFileName'),
            soundImage: document.getElementById('soundImage'),
            imagePreview: document.getElementById('imagePreview'),
            imageFileName: document.getElementById('imageFileName'),
            cancelSoundBtn: document.getElementById('cancelSoundBtn'),
            createSoundBtn: document.getElementById('createSoundBtn'),

            addMoodModal: document.getElementById('addMoodModal'),
            closeMoodModalBtn: document.getElementById('closeMoodModalBtn'),
            moodName: document.getElementById('moodName'),
            moodColor: document.getElementById('moodColor'),
            cancelMoodBtn: document.getElementById('cancelMoodBtn'),
            createMoodBtn: document.getElementById('createMoodBtn'),

            alertModal: document.getElementById('alertModal'),
            closeAlertBtn: document.getElementById('closeAlertBtn'),
            triggerAlert: document.getElementById('triggerAlert'),
            alertPreview: document.getElementById('alertPreview'),

            audioFileInput: document.getElementById('audioFileInput')
        };
    }

    setupEventListeners() {
        // Navigation
        this.elements.iconNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                this.switchSection(section);
            });
        });

        // Soundboard events
        this.elements.addChannelBtn.addEventListener('click', () => this.addChannel());
        this.elements.clearAllBtn.addEventListener('click', () => this.clearAll());
        this.elements.addSoundBtn.addEventListener('click', () => this.openCreateSoundModal());

        // Logs events
        this.elements.clearLogsBtn.addEventListener('click', () => this.clearLogs());

        // Communication events
        this.elements.clearSentence.addEventListener('click', () => this.clearSentence());
        this.elements.speakSentence.addEventListener('click', () => this.speakSentence());
        this.elements.speakBtn.addEventListener('click', () => this.speakSentence());
        this.elements.speechRate.addEventListener('input', (e) => {
            this.elements.rateValue.textContent = e.target.value + 'x';
        });

        // Mood events
        this.elements.addMoodBtn.addEventListener('click', () => this.openAddMoodModal());

        // Recommendations events
        this.elements.refreshRecommendations.addEventListener('click', () => this.updateRecommendations());

        // Sound modal events
        this.elements.closeSoundModalBtn.addEventListener('click', () => this.closeSoundModal());
        this.elements.cancelSoundBtn.addEventListener('click', () => this.closeSoundModal());
        this.elements.createSoundBtn.addEventListener('click', () => this.createSound());
        this.elements.recordAudioBtn.addEventListener('click', () => this.toggleRecording());
        this.elements.importAudioBtn.addEventListener('click', () => this.importAudio());
        this.elements.soundImage.addEventListener('change', (e) => this.handleImagePreview(e));
        this.elements.audioFileInput.addEventListener('change', (e) => this.handleAudioFile(e));

        // Mood modal events
        this.elements.closeMoodModalBtn.addEventListener('click', () => this.closeAddMoodModal());
        this.elements.cancelMoodBtn.addEventListener('click', () => this.closeAddMoodModal());
        this.elements.createMoodBtn.addEventListener('click', () => this.createMood());

        // Alert events
        this.elements.alertBtn.addEventListener('click', () => this.openAlertSystem());
        this.elements.closeAlertBtn.addEventListener('click', () => this.closeAlertSystem());
        this.elements.triggerAlert.addEventListener('click', () => this.triggerSelectedAlert());

        // Alert option selection
        document.querySelectorAll('.alert-option').forEach(option => {
            option.addEventListener('click', () => this.selectAlertOption(option));
        });

        // Setup drag and drop for sentence builder
        this.setupDragAndDrop();

        // Modal backdrop clicks
        [this.elements.createSoundModal, this.elements.addMoodModal, this.elements.alertModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    // Navigation
    switchSection(section) {
        this.activeSection = section;

        // Update icon navigation
        this.elements.iconNavBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === section);
        });

        // Update sidebar sections
        this.elements.sidebarSections.forEach(sidebar => {
            sidebar.classList.toggle('active', sidebar.id === `${section}-section`);
        });

        // Update content sections
        this.elements.contentSections.forEach(content => {
            content.classList.toggle('active', content.id === `${section}-content`);
        });

        // Update header
        const sectionNames = {
            soundboard: 'Soundboard',
            logs: 'Activity Logs',
            communication: 'Text to Speech',
            mood: 'Mood Sliders',
            recommendations: 'Recommendations'
        };

        this.elements.activeSection.textContent = sectionNames[section];
        this.addLog('NAVIGATION', `Switched to ${sectionNames[section]} section`);
        this.updateStatus(`Switched to ${sectionNames[section]} 📍`);
    }

    // Channel Management (Enhanced with Timer)
    addChannel() {
        const channelId = Date.now().toString();
        const channelName = `channel ${this.channelCounter}`;

        const newChannel = {
            id: channelId,
            name: channelName,
            sounds: [],
            isEditing: false
        };

        this.channels.push(newChannel);
        this.channelCounter++;
        this.renderChannels();
        this.selectChannel(channelId);
        this.addLog('CHANNEL', `Created "${channelName}"`);
        this.updateStatus(`Created ${channelName} 📁`);
    }

    selectChannel(channelId) {
        // Stop previous timer if exists
        if (this.channelSelectionTimer) {
            clearInterval(this.channelSelectionTimer);
        }

        this.activeChannelId = channelId;
        this.channelStartTime = Date.now();

        const channel = this.channels.find(c => c.id === channelId);

        if (channel) {
            this.elements.activeChannelName.textContent = `# ${channel.name}`;
            this.elements.channelTitle.textContent = channel.name;
            this.elements.channelDescription.textContent = `${channel.sounds.length} sound${channel.sounds.length !== 1 ? 's' : ''} in this channel`;
            this.elements.channelControls.style.display = 'flex';
            this.elements.channelTimer.style.display = 'block';

            // Start timer
            this.elements.timerDisplay.textContent = '0';
            this.channelSelectionTimer = setInterval(() => {
                const elapsed = Math.floor((Date.now() - this.channelStartTime) / 1000);
                this.elements.timerDisplay.textContent = elapsed;
            }, 1000);

            this.renderChannels();
            this.renderSounds();
            this.addLog('CHANNEL', `Selected "${channel.name}"`);
        }
    }

    // Sound Button Management (Enhanced with Timer Recording)
    toggleSound(sound) {
        const elapsedTime = this.channelStartTime ? 
            Math.floor((Date.now() - this.channelStartTime) / 1000) : 0;

        // Stop if currently playing
        if (this.currentlyPlaying && this.currentlyPlaying.id === sound.id) {
            this.currentlyPlaying.audio.pause();
            this.currentlyPlaying = null;
            this.renderSounds();
            this.addLog('SOUND', `Stopped "${sound.name}"`, elapsedTime);
            this.updateStatus('Sound stopped ⏹️');
            return;
        }

        // Stop any other playing sound
        if (this.currentlyPlaying) {
            this.currentlyPlaying.audio.pause();
        }

        // Play new sound
        const audio = new Audio(sound.audioUrl);
        audio.addEventListener('ended', () => {
            this.currentlyPlaying = null;
            this.renderSounds();
        });

        audio.play();
        this.currentlyPlaying = { id: sound.id, audio };
        this.renderSounds();

        // Record usage for recommendations
        this.recommendations.sounds.set(sound.name, 
            (this.recommendations.sounds.get(sound.name) || 0) + 1);

        this.addLog('SOUND', `Played "${sound.name}"`, elapsedTime);
        this.updateStatus(`Playing: ${sound.name} 🔊`);
    }

    // Logging System
    addLog(action, detail, timer = null) {
        const now = new Date();
        const timeString = now.toTimeString().split(' ')[0];

        const logEntry = {
            time: timeString,
            action: action,
            detail: detail,
            timer: timer,
            timestamp: now.getTime()
        };

        this.logs.push(logEntry);
        this.totalActions++;

        // Update sidebar logs
        this.renderSidebarLogs();

        // Update main terminal logs
        this.renderTerminalLogs();

        // Update stats
        this.elements.totalActions.textContent = this.totalActions;
    }

    renderSidebarLogs() {
        const container = this.elements.logsList;
        container.innerHTML = '';

        // Show last 10 logs in sidebar
        const recentLogs = this.logs.slice(-10).reverse();

        recentLogs.forEach(log => {
            const logElement = document.createElement('div');
            logElement.className = 'log-entry';

            logElement.innerHTML = `
                <div class="log-time">${log.time}</div>
                <div class="log-content">
                    <span class="log-action">${log.action}</span>
                    <span class="log-detail">${log.detail}</span>
                    ${log.timer !== null ? `<span class="log-timer">(${log.timer}s)</span>` : ''}
                </div>
            `;

            container.appendChild(logElement);
        });
    }

    renderTerminalLogs() {
        const terminal = this.elements.logsTerminal;
        terminal.innerHTML = '';

        this.logs.forEach(log => {
            const logLine = document.createElement('div');
            logLine.style.cssText = `
                margin-bottom: 5px;
                font-family: 'Courier New', monospace;
                color: var(--text-secondary);
            `;

            const timerText = log.timer !== null ? ` [Timer: ${log.timer}s]` : '';
            logLine.innerHTML = `
                <span style="color: var(--text-muted);">[${log.time}]</span>
                <span style="color: var(--secondary-cyan); font-weight: bold;">${log.action}:</span>
                <span>${log.detail}</span>
                <span style="color: var(--tertiary-pink);">${timerText}</span>
            `;

            terminal.appendChild(logLine);
        });

        // Auto-scroll to bottom
        terminal.scrollTop = terminal.scrollHeight;
    }

    clearLogs() {
        if (confirm('Clear all logs?')) {
            this.logs = [];
            this.totalActions = 0;
            this.renderSidebarLogs();
            this.renderTerminalLogs();
            this.elements.totalActions.textContent = '0';
            this.updateStatus('Logs cleared 🧹');
        }
    }

    startSessionTimer() {
        setInterval(() => {
            const elapsed = Date.now() - this.sessionStartTime;
            const hours = Math.floor(elapsed / 3600000);
            const minutes = Math.floor((elapsed % 3600000) / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);

            this.elements.sessionTime.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // Communication System
    renderWordBank() {
        const container = this.elements.wordsGrid;
        container.innerHTML = '';

        this.wordBank.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-item';
            wordElement.draggable = true;
            wordElement.textContent = word;

            const speakBtn = document.createElement('button');
            speakBtn.className = 'word-speak-btn';
            speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            speakBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.speakText(word);
            });

            wordElement.appendChild(speakBtn);

            wordElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', word);
                wordElement.classList.add('dragging');
            });

            wordElement.addEventListener('dragend', () => {
                wordElement.classList.remove('dragging');
            });

            container.appendChild(wordElement);
        });
    }

    setupDragAndDrop() {
        const sentenceBox = this.elements.sentenceBox;

        sentenceBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            sentenceBox.classList.add('drag-over');
        });

        sentenceBox.addEventListener('dragleave', () => {
            sentenceBox.classList.remove('drag-over');
        });

        sentenceBox.addEventListener('drop', (e) => {
            e.preventDefault();
            sentenceBox.classList.remove('drag-over');

            const word = e.dataTransfer.getData('text/plain');
            this.addWordToSentence(word);
        });
    }

    addWordToSentence(word) {
        this.sentenceWords.push(word);
        this.renderSentence();

        // Record usage for recommendations
        this.recommendations.words.set(word, 
            (this.recommendations.words.get(word) || 0) + 1);

        this.addLog('WORD', `Added "${word}" to sentence`);
    }

    renderSentence() {
        const sentenceBox = this.elements.sentenceBox;
        const sentenceDisplay = this.elements.currentSentenceDisplay;

        if (this.sentenceWords.length === 0) {
            sentenceBox.innerHTML = 'Drop words here to build a sentence...';
            sentenceDisplay.textContent = 'No sentence built yet...';
            return;
        }

        sentenceBox.innerHTML = '';

        this.sentenceWords.forEach((word, index) => {
            const wordElement = document.createElement('span');
            wordElement.className = 'sentence-word';
            wordElement.innerHTML = `
                ${word}
                <button class="remove-word-btn" onclick="window.soundboardApp.removeWordFromSentence(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            sentenceBox.appendChild(wordElement);
        });

        sentenceDisplay.textContent = this.sentenceWords.join(' ');
    }

    removeWordFromSentence(index) {
        this.sentenceWords.splice(index, 1);
        this.renderSentence();
        this.addLog('WORD', 'Removed word from sentence');
    }

    clearSentence() {
        this.sentenceWords = [];
        this.renderSentence();
        this.addLog('SENTENCE', 'Cleared sentence');
        this.updateStatus('Sentence cleared 🗑️');
    }

    speakSentence() {
        const text = this.sentenceWords.join(' ');
        if (!text.trim()) {
            this.updateStatus('No sentence to speak ❌');
            return;
        }

        this.speakText(text);
        this.addLog('TTS', `Spoke: "${text}"`);
    }

    speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = this.elements.voiceSelect.value;
            const voices = speechSynthesis.getVoices();

            if (selectedVoice) {
                utterance.voice = voices.find(voice => voice.name === selectedVoice);
            }

            utterance.rate = parseFloat(this.elements.speechRate.value);
            speechSynthesis.speak(utterance);

            this.updateStatus(`Speaking: "${text}" 🗣️`);
        } else {
            this.updateStatus('Text-to-speech not supported ❌');
        }
    }

    loadVoices() {
        const populateVoices = () => {
            const voices = speechSynthesis.getVoices();
            this.elements.voiceSelect.innerHTML = '';

            voices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} (${voice.lang})`;
                this.elements.voiceSelect.appendChild(option);
            });
        };

        populateVoices();
        speechSynthesis.onvoiceschanged = populateVoices;
    }

    // Mood System
    openAddMoodModal() {
        this.elements.addMoodModal.classList.add('active');
        this.elements.moodName.focus();
    }

    closeAddMoodModal() {
        this.elements.addMoodModal.classList.remove('active');
        this.elements.moodName.value = '';
        this.elements.moodColor.value = '#8b5cf6';
    }

    createMood() {
        const name = this.elements.moodName.value.trim();
        const color = this.elements.moodColor.value;

        if (!name) {
            this.updateStatus('Please enter a mood name ❌');
            return;
        }

        const mood = {
            id: Date.now().toString(),
            name: name,
            value: 50,
            color: color
        };

        this.moods.push(mood);
        this.renderMoodSliders();
        this.closeAddMoodModal();
        this.addLog('MOOD', `Created "${name}" mood slider`);
        this.updateStatus(`Created "${name}" mood slider ✅`);
    }

    renderMoodSliders() {
        const container = this.elements.moodSliders;
        container.innerHTML = '';

        this.moods.forEach(mood => {
            const moodElement = document.createElement('div');
            moodElement.className = 'mood-slider-item';

            moodElement.innerHTML = `
                <div class="mood-slider-header">
                    <span class="mood-name">${mood.name}</span>
                    <div>
                        <span class="mood-value">${mood.value}%</span>
                        <button class="delete-mood-btn" onclick="window.soundboardApp.deleteMood('${mood.id}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <input type="range" class="mood-slider" min="0" max="100" value="${mood.value}" 
                       style="background: linear-gradient(to right, ${mood.color} 0%, ${mood.color} ${mood.value}%, var(--bg-primary) ${mood.value}%, var(--bg-primary) 100%);"
                       onInput="window.soundboardApp.updateMoodValue('${mood.id}', this.value, this)">
            `;

            container.appendChild(moodElement);
        });

        this.updateMoodDisplay();
    }

    updateMoodValue(moodId, value, sliderElement) {
        const mood = this.moods.find(m => m.id === moodId);
        if (mood) {
            mood.value = parseInt(value);

            // Update visual feedback
            sliderElement.style.background = 
                `linear-gradient(to right, ${mood.color} 0%, ${mood.color} ${value}%, var(--bg-primary) ${value}%, var(--bg-primary) 100%)`;

            // Update value display
            const valueSpan = sliderElement.parentElement.querySelector('.mood-value');
            valueSpan.textContent = `${value}%`;

            this.updateMoodDisplay();

            // Record usage for recommendations
            this.recommendations.moods.set(mood.name, 
                (this.recommendations.moods.get(mood.name) || 0) + 1);

            this.addLog('MOOD', `Adjusted "${mood.name}" to ${value}%`);
        }
    }

    updateMoodDisplay() {
        if (this.moods.length === 0) {
            this.elements.moodDisplay.textContent = 'No mood sliders created yet';
            return;
        }

        const moodSummary = this.moods
            .map(mood => `${mood.name}: ${mood.value}%`)
            .join(', ');

        this.elements.moodDisplay.textContent = moodSummary;
    }

    deleteMood(moodId) {
        const mood = this.moods.find(m => m.id === moodId);
        if (mood && confirm(`Delete "${mood.name}" mood slider?`)) {
            this.moods = this.moods.filter(m => m.id !== moodId);
            this.renderMoodSliders();
            this.addLog('MOOD', `Deleted "${mood.name}" mood slider`);
            this.updateStatus(`Deleted "${mood.name}" mood slider 🗑️`);
        }
    }

    // Recommendations System
    updateRecommendations() {
        this.renderRecommendations();
        this.addLog('SYSTEM', 'Updated recommendations');
        this.updateStatus('Recommendations refreshed 🔄');
    }

    renderRecommendations() {
        // Most used sounds
        const topSounds = Array.from(this.recommendations.sounds.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        this.elements.recommendedSounds.innerHTML = '';
        topSounds.forEach(([sound, count]) => {
            const item = document.createElement('div');
            item.className = 'recommendation-item';
            item.innerHTML = `
                <span>${sound}</span>
                <span class="recommendation-count">${count}</span>
            `;
            this.elements.recommendedSounds.appendChild(item);
        });

        // Most used words
        const topWords = Array.from(this.recommendations.words.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        this.elements.recommendedWords.innerHTML = '';
        topWords.forEach(([word, count]) => {
            const item = document.createElement('div');
            item.className = 'recommendation-item';
            item.innerHTML = `
                <span>${word}</span>
                <span class="recommendation-count">${count}</span>
            `;
            item.addEventListener('click', () => this.addWordToSentence(word));
            this.elements.recommendedWords.appendChild(item);
        });

        // Most used moods
        const topMoods = Array.from(this.recommendations.moods.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        this.elements.recommendedMoods.innerHTML = '';
        topMoods.forEach(([mood, count]) => {
            const item = document.createElement('div');
            item.className = 'recommendation-item';
            item.innerHTML = `
                <span>${mood}</span>
                <span class="recommendation-count">${count}</span>
            `;
            this.elements.recommendedMoods.appendChild(item);
        });

        if (topSounds.length === 0 && topWords.length === 0 && topMoods.length === 0) {
            [this.elements.recommendedSounds, this.elements.recommendedWords, this.elements.recommendedMoods].forEach(container => {
                container.innerHTML = '<div class="recommendation-item">No data yet</div>';
            });
        }
    }

    // Enhanced Sound Creation (Moved record/import to modal)
    openCreateSoundModal() {
        if (!this.activeChannelId) {
            this.updateStatus('❌ Please select a channel first');
            return;
        }

        this.elements.createSoundModal.classList.add('active');
        this.elements.soundName.focus();
    }

    closeSoundModal() {
        this.elements.createSoundModal.classList.remove('active');
        this.resetSoundModal();
    }

    resetSoundModal() {
        this.elements.soundName.value = '';
        this.elements.audioFileName.textContent = 'No audio selected';
        this.elements.soundImage.value = '';
        this.elements.imagePreview.style.backgroundImage = '';
        this.elements.imagePreview.classList.remove('has-image');
        this.elements.imageFileName.textContent = 'No image selected';
        this.elements.recordAudioBtn.classList.remove('recording');
        this.elements.recordAudioBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Record Audio</span>';
        this.pendingAudioFile = null;
        this.currentImageFile = null;

        if (this.isRecording) {
            this.stopRecording();
        }
    }

    async toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            await this.startRecording();
        }
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.recordedChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'audio/wav' });
                this.pendingAudioFile = blob;
                this.elements.audioFileName.textContent = 'Recorded audio ready';
                this.elements.audioStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Recording completed</span>';
            };

            this.mediaRecorder.start();
            this.isRecording = true;

            this.elements.recordAudioBtn.classList.add('recording');
            this.elements.recordAudioBtn.innerHTML = '<i class="fas fa-stop"></i><span>Stop Recording</span>';
            this.elements.audioStatus.innerHTML = '<i class="fas fa-microphone"></i><span>Recording in progress...</span>';

        } catch (error) {
            this.updateStatus('❌ Microphone access denied');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());

            this.isRecording = false;
            this.elements.recordAudioBtn.classList.remove('recording');
            this.elements.recordAudioBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Record Audio</span>';
        }
    }

    importAudio() {
        this.elements.audioFileInput.click();
    }

    handleAudioFile(event) {
        const file = event.target.files[0];
        if (file) {
            this.pendingAudioFile = file;
            this.elements.audioFileName.textContent = file.name;
            this.elements.audioStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Audio file selected</span>';
        }
    }

    handleImagePreview(event) {
        const file = event.target.files[0];
        if (file) {
            this.currentImageFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                this.elements.imagePreview.style.backgroundImage = `url(${e.target.result})`;
                this.elements.imagePreview.classList.add('has-image');
                this.elements.imageFileName.textContent = file.name;
            };
            reader.readAsDataURL(file);
        }
    }

    createSound() {
        const name = this.elements.soundName.value.trim();

        if (!name) {
            this.updateStatus('❌ Please enter a sound name');
            return;
        }

        if (!this.pendingAudioFile) {
            this.updateStatus('❌ No audio file selected or recorded');
            return;
        }

        const activeChannel = this.channels.find(c => c.id === this.activeChannelId);
        if (!activeChannel) return;

        const sound = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: name,
            audioUrl: URL.createObjectURL(this.pendingAudioFile),
            imageUrl: this.currentImageFile ? URL.createObjectURL(this.currentImageFile) : null
        };

        activeChannel.sounds.push(sound);
        this.elements.channelDescription.textContent = `${activeChannel.sounds.length} sound${activeChannel.sounds.length !== 1 ? 's' : ''} in this channel`;

        this.closeSoundModal();
        this.renderSounds();

        const elapsedTime = this.channelStartTime ? 
            Math.floor((Date.now() - this.channelStartTime) / 1000) : 0;
        this.addLog('SOUND', `Created "${name}" in ${activeChannel.name}`, elapsedTime);
        this.updateStatus(`✅ Created "${name}" in ${activeChannel.name}`);
    }

    // Existing methods (renderChannels, renderSounds, etc.) remain the same
    // ... [Include all previous methods for channels, sounds, alerts, etc.]

    renderChannels() {
        const container = this.elements.channelsList;
        container.innerHTML = '';

        this.channels.forEach(channel => {
            const channelElement = document.createElement('div');
            channelElement.className = `channel-item ${this.activeChannelId === channel.id ? 'active' : ''}`;
            channelElement.dataset.channelId = channel.id;

            channelElement.innerHTML = `
                <div class="channel-icon">
                    <i class="fas fa-hashtag"></i>
                </div>
                <div class="channel-name">
                    ${channel.isEditing ? 
                        `<input type="text" class="channel-name-input" value="${channel.name}">` :
                        channel.name
                    }
                </div>
                <div class="channel-actions">
                    <button class="channel-action-btn edit-btn" title="Edit Channel">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="channel-action-btn delete-btn" title="Delete Channel">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            // Event listeners for channel interactions
            if (!channel.isEditing) {
                channelElement.addEventListener('click', (e) => {
                    if (!e.target.closest('.channel-actions')) {
                        this.selectChannel(channel.id);
                    }
                });
            }

            const editBtn = channelElement.querySelector('.edit-btn');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.startEditingChannel(channel.id);
            });

            const deleteBtn = channelElement.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteChannel(channel.id);
            });

            if (channel.isEditing) {
                const input = channelElement.querySelector('.channel-name-input');
                input.addEventListener('blur', () => {
                    this.saveChannelName(channel.id, input.value);
                });

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        this.saveChannelName(channel.id, input.value);
                    } else if (e.key === 'Escape') {
                        this.cancelEditingChannel(channel.id);
                    }
                });
            }

            container.appendChild(channelElement);
        });
    }

    renderSounds() {
        const grid = this.elements.soundsGrid;

        if (!this.activeChannelId) {
            grid.innerHTML = `
                <div class="welcome-message">
                    <div class="welcome-icon">
                        <i class="fas fa-music"></i>
                    </div>
                    <h3>Welcome to Your Advanced Soundboard!</h3>
                    <p>Create a channel to get started with your sound collection.</p>
                    <button class="welcome-create-btn" onclick="document.getElementById('addChannelBtn').click()">
                        <i class="fas fa-plus"></i>
                        Create First Channel
                    </button>
                </div>
            `;
            return;
        }

        const activeChannel = this.channels.find(c => c.id === this.activeChannelId);
        if (!activeChannel) return;

        grid.innerHTML = '';

        if (activeChannel.sounds.length === 0) {
            grid.innerHTML = `
                <div class="welcome-message">
                    <div class="welcome-icon">
                        <i class="fas fa-music"></i>
                    </div>
                    <h3>No Sounds Yet</h3>
                    <p>Add your first sound to this channel!</p>
                </div>
            `;
            return;
        }

        activeChannel.sounds.forEach(sound => {
            const soundElement = this.createSoundElement(sound);
            grid.appendChild(soundElement);
        });
    }

    createSoundElement(sound) {
        const element = document.createElement('div');
        element.className = `sound-button ${this.currentlyPlaying?.id === sound.id ? 'playing' : ''}`;
        element.dataset.soundId = sound.id;

        element.innerHTML = `
            ${sound.imageUrl ? 
                `<img src="${sound.imageUrl}" alt="${sound.name}" class="sound-image">` :
                `<div class="sound-icon"><i class="fas fa-music"></i></div>`
            }
            <div class="sound-name">${sound.name}</div>
        `;

        element.addEventListener('click', () => this.toggleSound(sound));
        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.deleteSound(sound.id);
        });

        return element;
    }

    // Additional utility methods
    startEditingChannel(channelId) {
        const channel = this.channels.find(c => c.id === channelId);
        if (channel) {
            channel.isEditing = true;
            this.renderChannels();

            setTimeout(() => {
                const input = document.querySelector(`[data-channel-id="${channelId}"] .channel-name-input`);
                if (input) {
                    input.focus();
                    input.select();
                }
            }, 0);
        }
    }

    saveChannelName(channelId, newName) {
        const channel = this.channels.find(c => c.id === channelId);
        if (channel && newName.trim()) {
            const oldName = channel.name;
            channel.name = newName.trim();
            channel.isEditing = false;

            if (this.activeChannelId === channelId) {
                this.elements.activeChannelName.textContent = `# ${channel.name}`;
                this.elements.channelTitle.textContent = channel.name;
            }

            this.renderChannels();
            this.addLog('CHANNEL', `Renamed "${oldName}" to "${channel.name}"`);
            this.updateStatus(`Channel renamed to "${channel.name}" ✏️`);
        }
    }

    cancelEditingChannel(channelId) {
        const channel = this.channels.find(c => c.id === channelId);
        if (channel) {
            channel.isEditing = false;
            this.renderChannels();
        }
    }

    deleteChannel(channelId) {
        const channel = this.channels.find(c => c.id === channelId);
        if (channel && confirm(`Delete channel "${channel.name}" and all its sounds?`)) {
            this.channels = this.channels.filter(c => c.id !== channelId);

            if (this.activeChannelId === channelId) {
                this.activeChannelId = null;
                this.elements.activeChannelName.textContent = 'Select a Channel';
                this.elements.channelTitle.textContent = 'Welcome to Soundboard';
                this.elements.channelDescription.textContent = 'Select a channel from the sidebar to view sound buttons';
                this.elements.channelControls.style.display = 'none';
                this.elements.channelTimer.style.display = 'none';

                if (this.channelSelectionTimer) {
                    clearInterval(this.channelSelectionTimer);
                }
            }

            this.renderChannels();
            this.renderSounds();
            this.addLog('CHANNEL', `Deleted "${channel.name}"`);
            this.updateStatus(`Channel "${channel.name}" deleted 🗑️`);
        }
    }

    deleteSound(soundId) {
        if (!this.activeChannelId) return;

        const activeChannel = this.channels.find(c => c.id === this.activeChannelId);
        if (!activeChannel) return;

        const sound = activeChannel.sounds.find(s => s.id === soundId);
        if (sound && confirm(`Delete sound "${sound.name}"?`)) {
            if (this.currentlyPlaying && this.currentlyPlaying.id === soundId) {
                this.currentlyPlaying.audio.pause();
                this.currentlyPlaying = null;
            }

            if (sound.audioUrl) URL.revokeObjectURL(sound.audioUrl);
            if (sound.imageUrl) URL.revokeObjectURL(sound.imageUrl);

            activeChannel.sounds = activeChannel.sounds.filter(s => s.id !== soundId);
            this.elements.channelDescription.textContent = `${activeChannel.sounds.length} sound${activeChannel.sounds.length !== 1 ? 's' : ''} in this channel`;

            this.renderSounds();
            this.addLog('SOUND', `Deleted "${sound.name}"`);
            this.updateStatus(`Sound "${sound.name}" deleted 🗑️`);
        }
    }

    clearAll() {
        if (this.channels.length === 0) return;

        if (confirm('Delete all channels and sounds? This cannot be undone.')) {
            if (this.currentlyPlaying) {
                this.currentlyPlaying.audio.pause();
                this.currentlyPlaying = null;
            }

            this.channels.forEach(channel => {
                channel.sounds.forEach(sound => {
                    if (sound.audioUrl) URL.revokeObjectURL(sound.audioUrl);
                    if (sound.imageUrl) URL.revokeObjectURL(sound.imageUrl);
                });
            });

            this.channels = [];
            this.activeChannelId = null;
            this.channelCounter = 1;

            this.elements.activeChannelName.textContent = 'Select a Channel';
            this.elements.channelTitle.textContent = 'Welcome to Soundboard';
            this.elements.channelDescription.textContent = 'Select a channel from the sidebar to view sound buttons';
            this.elements.channelControls.style.display = 'none';
            this.elements.channelTimer.style.display = 'none';

            if (this.channelSelectionTimer) {
                clearInterval(this.channelSelectionTimer);
            }

            this.renderChannels();
            this.renderSounds();
            this.addLog('SYSTEM', 'Cleared all channels and sounds');
            this.updateStatus('🧹 All channels and sounds cleared!');
        }
    }

    // Alert system methods
    openAlertSystem() {
        this.elements.alertModal.classList.add('active');
    }

    closeAlertSystem() {
        this.elements.alertModal.classList.remove('active');
        this.selectedAlertType = null;
        this.elements.triggerAlert.disabled = true;
        document.querySelectorAll('.alert-option').forEach(option => {
            option.classList.remove('selected');
        });
        this.elements.alertPreview.textContent = 'Select an alert type above';
    }

    selectAlertOption(option) {
        document.querySelectorAll('.alert-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        this.selectedAlertType = option.classList.contains('emergency-alert') ? 'emergency' :
                                 option.classList.contains('warning-alert') ? 'warning' :
                                 option.classList.contains('info-alert') ? 'info' : 'custom';

        const messages = {
            emergency: '🚨 EMERGENCY ALERT: Immediate attention required!',
            warning: '⚠️ WARNING: Please review the current situation.',
            info: 'ℹ️ INFORMATION: System notification update.',
            custom: '🔔 CUSTOM ALERT: User-defined notification.'
        };

        this.elements.alertPreview.textContent = messages[this.selectedAlertType];
        this.elements.triggerAlert.disabled = false;
    }

    triggerSelectedAlert() {
        if (!this.selectedAlertType) return;

        const messages = {
            emergency: '🚨 EMERGENCY ALERT TRIGGERED!',
            warning: '⚠️ Warning alert sent to all users.',
            info: 'ℹ️ Information alert broadcast.',
            custom: '🔔 Custom alert activated.'
        };

        this.addLog('ALERT', `Triggered ${this.selectedAlertType} alert`);
        this.updateStatus(messages[this.selectedAlertType]);
        this.closeAlertSystem();

        // Visual feedback
        document.body.style.animation = 'alert-flash 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }

    updateStatus(message) {
        this.elements.statusText.textContent = message;

        setTimeout(() => {
            this.elements.statusText.textContent = 'Ready';
        }, 3000);
    }
}

// Add alert flash animation
const style = document.createElement('style');
style.textContent = `
    @keyframes alert-flash {
        0%, 100% { background-color: var(--bg-primary); }
        50% { background-color: rgba(239, 68, 68, 0.1); }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.soundboardApp = new AdvancedSoundboardApp();
});