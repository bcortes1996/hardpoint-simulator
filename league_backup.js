document.addEventListener('DOMContentLoaded', () => {
// TOP of league.js
const { Client, Account, ID, Databases, Query } = Appwrite;

// Initialize Appwrite client with secure configuration
const client = new Client();
let account, databases;
let DATABASE_ID, LEAGUES_COLLECTION_ID, LEAGUE_MEMBERS_COLLECTION_ID;

// Use the secure configuration system
try {
    // Wait a moment for config to initialize if needed
    if (!window.appwriteConfig) {
        console.warn('⚠️  Configuration system not ready, retrying...');
        setTimeout(() => {
            if (!window.appwriteConfig) {
                console.error('❌ Configuration system still not loaded after retry');
                return;
            }
            initializeAppwriteClient();
        }, 100);
    } else {
        initializeAppwriteClient();
    }
} catch (error) {
    console.error('❌ Failed to initialize Appwrite client:', error);
}

function initializeAppwriteClient() {
    try {
        const config = window.appwriteConfig.getAppwriteConfig();
        
        client
            .setEndpoint(config.endpoint)
            .setProject(config.projectId);
        
        account = new Account(client);
        databases = new Databases(client);

        // Use secure configuration for database IDs
        DATABASE_ID = window.appwriteConfig.getDatabaseId();
        LEAGUES_COLLECTION_ID = window.appwriteConfig.getLeaguesCollectionId();
        LEAGUE_MEMBERS_COLLECTION_ID = window.appwriteConfig.getMembersCollectionId();

        // Log configuration status for debugging (without exposing sensitive data)
        if (window.appwriteConfig.isDevelopment) {
            window.appwriteConfig.logConfigStatus();
        }
        
        console.log('✅ Appwrite client initialized successfully');
        
        // Initialize the app now that everything is ready
        init();
        
    } catch (error) {
        console.error('❌ Failed to initialize Appwrite client:', error);
        // Create fallback objects to prevent further errors
        account = {
            createEmailPasswordSession: () => Promise.reject(new Error('Not configured')),
            create: () => Promise.reject(new Error('Not configured')),
            get: () => Promise.reject(new Error('Not configured')),
            deleteSession: () => Promise.reject(new Error('Not configured'))
        };
        databases = {
            createDocument: () => Promise.reject(new Error('Not configured')),
            updateDocument: () => Promise.reject(new Error('Not configured')),
            listDocuments: () => Promise.reject(new Error('Not configured')),
            getDocument: () => Promise.reject(new Error('Not configured'))
        };
        DATABASE_ID = 'fallback';
        LEAGUES_COLLECTION_ID = 'fallback';
        LEAGUE_MEMBERS_COLLECTION_ID = 'fallback';
        
        // Initialize the app anyway for offline functionality
        init();
    }
}

const { Client, Account, ID, Databases, Query } = Appwrite;

// Initialize Appwrite client with secure configuration
const client = new Client();

// Use the secure configuration system
try {
    if (!window.appwriteConfig) {
        throw new Error('Configuration system not loaded. Please ensure config.js is loaded before this script.');
    }
    
    const config = window.appwriteConfig.getAppwriteConfig();
    
    client
        .setEndpoint(config.endpoint)
        .setProject(config.projectId);
    
    console.log('✅ Appwrite client initialized successfully');
} catch (error) {
    console.error('❌ Failed to initialize Appwrite client:', error);
    // Show user-friendly error message
    alert('Configuration error: Unable to connect to the game servers. Please refresh the page or contact support.');
}

const account = new Account(client);
const databases = new Databases(client);

// Use secure configuration for database IDs
const DATABASE_ID = window.appwriteConfig.getDatabaseId();
const LEAGUES_COLLECTION_ID = window.appwriteConfig.getLeaguesCollectionId();
const LEAGUE_MEMBERS_COLLECTION_ID = window.appwriteConfig.getMembersCollectionId();

// Log configuration status for debugging (without exposing sensitive data)
if (window.appwriteConfig.isDevelopment) {
    window.appwriteConfig.logConfigStatus();
}
    
    //=========== GLOBAL STATE & DATABASE ===========
    const TEAM_DATABASE = {
        'faze': { name: "Atlanta FaZe", logo: "https://placehold.co/50x50/E23435/FFFFFF?text=FaZe", color: "#e23435", players: [ { name: "Simp", picture: "images/simp_picture.webp", stats: { Overall: 93, Pace: 80, Efficiency: 88, Objective: 86 } }, { name: "Cellium", picture: "images/cellium_picture.webp",stats: { Overall: 94, Pace: 71, Efficiency: 94, Objective: 81 } }, { name: "Drazah", picture: "images/drazah_picture.webp", stats: { Overall: 91, Pace: 81, Efficiency: 87, Objective: 80 } }, { name: "aBeZy", picture: "images/abezy_picture.webp",stats: { Overall: 90, Pace: 80, Efficiency: 80, Objective: 79 } }, ], substitutes: [] },
        'thieves': { name: "LA Thieves", logo: "https://placehold.co/50x50/ff0000/FFFFFF?text=LAT", color: "#ff0000", players: [ { name: "Envoy", picture: "images/envoy_picture.webp", stats: { Overall: 93, Pace: 81, Efficiency: 80, Objective: 97 } }, { name: "Ghosty", picture: "images/ghosty_picture.webp", stats: { Overall: 94, Pace: 76, Efficiency: 84, Objective: 99 } }, { name: "Scrap", picture: "images/scrap_picture.webp", stats: { Overall: 99, Pace: 93, Efficiency: 91, Objective: 81 } }, { name: "Hydra", picture: "images/hydra_picture.webp", stats: { Overall: 90, Pace: 94, Efficiency: 93, Objective: 69 } }, ], substitutes: [] },
        'optic': { name: "OpTic Texas", logo: "https://placehold.co/50x50/93C94E/000000?text=OpTic", color: "#93c94e", players: [ { name: "Dashy", picture: "images/dashy_picture.webp", stats: { Overall: 96, Pace: 75, Efficiency: 95, Objective: 75 } }, { name: "Kenny", picture: "images/kenny_picture.webp", stats: { Overall: 92, Pace: 85, Efficiency: 88, Objective: 88 } }, { name: "Shotzzy", picture: "images/shotzzy_picture.webp", stats: { Overall: 94, Pace: 98, Efficiency: 90, Objective: 80 } }, { name: "Pred", picture: "images/pred_picture.webp",stats: { Overall: 95, Pace: 92, Efficiency: 94, Objective: 78 } }, ], substitutes: [] },
        'ultra': { name: "Toronto Ultra", logo: "https://placehold.co/50x50/7B42F6/FFFFFF?text=Ultra", color: "#782cf2", players: [ { name: "CleanX", picture: "https://api.dicebear.com/8.x/bottts-neutral/svg?seed=Simp", stats: { Overall: 91, Pace: 95, Efficiency: 89, Objective: 82 } }, { name: "Insight", stats: { Overall: 93, Pace: 70, Efficiency: 92, Objective: 90 } }, { name: "Envoy", stats: { Overall: 93, Pace: 81, Efficiency: 80, Objective: 97 } }, { name: "Scrappy", stats: { Overall: 99, Pace: 93, Efficiency: 91, Objective: 81 } }, ], substitutes: [] },
        'nysl': { name: "New York Subliners", logo: "https://placehold.co/50x50/F2D649/000000?text=NYSL", color: "#f2d649", players: [ { name: "Viper", picture: "images/dummy_picture.webp", stats: { Overall: 58, Pace: 55, Efficiency: 60, Objective: 51 } }, { name: "Rogue", picture: "images/dummy_picture.webp", stats: { Overall: 56, Pace: 59, Efficiency: 52, Objective: 58 } }, { name: "Spectre", picture: "images/dummy_picture.webp", stats: { Overall: 59, Pace: 51, Efficiency: 57, Objective: 55 } }, { name: "Blaze", picture: "images/dummy_picture.webp", stats: { Overall: 52, Pace: 60, Efficiency: 54, Objective: 53 } }, ], substitutes: [] },
        'breach': { name: "Boston Breach", logo: "https://placehold.co/50x50/004F31/FFFFFF?text=BOS", color: "#004f31", players: [ { name: "Havoc", picture: "images/dummy_picture.webp", stats: { Overall: 55, Pace: 58, Efficiency: 51, Objective: 59 } }, { name: "Jester", picture: "images/dummy_picture.webp",stats: { Overall: 60, Pace: 52, Efficiency: 58, Objective: 54 } }, { name: "Nomad", picture: "images/dummy_picture.webp",stats: { Overall: 53, Pace: 59, Efficiency: 55, Objective: 52 } }, { name: "Frost", picture: "images/dummy_picture.webp",stats: { Overall: 57, Pace: 54, Efficiency: 59, Objective: 57 } }, ], substitutes: [] },
        'ravens': { name: "Carolina Royal Ravens", logo: "https://placehold.co/50x50/00AEEF/FFFFFF?text=CRR", color: "#00aeef", players: [ { name: "Wraith", picture: "images/dummy_picture.webp", stats: { Overall: 58, Pace: 60, Efficiency: 53, Objective: 51 } }, { name: "Cobra", picture: "images/dummy_picture.webp",stats: { Overall: 54, Pace: 51, Efficiency: 59, Objective: 58 } }, { name: "Apex", picture: "images/dummy_picture.webp",stats: { Overall: 59, Pace: 55, Efficiency: 54, Objective: 56 } }, { name: "Omen", picture: "images/dummy_picture.webp",stats: { Overall: 56, Pace: 57, Efficiency: 57, Objective: 53 } }, ], substitutes: [] },
        'legion': { name: "Vegas Legion", logo: "https://placehold.co/50x50/E7B500/000000?text=LV", color: "#e7b500", players: [ { name: "Reaper", picture: "images/dummy_picture.webp", stats: { Overall: 60, Pace: 59, Efficiency: 58, Objective: 54 } }, { name: "Shadow", picture: "images/dummy_picture.webp",stats: { Overall: 52, Pace: 53, Efficiency: 52, Objective: 59 } }, { name: "Ghost", picture: "images/dummy_picture.webp",stats: { Overall: 57, Pace: 58, Efficiency: 56, Objective: 51 } }, { name: "Zenith", picture: "images/dummy_picture.webp",stats: { Overall: 55, Pace: 54, Efficiency: 59, Objective: 57 } }, ], substitutes: [] }
    };

    let selectedTeamA_id = null, selectedTeamB_id = null, playerTeamId = null;
    let gameInterval = null, gameState = {}, teams = {}, simulationSpeed = 1;
    let seriesScore = { teamA: 0, teamB: 0 }, currentGameInSeries = 1;
    const matchFormat = 1; // Best of 5 for all league matches
    let currentMode = 'league';
    let league = {};
    //=========== MULTIPLAYER LEAGUE VARIABLES ===========

let currentLeague = null;
let userLeagueMembership = null;
let availableTeams = [];
let leagueMembers = []; 

    const ui = {
        // Screens
        mainMenuScreen: document.getElementById('main-menu-screen'),
        franchiseSetupScreen: document.getElementById('franchise-setup-screen'),
        leagueHubScreen: document.getElementById('league-hub-screen'),
        simulationScreen: document.getElementById('simulation-screen'),
        postMatchScreen: document.getElementById('post-match-screen'),
        
        
        // Main Menu Buttons
        menuLeagueBtn: document.getElementById('menu-league-btn'),

        // Franchise Setup
        franchiseSelectionGrid: document.getElementById('franchise-selection-grid'),
        yourFranchiseDisplay: document.getElementById('your-franchise-display'),
        startLeagueBtn: document.getElementById('start-league-btn'),
        franchiseBackBtn: document.getElementById('franchise-back-btn'),
        
        // League Hub
        leagueStandingsBody: document.getElementById('league-standings-body'),
        weeklyMatchupsContainer: document.getElementById('weekly-matchups-container'),
        leaguePlayMatchBtn: document.getElementById('league-play-match-btn'),
        leagueBackBtn: document.getElementById('league-back-btn'),
        leagueWeekTitle: document.getElementById('league-week-title'),

        // Simulation
        killfeedContainer: document.getElementById('killfeed-container'),
        seriesScoreDisplay: document.getElementById('series-score-display'),
        seriesScoreText: document.getElementById('series-score-text'),
        seriesFormatText: document.getElementById('series-format-text'),
        seriesTeamAName: document.getElementById('series-teamA-name'),
        seriesTeamBName: document.getElementById('series-teamB-name'),
        matchupTitle: document.getElementById('matchup-title'),
        teamA: { name: document.getElementById('teamA-name'), logo: document.getElementById('teamA-logo'), overall: document.getElementById('teamA-overall'), players: document.getElementById('teamA-players'), score: document.getElementById('teamA-score'), scoreLabel: document.getElementById('teamA-score-label'), },
        teamB: { name: document.getElementById('teamB-name'), logo: document.getElementById('teamB-logo'), overall: document.getElementById('teamB-overall'), players: document.getElementById('teamB-players'), score: document.getElementById('teamB-score'), scoreLabel: document.getElementById('teamB-score-label'), },
        gameTimer: document.getElementById('game-timer'),
        hillTimer: document.getElementById('hill-timer'),
        hillState: document.getElementById('hill-state'),
        eventLog: document.getElementById('event-log-container'),
        startSimBtn: document.getElementById('start-sim-btn'),
        speedToggleBtn: document.getElementById('speed-toggle-btn'),
        hillIndicators: { P1: document.getElementById('hill-p1'), P2: document.getElementById('hill-p2'), P3: document.getElementById('hill-p3'), P4: document.getElementById('hill-p4'), },

        // Post Match
        mvp: { card: document.getElementById('mvp-card'), logo: document.getElementById('mvp-logo'), name: document.getElementById('mvp-name'), team: document.getElementById('mvp-team'), kills: document.getElementById('mvp-kills'), deaths: document.getElementById('mvp-deaths'), hillTime: document.getElementById('mvp-hilltime'), },
        finalScoreboardContainer: document.getElementById('final-scoreboard-container'),
        backToMenuBtn: document.getElementById('back-to-menu-btn'),
        
        // Training tab
        leagueTrainBtn: document.getElementById('league-train-btn'),
        trainingAvailableContainer: document.getElementById('training-available-container'),
        trainingCompletedContainer: document.getElementById('training-completed-container'),
        newTrainingDrillBtns: document.querySelectorAll('.training-drill-btn'),
        trainingProgressContainer: document.getElementById('training-progress-container'),
        trainingProgressBar: document.getElementById('training-progress-bar'),
        trainingResultsModal: document.getElementById('training-results-modal'),
        trainingResultsText: document.getElementById('training-results-text'),
        trainingResultsCloseBtn: document.getElementById('training-results-close-btn'),
        
        // ROSTER tab 
        activeRosterContainer: document.getElementById('active-roster-container'),
        substituteRosterContainer: document.getElementById('substitute-roster-container'),
        
        // MARKET tab
        marketContainer: document.getElementById('market-container'),
        
        // SWAP MODAL
        rosterSwapModal: document.getElementById('roster-swap-modal'),
        rosterSwapTitle: document.getElementById('roster-swap-title'),
        playerToSwapName: document.getElementById('player-to-swap-name'),
        rosterSwapList: document.getElementById('roster-swap-list'),
        rosterSwapCancelBtn: document.getElementById('roster-swap-cancel-btn'),
        
        //Coins
        leagueCoinDisplay: document.getElementById('league-coin-display'),
        
        //League tabs
        leagueTabs: document.querySelectorAll('.league-tab'),
        leagueTabContents: document.querySelectorAll('.league-tab-content'),
        
        // ADD NEW AUTH UI REFERENCES
        userStatusContainer: document.getElementById('user-status-container'),
        loginBtn: document.getElementById('login-btn'),
        signupBtn: document.getElementById('signup-btn'),
        userProfileContainer: document.getElementById('user-profile-container'),
        userEmailDisplay: document.getElementById('user-email-display'),
        logoutBtn: document.getElementById('logout-btn'),
        authTitle: document.getElementById('auth-title'),
        authForm: document.getElementById('auth-form'),
        authErrorMessage: document.getElementById('auth-error-message'),
        authSubmitBtn: document.getElementById('auth-submit-btn'),
        authToggleBtn: document.getElementById('auth-toggle-btn'),
        loginScreen: document.getElementById('login-screen'),
        
        // Multiplayer League UI
        multiplayerLeagueScreen: document.getElementById('multiplayer-league-screen'),
        teamSelectionScreen: document.getElementById('multiplayer-team-selection-screen'),
        createLeagueForm: document.getElementById('create-league-form'),
        joinLeagueForm: document.getElementById('join-league-form'),
        leagueNameInput: document.getElementById('league-name'),
        maxTeamsSelect: document.getElementById('max-teams'),
        leagueIdInput: document.getElementById('league-id'),
        availableTeamsGrid: document.getElementById('available-teams-grid'),
        leagueNameDisplay: document.getElementById('league-name-display'),
        multiplayerBackBtn: document.getElementById('multiplayer-back-btn'),
        teamSelectionBackBtn: document.getElementById('team-selection-back-btn'),
    };
    
    function renderTrainingTab() {
    if (league.trainingCompletedThisWeek) {
        ui.trainingAvailableContainer.classList.add('hidden');
        ui.trainingCompletedContainer.classList.remove('hidden');
    } else {
        ui.trainingAvailableContainer.classList.remove('hidden');
        ui.trainingCompletedContainer.classList.add('hidden');
    }
}
    
    function renderPlayoffBracket() {
    const { semifinals, finals, champion } = league.playoffs;

    // Helper to render a single matchup
    const renderMatchup = (matchId, matchData) => {
        const teamsContainer = document.getElementById(`${matchId}-teams`);
        const playBtn = document.getElementById(`${matchId}-playBtn`);
        teamsContainer.innerHTML = '';
        
        matchData.teams.forEach((teamId, index) => {
            const teamDiv = document.createElement('div');
            teamDiv.className = 'matchup-team';
            if (teamId) {
                const team = TEAM_DATABASE[teamId];
                teamDiv.innerHTML = `<img src="${team.logo}" class="w-6 h-6 rounded-full mr-3"> ${team.name}`;
                if (matchData.winner === teamId) {
                    teamDiv.classList.add('winner');
                }
            } else {
                teamDiv.textContent = 'TBD';
            }
            teamsContainer.appendChild(teamDiv);
        });

        // Handle button state
        const isUserMatch = matchData.teams.includes(league.playerTeamId);
        if (matchData.winner || !matchData.teams.every(t => t)) {
            playBtn.disabled = true;
            playBtn.textContent = matchData.winner ? `Winner: ${TEAM_DATABASE[matchData.winner].name}` : 'Waiting for opponent';
            playBtn.classList.replace('bg-green-600', 'bg-gray-600');
        } else {
            playBtn.disabled = false;
            playBtn.textContent = isUserMatch ? 'Play Your Match' : 'Simulate Match';
            playBtn.classList.replace('bg-gray-600', 'bg-green-600');
            playBtn.dataset.matchId = matchId;
        }
    };

    renderMatchup('sf1', semifinals[0]);
    renderMatchup('sf2', semifinals[1]);
    renderMatchup('finals', finals[0]);

    if (champion) {
        ui.playoffsBracketContainer.classList.add('hidden');
        ui.playoffsChampionDisplay.classList.remove('hidden');
        ui.playoffsChampionDisplay.innerHTML = `🏆 ${TEAM_DATABASE[champion].name} are the League Champions! 🏆`;
    }
}

function playPlayoffMatch(matchId) {
    const round = matchId.startsWith('sf') ? 'semifinals' : 'finals';
    
    // Use a standard if/else block for better readability
    let matchData;
    if (round === 'semifinals') {
        matchData = league.playoffs.semifinals.find(m => m.id === matchId);
    } else {
        matchData = league.playoffs.finals[0];
    }

    const [teamA_id, teamB_id] = matchData.teams;
    const isUserMatch = matchData.teams.includes(league.playerTeamId);

    if (isUserMatch) {
        currentMode = 'playoffs'; // Set the mode
        setupMatch(teamA_id, teamB_id);
        showScreen('simulation-screen');
    } else {
        // AI vs AI simulation
        const result = simulateSeriesHeadless(teamA_id, teamB_id, 5);
        matchData.winner = result.winnerId;
        
        // Advance to next round if applicable
        if (round === 'semifinals') {
            const finalSlot = matchId === 'sf1' ? 0 : 1;
            league.playoffs.finals[0].teams[finalSlot] = result.winnerId;
        } else {
            league.playoffs.champion = result.winnerId;
        }
        renderPlayoffBracket();
    }
}

    function startPlayoffs() {
    const sortedStandings = league.standings.sort((a, b) => b.wins - a.wins);
    const top4 = sortedStandings.slice(0, 4).map(team => team.id);

    league.playoffs = {
        semifinals: [
            { id: 'sf1', teams: [top4[0], top4[3]], winner: null },
            { id: 'sf2', teams: [top4[1], top4[2]], winner: null }
        ],
        finals: [
            { id: 'finals', teams: [null, null], winner: null }
        ],
        champion: null
    };
    showScreen('playoffs-screen');
    renderPlayoffBracket();
}
    
    
   
function renderRosterTab() {
    if (!league.playerTeamId) return;

    const playerTeamData = TEAM_DATABASE[league.playerTeamId];
    const activeContainer = ui.activeRosterContainer;
    const subsContainer = ui.substituteRosterContainer;

    activeContainer.innerHTML = '';
    subsContainer.innerHTML = '';

    const createCard = (player, isActive) => {
    const card = document.createElement('div');
    card.className = 'p-4 rounded-lg border border-gray-700 bg-gray-800 flex flex-col';
    
    let statsHTML = '';
    for (const [stat, value] of Object.entries(player.stats)) {
        statsHTML += `<div class="flex justify-between text-sm"><span class="text-gray-400">${stat}</span><span class="font-semibold">${value}</span></div>`;
    }
    
    // This now includes both the image and the buttons
    card.innerHTML = `
        <div>
            <div class="flex items-center mb-3">
                <img src="${player.picture}" alt="${player.name}" class="w-12 h-12 rounded-full mr-3 border-2 border-gray-600 bg-gray-900">
                <h3 class="text-lg font-bold">${player.name}</h3>
            </div>
            <div class="space-y-1 mt-3 mb-4">${statsHTML}</div>
        </div>
        <div class="mt-auto pt-3 border-t border-gray-600 flex gap-2">
            <button data-player-id="${player.id}" data-is-active="${isActive}" class="roster-swap-btn w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">
                ${isActive ? 'Move to Bench' : 'Move to Active'}
            </button>
        </div>
    `;
    return card;
};

    playerTeamData.players.forEach(player => activeContainer.appendChild(createCard(player, true)));
    playerTeamData.substitutes.forEach(player => subsContainer.appendChild(createCard(player, false)));
    
    const emptySlots = 2 - playerTeamData.substitutes.length;
    for (let i = 0; i < emptySlots; i++) {
        const emptySlot = document.createElement('div');
        emptySlot.className = 'roster-slot-empty h-36 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-700';
        emptySlot.innerHTML = `<p class="text-gray-600">Empty Slot</p>`;
        subsContainer.appendChild(emptySlot);
    }
}
  


function swapPlayer(player1Id, player2Id) {
    // This function now correctly assumes it is ALWAYS swapping two players.
    const playerTeamData = TEAM_DATABASE[league.playerTeamId];
    const { players, substitutes } = playerTeamData;

    // 1. Find which list each player belongs to.
    const p1_list = players.some(p => p.id === player1Id) ? players : substitutes;
    const p2_list = players.some(p => p.id === player2Id) ? players : substitutes;

    // Safeguard: If something went wrong and they are in the same list, do nothing.
    if (p1_list === p2_list) {
        console.error("Swap failed: Both players are already in the same roster.");
        return;
    }

    // 2. Find the players' indexes in their respective lists.
    const p1_index = p1_list.findIndex(p => p.id === player1Id);
    const p2_index = p2_list.findIndex(p => p.id === player2Id);

    // Safeguard: If players can't be found, do nothing.
    if (p1_index === -1 || p2_index === -1) {
        console.error("Swap failed: Could not find one or both players.");
        return;
    }
    
    // 3. Perform the swap: Remove both players from their original lists.
    const [player1] = p1_list.splice(p1_index, 1);
    const [player2] = p2_list.splice(p2_index, 1);
    
    // 4. Add them back to the other list.
    p1_list.push(player2);
    p2_list.push(player1);

    // 5. Refresh the UI.
    renderRosterTab();
}


let currentMarketPlayers = []; // This will store the generated players for the week

function generateFreeAgents() {
    const names = ["Aero", "Blaze", "Crypt", "Drift", "Echo", "Flux", "Grit", "Havoc", "Jolt", "Kilo", "Luna", "Mirage", "Nexus", "Orion", "Pulse", "Quake", "Rift", "Surge", "Titan", "Vortex"];
    const potentials = [
        { tier: "Prospect", base: 55, range: 10, cost: 200 }, // Stats between 55-65
        { tier: "Solid Starter", base: 65, range: 10, cost: 450 }, // Stats between 65-75
        { tier: "All-Star", base: 75, range: 10, cost: 800 }, // Stats between 75-85
    ];
    
    currentMarketPlayers = []; // Clear the previous week's players

    for (let i = 0; i < 5; i++) {
        const potential = potentials[Math.floor(Math.random() * potentials.length)];
        const name = names[Math.floor(Math.random() * names.length)] + (Math.floor(Math.random() * 899) + 100);

        const player = {
            id: `fa-${Date.now()}-${i}`,
            name: name,
            picture: `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`,
            cost: potential.cost + Math.floor(Math.random() * 100), // Add some cost variance
            stats: {
                Overall: potential.base + Math.floor(Math.random() * potential.range),
                Pace: potential.base + Math.floor(Math.random() * potential.range),
                Efficiency: potential.base + Math.floor(Math.random() * potential.range),
                Objective: potential.base + Math.floor(Math.random() * potential.range),
            }
        };
        currentMarketPlayers.push(player);
    }
}
    
    function signPlayer(playerId) {
    const playerToSign = currentMarketPlayers.find(p => p.id === playerId);
    if (!playerToSign) return;

    const playerTeamData = TEAM_DATABASE[league.playerTeamId];

    // Check if there is an empty substitute spot
    if (playerTeamData.substitutes.length >= 2) {
        alert("Your substitute bench is full. You must free up a spot before signing a new player.");
        return;
    }

    if (league.playerCoins >= playerToSign.cost) {
        league.playerCoins -= playerToSign.cost;
        
        // Add player to the substitutes array
        playerTeamData.substitutes.push(playerToSign);

        currentMarketPlayers = currentMarketPlayers.filter(p => p.id !== playerId);

        renderMarketTab();
        renderRosterTab();
        ui.leagueCoinDisplay.textContent = league.playerCoins;

        alert(`${playerToSign.name} has been signed to your substitute bench!`);
    } else {
        alert("You do not have enough coins to sign this player.");
    }
}


    function renderMarketTab() {
    const marketContainer = ui.marketContainer;
    marketContainer.innerHTML = ''; // Clear existing cards

    currentMarketPlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'p-4 rounded-lg border border-gray-700 bg-gray-800 flex flex-col';
        
        let statsHTML = '';
        for (const [stat, value] of Object.entries(player.stats)) {
            statsHTML += `<div class="flex justify-between text-sm"><span class="text-gray-400">${stat}</span><span class="font-semibold">${value}</span></div>`;
        }

        const buttonId = `sign-btn-${player.id}`;

        playerCard.innerHTML = `
            <div>
                <div class="flex flex-col items-center mb-3">
                    <img src="${player.picture}" alt="${player.name}" class="w-16 h-16 rounded-full mb-2 border-2 border-gray-600 bg-gray-900">
                    <h3 class="text-lg font-bold text-center">${player.name}</h3>
                </div>
                <div class="space-y-1 mt-3 mb-4">
                    ${statsHTML}
                </div>
            </div>
            <div class="mt-auto pt-3 border-t border-gray-600">
                 <div class="text-center text-amber-400 font-bold mb-3 text-lg">${player.cost} Coins</div>
                 <button id="${buttonId}" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Sign Player</button>
            </div>
        `;
        marketContainer.appendChild(playerCard);

        document.getElementById(buttonId).addEventListener('click', () => signPlayer(player.id));
    });
}
    function openSwapModal(playerId, isCurrentlyActive) {
    const playerTeamData = TEAM_DATABASE[league.playerTeamId];
    playerToSwapId = playerId; // Store the ID of the first player

    const player1 = playerTeamData.players.find(p => p.id === playerId) || playerTeamData.substitutes.find(p => p.id === playerId);
    ui.playerToSwapName.textContent = player1.name;

    // Determine which list of players to show in the modal
    const listToShow = isCurrentlyActive ? playerTeamData.substitutes : playerTeamData.players;
    ui.rosterSwapList.innerHTML = ''; // Clear previous list

    if (listToShow.length === 0) {
        ui.rosterSwapList.innerHTML = `<p class="text-center text-gray-500">No players available to swap.</p>`;
    } else {
        listToShow.forEach(player2 => {
            const playerButton = document.createElement('button');
            playerButton.className = 'w-full p-3 text-left bg-gray-700 hover:bg-indigo-600 rounded-lg transition-colors flex justify-between items-center';
            playerButton.innerHTML = `
                <span>${player2.name}</span>
                <span class="text-sm text-gray-400">Overall: ${player2.stats.Overall}</span>
            `;
            playerButton.addEventListener('click', () => {
                swapPlayer(playerToSwapId, player2.id);
                ui.rosterSwapModal.classList.add('hidden'); // Close modal on success
            });
            ui.rosterSwapList.appendChild(playerButton);
        });
    }

    // Show the modal
    ui.rosterSwapModal.classList.remove('hidden');
}
    
    //=========== INITIALIZATION & NAVIGATION ===========

let activeUser = null;
let isLoginMode = true;
let playerToSwapId = null;

function setAuthMode(isLogin) {
    isLoginMode = isLogin;
    const toggleText = document.getElementById('auth-toggle-text'); // Get the text element

    if (isLogin) {
        ui.authTitle.textContent = 'Login';
        ui.authSubmitBtn.textContent = 'Login';
        toggleText.innerHTML = `Don't have an account? <button id="auth-toggle-btn" class="font-semibold text-indigo-400 hover:text-indigo-300">Sign Up</button>`;
    } else {
        ui.authTitle.textContent = 'Sign Up';
        ui.authSubmitBtn.textContent = 'Sign Up';
        toggleText.innerHTML = `Already have an account? <button id="auth-toggle-btn" class="font-semibold text-indigo-400 hover:text-indigo-300">Login</button>`;
    }

    // We must re-add the event listener to the new button inside the toggleText
    document.getElementById('auth-toggle-btn').addEventListener('click', () => setAuthMode(!isLoginMode));
    ui.authErrorMessage.classList.add('hidden');
    ui.authErrorMessage.textContent = '';
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    const email = ui.authForm.email.value;
    const password = ui.authForm.password.value;

    try {
        if (isLoginMode) {
            await account.createEmailPasswordSession(email, password);
        } else {
            await account.create(ID.unique(), email, password);
            await account.createEmailPasswordSession(email, password); // Auto-login after signup
        }
        checkUserStatus(); // On success, this will now hide the login screen
    } catch (error) {
        ui.authErrorMessage.textContent = error.message;
        ui.authErrorMessage.classList.remove('hidden');
    }
}

async function logoutUser() {
    try {
        await account.deleteSession('current');
        activeUser = null;
        updateUIForUser();
    } catch (error) {
        console.error('Failed to logout:', error);
    }
}

function updateUIForUser() {
    if (activeUser) {
        // User is logged in
        ui.loginScreen.classList.add('hidden');
        ui.mainMenuScreen.classList.remove('hidden');

        ui.userProfileContainer.classList.remove('hidden');
        ui.userProfileContainer.classList.add('flex');
        ui.userEmailDisplay.textContent = activeUser.email;
    } else {
        // User is logged out
        ui.loginScreen.classList.remove('hidden');
        ui.mainMenuScreen.classList.add('hidden');
        
        ui.userProfileContainer.classList.add('hidden');
        ui.userProfileContainer.classList.remove('flex');
    }
}

async function checkUserStatus() {
    try {
        activeUser = await account.get();
        initializeMainMenuListeners(); 
    } catch (error) {
        activeUser = null;
    }
    updateUIForUser();
}
    
// REVISED init() FUNCTION
function init() {
    // --- Initial Setup (Runs on page load) ---
    
    // 1. Check if a user is already logged in from a previous session
    checkUserStatus();
    
    // 2. Set up the login/signup form listeners
    if (ui.authForm) ui.authForm.addEventListener('submit', handleAuthSubmit);
    
    const authToggleBtn = document.getElementById('auth-toggle-btn');
    if (authToggleBtn) {
        authToggleBtn.addEventListener('click', () => setAuthMode(!isLoginMode));
    }

    // 3. Add listeners for buttons that take you BACK to the main menu
    if (ui.franchiseBackBtn) {
        ui.franchiseBackBtn.addEventListener('click', () => showScreen('main-menu-screen'));
    }
    if (ui.leagueBackBtn) {
        ui.leagueBackBtn.addEventListener('click', resetAndGoToMenu);
    }
}

function initializeMainMenuListeners() {
    // --- Main Menu Setup (Runs ONLY after login) ---

    // --- Main Navigation & Setup ---
    // REMOVED: ui.menuLeagueBtn.addEventListener('click', () => {
    //     showScreen('franchise-setup-screen');
    //     renderFranchiseSelectionGrid();
    // });
    ui.logoutBtn.addEventListener('click', logoutUser);
    ui.startLeagueBtn.addEventListener('click', startLeagueSeason);

    // --- League Hub Main Actions ---
    ui.leaguePlayMatchBtn.addEventListener('click', playPlayerMatch);

    // --- Tab Navigation ---
    ui.leagueTabs.forEach(clickedTab => {
        clickedTab.addEventListener('click', () => {
            ui.leagueTabs.forEach(tab => tab.classList.replace('active-tab', 'inactive-tab'));
            clickedTab.classList.replace('inactive-tab', 'active-tab');
            const targetContentId = `tab-${clickedTab.getAttribute('data-tab')}`;
            ui.leagueTabContents.forEach(content => {
                content.classList.toggle('hidden', content.id !== targetContentId);
            });
        });
    });

    // --- Event Delegation for Roster and Training Tabs ---
    const leagueHubContent = document.getElementById('league-hub-screen');
    leagueHubContent.addEventListener('click', (e) => {
        // Roster Swap Button Clicks
        const swapButton = e.target.closest('.roster-swap-btn');
        if (swapButton) {
            const playerId = swapButton.dataset.playerId;
            const isCurrentlyActive = swapButton.dataset.isActive === 'true';
            openSwapModal(playerId, isCurrentlyActive);
            return;
        }
        // Training Drill Button Clicks
        const drillButton = e.target.closest('.training-drill-btn');
        if (drillButton) {
            const drillType = drillButton.dataset.drill;
            executeTraining(drillType);
            return;
        }
    });

    // --- Modal Close Buttons ---
    ui.rosterSwapCancelBtn.addEventListener('click', () => {
        ui.rosterSwapModal.classList.add('hidden');
    });
    ui.trainingResultsCloseBtn.addEventListener('click', () => {
        ui.trainingResultsModal.classList.add('hidden');
    });
    
    // --- Sim Screen & Post-Match Buttons ---
    ui.startSimBtn.addEventListener('click', startSimulation);
    ui.speedToggleBtn.addEventListener('click', toggleSimulationSpeed);
    ui.backToMenuBtn.addEventListener('click', () => {
        showScreen('league-hub-screen');
        ui.postMatchScreen.classList.add('hidden');
    });
    
    // --- Multiplayer League Listeners ---
    ui.menuLeagueBtn.addEventListener('click', async () => {
        // Check if user is already in a multiplayer league
        const inLeague = await checkMultiplayerLeague();
        if (inLeague) {
            // User is already in a league, go directly to league hub
            return;
        }
        
        // Show multiplayer options
        showScreen('multiplayer-league-screen');
    });

    ui.createLeagueForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const leagueName = ui.leagueNameInput.value;
        const maxTeams = ui.maxTeamsSelect.value;
        
        try {
            const league = await createLeague(leagueName, maxTeams);
            currentLeague = league;
            await loadAvailableTeams();
            showScreen('multiplayer-team-selection-screen');
        } catch (error) {
            alert('Error creating league: ' + error.message);
        }
    });

    ui.joinLeagueForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const leagueId = ui.leagueIdInput.value;
        await joinLeague(leagueId);
    });

    ui.multiplayerBackBtn.addEventListener('click', () => {
        showScreen('main-menu-screen');
    });

    ui.teamSelectionBackBtn.addEventListener('click', () => {
        showScreen('multiplayer-league-screen');
    });
}
    function showScreen(screenId) {
        document.querySelectorAll('.max-w-4xl, .max-w-6xl, .max-w-7xl').forEach(el => el.classList.add('hidden'));
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.remove('hidden');
        }
    }
    
    function resetAndGoToMenu() {
        league = {};
        playerTeamId = null;
        showScreen('main-menu-screen');
    }
    
    //=========== LEAGUE SETUP & MANAGEMENT ===========

    function renderFranchiseSelectionGrid() {
        ui.franchiseSelectionGrid.innerHTML = '';
        Object.keys(TEAM_DATABASE).forEach(id => {
            const team = TEAM_DATABASE[id];
            const card = document.createElement('div');
            card.className = 'team-choice-card p-4 rounded-lg text-center';
            card.innerHTML = `<img src="${team.logo}" alt="${team.name}" class="w-12 h-12 mx-auto mb-2 rounded-full"><p class="font-bold">${team.name}</p>`;
            card.addEventListener('click', () => {
                playerTeamId = id;
                // Update selection display
                ui.yourFranchiseDisplay.innerHTML = `<img src="${team.logo}" alt="${team.name}" class="w-16 h-16 mx-auto mb-2 rounded-full"><h3 class="text-2xl font-bold">${team.name}</h3><p class="text-gray-400">Your Chosen Franchise</p>`;
                ui.startLeagueBtn.disabled = false;
                // Highlight selected card
                document.querySelectorAll('#franchise-selection-grid .team-choice-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
            ui.franchiseSelectionGrid.appendChild(card);
        });
    }

    function startLeagueSeason() {
        if (!playerTeamId) return;
        
        // --- Assign unique IDs to starting players ---
    const playerTeamData = TEAM_DATABASE[playerTeamId];
    playerTeamData.players.forEach((player, index) => {
        if (!player.id) {
            player.id = `starter-${player.name.toLowerCase()}-${index}`;
        }
    });
        
        const allTeamIds = Object.keys(TEAM_DATABASE);
        // Ensure the player's team is first, then take the next 7
        const leagueTeams = [playerTeamId, ...allTeamIds.filter(id => id !== playerTeamId)].slice(0, 8);
        const schedule = generateRoundRobinSchedule(leagueTeams);
        
        league = {
            schedule: schedule,
            currentWeek: 1,
            standings: leagueTeams.map(id => ({ id: id, wins: 0, losses: 0 })),
            playerTeamId: playerTeamId,
            trainingCompletedThisWeek: false,
            playerCoins: 0
        };

        renderLeagueHub();
        showScreen('league-hub-screen');
        renderTrainingTab();
        renderRosterTab();
        generateFreeAgents();
        renderMarketTab();
    }

    function generateRoundRobinSchedule(teamIds) {
        const schedule = [];
        const teams = [...teamIds];
        const numWeeks = teams.length - 1;
        const numMatchesPerWeek = teams.length / 2;

        for (let week = 0; week < numWeeks; week++) {
            const weeklyMatchups = [];
            for (let i = 0; i < numMatchesPerWeek; i++) {
                const teamA = teams[i];
                const teamB = teams[teams.length - 1 - i];
                weeklyMatchups.push({ id: `w${week + 1}m${i + 1}`, teams: [teamA, teamB], winner: null, result: null });
            }
            schedule.push({ week: week + 1, matchups: weeklyMatchups });
            // Rotate teams for next week's schedule
            const lastTeam = teams.pop();
            teams.splice(1, 0, lastTeam);
        }
        return schedule;
    }
    
    //=========== UI RENDERING ===========

    function renderLeagueHub() {
        if (ui.leagueCoinDisplay) {
        ui.leagueCoinDisplay.textContent = league.playerCoins || 0;
        }    
        if (!league.schedule) return;

        // Render Standings
        const sortedStandings = league.standings.sort((a, b) => b.wins - a.wins);
        ui.leagueStandingsBody.innerHTML = '';
        sortedStandings.forEach((s, index) => {
            const team = TEAM_DATABASE[s.id];
            const row = document.createElement('tr');
            if (s.id === league.playerTeamId) row.classList.add('bg-indigo-900');
            row.innerHTML = `
                <td class="p-3 font-bold">${index + 1}</td>
                <td class="p-3 flex items-center gap-3"><img src="${team.logo}" class="w-6 h-6 rounded-full"> ${team.name}</td>
                <td class="p-3 text-center text-green-400 font-semibold">${s.wins}</td>
                <td class="p-3 text-center text-red-400 font-semibold">${s.losses}</td>
                <td class="p-3">${s.wins}-${s.losses}</td>
            `;
            ui.leagueStandingsBody.appendChild(row);
        });

        // Render Weekly Schedule
        const currentWeekData = league.schedule.find(w => w.week === league.currentWeek);
        if (currentWeekData) {
            ui.leagueWeekTitle.textContent = `Week ${league.currentWeek} of ${league.schedule.length}`;
            ui.weeklyMatchupsContainer.innerHTML = '';
            currentWeekData.matchups.forEach(match => {
                const [teamA, teamB] = [TEAM_DATABASE[match.teams[0]], TEAM_DATABASE[match.teams[1]]];
                const card = document.createElement('div');
                card.className = 'weekly-matchup-card';
                
                let resultText = `<span class="vs-text">vs</span>`;
                if(match.winner) {
                    const winnerName = TEAM_DATABASE[match.winner].name;
                    resultText = `<span class="text-xs text-amber-400 font-bold">${winnerName} wins ${match.result}</span>`;
                }

                card.innerHTML = `
                    <div class="team-name" style="color:${teamA.color};">${teamA.name}</div>
                    ${resultText}
                    <div class="team-name" style="color:${teamB.color};">${teamB.name}</div>
                `;
                if (match.teams.includes(league.playerTeamId)) {
                    card.style.border = `2px solid #4f46e5`;
                }
                ui.weeklyMatchupsContainer.appendChild(card);
            });
            ui.leaguePlayMatchBtn.disabled = false;
            ui.leaguePlayMatchBtn.textContent = 'Play Your Match';
            
            // We have temporarily removed the logic for the old train button.
            //ui.leagueTrainBtn.disabled = league.trainingCompletedThisWeek;
            //ui.leagueTrainBtn.textContent = league.trainingCompletedThisWeek ? 'Training Completed for Week' : 'Train Team';

        } else {
             ui.leagueWeekTitle.textContent = `Season Over!`;
             ui.weeklyMatchupsContainer.innerHTML = '<p class="text-center text-gray-400">The season has concluded. Check the final standings!</p>';
             ui.leaguePlayMatchBtn.disabled = true;
             ui.leaguePlayMatchBtn.textContent = 'Season Finished';
        }
        renderTrainingTab();    
    }
    
    function playPlayerMatch() {
        const currentWeekData = league.schedule.find(w => w.week === league.currentWeek);
        const playerMatchup = currentWeekData.matchups.find(m => m.teams.includes(league.playerTeamId));

        if (playerMatchup) {
            selectedTeamA_id = playerMatchup.teams[0];
            selectedTeamB_id = playerMatchup.teams[1];
            
            // Setup and start the simulation for the player's match
            setupMatch(selectedTeamA_id, selectedTeamB_id);
            showScreen('simulation-screen');
        }
    }

    function simulateRestOfWeek() {
        console.log("Simulating remaining AI matches for the week...");
        const currentWeekData = league.schedule.find(w => w.week === league.currentWeek);

        currentWeekData.matchups.forEach(match => {
            // If the match doesn't involve the player and hasn't been decided yet
            if (!match.teams.includes(league.playerTeamId) && !match.winner) {
                const result = simulateSeriesHeadless(match.teams[0], match.teams[1], matchFormat);
                match.winner = result.winnerId;
                match.result = `${result.scoreA}-${result.scoreB}`;

                const loserId = match.teams.find(id => id !== result.winnerId);
                league.standings.find(s => s.id === result.winnerId).wins++;
                league.standings.find(s => s.id === loserId).losses++;
            }
        });
        
        league.currentWeek++;
        generateFreeAgents();
        renderMarketTab();
        league.trainingCompletedThisWeek = false;
        console.log("Week concluded. Moving to next week.");

        // Go back to league hub which will now show updated results
        setTimeout(() => {
            renderLeagueHub();
            showScreen('league-hub-screen');
        }, 1500); // Add a small delay to show the "Simulating..." message
    }
    
    function simulateSeriesHeadless(teamA_id, teamB_id, numGames) {
        const winsNeeded = Math.ceil(numGames / 2);
        let scoreA = 0, scoreB = 0;
        
        const teamA_overall = TEAM_DATABASE[teamA_id].players.reduce((sum, p) => sum + p.stats.Overall, 0);
        const teamB_overall = TEAM_DATABASE[teamB_id].players.reduce((sum, p) => sum + p.stats.Overall, 0);
        const totalOverall = teamA_overall + teamB_overall;

        while (scoreA < winsNeeded && scoreB < winsNeeded) {
            if (Math.random() * totalOverall < teamA_overall) {
                scoreA++;
            } else {
                scoreB++;
            }
        }
        
        return {
            winnerId: scoreA > scoreB ? teamA_id : teamB_id,
            scoreA: scoreA,
            scoreB: scoreB
        };
    }

    //=========== CORE SIMULATION ENGINE (Hardpoint Match) ===========
    
    function setupMatch(teamA_id, teamB_id) {
        teams.teamA = JSON.parse(JSON.stringify(TEAM_DATABASE[teamA_id]));
        teams.teamB = JSON.parse(JSON.stringify(TEAM_DATABASE[teamB_id]));
        
        [...teams.teamA.players, ...teams.teamB.players].forEach(p => {
             p.seriesKills = 0; p.seriesDeaths = 0; p.seriesHillTime = 0;
        });

        seriesScore = { teamA: 0, teamB: 0 };
        currentGameInSeries = 1;
        
        updateSeriesUI();
        ui.seriesScoreDisplay.classList.remove('hidden');
        
        setupSimulationUI();
    }

    function setupSimulationUI() {
        gameState = {
            gameTimer: 300, hillTimer: 60, currentHillIndex: 0, teamAScore: 0, teamBScore: 0,
            hills: ['P1', 'P2', 'P3', 'P4'], isGameRunning: false,
        };

        [teams.teamA, teams.teamB].forEach(team => {
            team.players.forEach(player => {
                player.kills = 0; player.deaths = 0; player.hillTime = 0;
                player.isAlive = true; player.respawnTimer = 0;
            });
        });

        ui.teamA.name.textContent = teams.teamA.name;
        ui.teamA.logo.src = teams.teamA.logo;
        ui.teamA.overall.textContent = Math.round(teams.teamA.players.reduce((s, p) => s + p.stats.Overall, 0) / 4);
        renderPlayerCards(ui.teamA.players, teams.teamA.players, 'A');

        ui.teamB.name.textContent = teams.teamB.name;
        ui.teamB.logo.src = teams.teamB.logo;
        ui.teamB.overall.textContent = Math.round(teams.teamB.players.reduce((s, p) => s + p.stats.Overall, 0) / 4);
        renderPlayerCards(ui.teamB.players, teams.teamB.players, 'B');

        ui.teamA.scoreLabel.textContent = teams.teamA.name;
        ui.teamB.scoreLabel.textContent = teams.teamB.name;
        
        ui.matchupTitle.textContent = `League Match: ${teams.teamA.name} vs ${teams.teamB.name}`;
        ui.startSimBtn.disabled = false;
        ui.startSimBtn.textContent = `Start Game ${currentGameInSeries}`;
        
        updateSimUI();
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function logEvent(message, color = '#a1a1aa') {
        const p = document.createElement('p');
        p.innerHTML = `<span class="font-bold" style="color: ${color}">[G${currentGameInSeries} | ${formatTime(300 - gameState.gameTimer)}]</span> ${message}`;
        ui.eventLog.appendChild(p);
        ui.eventLog.scrollTop = ui.eventLog.scrollHeight;
    }

    function showKillFeedEvent(winner, loser, winnerTeam, loserTeam) {
        const item = document.createElement('div');
        item.className = 'killfeed-item';
        item.innerHTML = `<span class="font-bold" style="color: ${winnerTeam.color}">${winner.name}</span><span class="text-gray-400 text-xs font-light mx-2">eliminated</span><span class="font-bold" style="color: ${loserTeam.color}">${loser.name}</span>`;
        ui.killfeedContainer.prepend(item);
        setTimeout(() => { item.remove(); }, 5000);
    }
    
    function createPlayerCard(player, teamId) {
    // Destructure all the properties we need, including the new 'picture'
    const { name, stats, picture } = player;
    const card = document.createElement('div');
    card.id = `player-${teamId}-${name}`;
    card.className = `p-4 rounded-lg border border-gray-700 bg-gray-900 transition-all duration-300`;

    // This updated HTML structure now includes the <img> tag
    card.innerHTML = `
        <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
                <img src="${picture}" alt="${name}" class="w-10 h-10 rounded-full mr-3 bg-gray-800 border-2 border-gray-600">
                <h3 class="text-lg font-bold">${name}</h3>
            </div>
            <div id="player-status-${teamId}-${name}" class="text-sm font-semibold text-green-400">ALIVE</div>
        </div>
        <div class="player-stat-grid mt-2 text-sm text-gray-300">
            <span><strong>Overall:</strong> ${stats.Overall}</span>
            <span><strong>Pace:</strong> ${stats.Pace}</span>
            <span><strong>Efficiency:</strong> ${stats.Efficiency}</span>
            <span><strong>Objective:</strong> ${stats.Objective}</span>
        </div>
        <div class="flex justify-between mt-3 pt-3 border-t border-gray-700 text-sm">
            <span class="font-semibold">Kills: <span id="kills-${teamId}-${name}" class="font-normal text-green-400">0</span></span>
            <span class="font-semibold">Deaths: <span id="deaths-${teamId}-${name}" class="font-normal text-red-400">0</span></span>
            <span class="font-semibold">Hill Time: <span id="hilltime-${teamId}-${name}" class="font-normal text-sky-400">0s</span></span>
        </div>
    `;
    return card;
}
    
    function renderPlayerCards(container, players, teamId) {
        container.innerHTML = '';
        players.forEach(p => container.appendChild(createPlayerCard(p, teamId)));
    }

    function updatePlayerCardUI(player, teamId) {
        const killsEl = document.getElementById(`kills-${teamId}-${player.name}`);
        const deathsEl = document.getElementById(`deaths-${teamId}-${player.name}`);
        const hillTimeEl = document.getElementById(`hilltime-${teamId}-${player.name}`);
        if(killsEl) killsEl.textContent = player.kills;
        if(deathsEl) deathsEl.textContent = player.deaths;
        if(hillTimeEl) hillTimeEl.textContent = `${player.hillTime}s`;
    }

    function updateSimUI() {
        ui.teamA.score.textContent = gameState.teamAScore;
        ui.teamB.score.textContent = gameState.teamBScore;
        ui.gameTimer.textContent = formatTime(gameState.gameTimer);
        ui.hillTimer.textContent = gameState.hillTimer;
        Object.values(ui.hillIndicators).forEach(ind => ind.classList.remove('hill-active'));
        const currentHillId = gameState.hills[gameState.currentHillIndex];
        if (ui.hillIndicators[currentHillId]) {
            ui.hillIndicators[currentHillId].classList.add('hill-active');
        }
        [teams.teamA, teams.teamB].forEach((team, index) => {
            const teamId = index === 0 ? 'A' : 'B';
            team.players.forEach(p => updatePlayerCardUI(p, teamId));
        });
    }
    
    function updateSeriesUI() {
        ui.seriesFormatText.textContent = `Best of ${matchFormat}`;
        ui.seriesTeamAName.textContent = teams.teamA.name;
        ui.seriesTeamBName.textContent = teams.teamB.name;
        ui.seriesScoreText.textContent = `${seriesScore.teamA} - ${seriesScore.teamB}`;
        ui.seriesTeamAName.style.color = teams.teamA.color;
        ui.seriesTeamBName.style.color = teams.teamB.color;
    }

    function selectPlayerForGunfight(team) {
        const alivePlayers = team.players.filter(p => p.isAlive);
        if (alivePlayers.length === 0) return null;
        const totalPace = alivePlayers.reduce((sum, p) => sum + p.stats.Pace, 0);
        let rand = Math.random() * totalPace;
        for (const player of alivePlayers) {
            rand -= player.stats.Pace;
            if (rand <= 0) return player;
        }
        return alivePlayers[alivePlayers.length - 1];
    }
    
    function awardHillTime(scoringPlayers) {
        if (scoringPlayers.length === 0) return;
        let lotteryPool = [];
        scoringPlayers.forEach(player => {
            for (let i = 0; i < player.stats.Objective; i++) {
                lotteryPool.push(player);
            }
        });
        if (lotteryPool.length > 0) {
            const winner = lotteryPool[Math.floor(Math.random() * lotteryPool.length)];
            winner.hillTime++;
        }
    }
    
    function updatePlayerStates() {
        [teams.teamA, teams.teamB].forEach((team, index) => {
            const teamId = index === 0 ? 'A' : 'B';
            team.players.forEach(player => {
                if (!player.isAlive) {
                    player.respawnTimer--;
                    if (player.respawnTimer <= 0) {
                        player.isAlive = true;
                        logEvent(`<strong style="color: ${team.color}">${player.name}</strong> has respawned.`, team.color);
                    }
                }
                const statusDiv = document.getElementById(`player-status-${teamId}-${player.name}`);
                if (statusDiv) {
                    if (player.isAlive) {
                        statusDiv.textContent = 'ALIVE';
                        statusDiv.className = 'text-sm font-semibold text-green-400';
                    } else {
                        statusDiv.textContent = `RESPAWN IN ${player.respawnTimer}s`;
                        statusDiv.className = 'text-sm font-semibold text-red-400';
                    }
                }
            });
        });
    }

    function updateHillState() {
    const aliveA = teams.teamA.players.filter(p => p.isAlive);
    const aliveB = teams.teamB.players.filter(p => p.isAlive);
    const totalObjectiveA = aliveA.reduce((sum, p) => sum + p.stats.Objective, 0);
    const totalObjectiveB = aliveB.reduce((sum, p) => sum + p.stats.Objective, 0);
    const totalObjective = totalObjectiveA + totalObjectiveB;

    // Default state if no one is alive
    let state = 'Empty';
    let stateColor = 'text-gray-400';
    let isAnyoneScoring = false;

    // Only determine scoring/contested states if players are alive
    if (totalObjective > 0) {
        const contestChance = 0.10; // 10% chance the hill is contested
        const emptyChance = 0.15;   // 15% chance the hill is empty despite players being nearby
        const rand = Math.random();
        const probA = totalObjectiveA / totalObjective;

        // Determine outcome based on probabilities
        if (rand < probA * (1 - contestChance - emptyChance)) {
            state = `${teams.teamA.name} Scoring`;
            stateColor = `text-[${teams.teamA.color}]`;
            gameState.teamAScore++;
            isAnyoneScoring = true;
            awardHillTime(aliveA);
        } else if (rand < (1 - contestChance - emptyChance)) {
            state = `${teams.teamB.name} Scoring`;
            stateColor = `text-[${teams.teamB.color}]`;
            gameState.teamBScore++;
            isAnyoneScoring = true;
            awardHillTime(aliveB);
        } else if (rand < (1 - emptyChance)) {
            state = 'Contested';
            stateColor = 'text-amber-400';
        } else {
            // In this case, the state remains 'Empty'
        }
    }
        
        ui.hillState.textContent = state;
        ui.hillState.className = `text-2xl font-bold ${stateColor}`;
        if (!isAnyoneScoring && gameState.gameTimer > 0) gameState.gameTimer--;
    }

   function simulateGunfight() {
    const playerA = selectPlayerForGunfight(teams.teamA);
    const playerB = selectPlayerForGunfight(teams.teamB);
    if (!playerA || !playerB) return;

    const probA_wins = playerA.stats.Efficiency / (playerA.stats.Efficiency + playerB.stats.Efficiency);

    let winner, loser, winnerTeam, loserTeam;

    if (Math.random() < probA_wins) {
        [winner, loser, winnerTeam, loserTeam] = [playerA, playerB, teams.teamA, teams.teamB];
    } else {
        [winner, loser, winnerTeam, loserTeam] = [playerB, playerA, teams.teamB, teams.teamA];
    }

    loser.isAlive = false;
    loser.respawnTimer = 5;
    winner.kills++;
    loser.deaths++;

    logEvent(`<strong style="color: ${winnerTeam.color}">${winner.name}</strong> eliminated <strong style="color: ${loserTeam.color}">${loser.name}</strong>!`, winnerTeam.color);
    showKillFeedEvent(winner, loser, winnerTeam, loserTeam);
}

    function runGunfightCycle() {
        const numFights = Math.floor(Math.random() * 3) + 1; // 1 to 3 gunfights per cycle
        for (let i = 0; i < numFights; i++) {
            simulateGunfight();
        }
    }

    function checkWinConditions() {
        if (gameState.teamAScore >= 250) stopSimulation(`${teams.teamA.name} win the game!`, 'teamA');
        else if (gameState.teamBScore >= 250) stopSimulation(`${teams.teamB.name} win the game!`, 'teamB');
        else if (gameState.gameTimer <= 0) {
            if (gameState.teamAScore > gameState.teamBScore) stopSimulation(`${teams.teamA.name} win on time!`, 'teamA');
            else if (gameState.teamBScore > gameState.teamAScore) stopSimulation(`${teams.teamB.name} win on time!`, 'teamB');
            else stopSimulation("It's a draw!", 'draw');
        }
    }
    
    function gameLoop() {
        if (!gameState.isGameRunning) return;
        gameState.hillTimer--;
        updatePlayerStates();
        updateHillState();
        if (gameState.hillTimer <= 0) {
            gameState.currentHillIndex = (gameState.currentHillIndex + 1) % gameState.hills.length;
            gameState.hillTimer = 60;
            logEvent(`Hill rotated. New hill is <strong class="text-yellow-400">${gameState.hills[gameState.currentHillIndex]}</strong>.`, '#facc15');
        }
        updateSimUI();
        checkWinConditions();
    }

    function scheduleNextGunfight() {
        if (!gameState.isGameRunning) return;
        runGunfightCycle();
        const nextFightTime = (Math.random() * 2 + 2) * 1000 / simulationSpeed;
        setTimeout(scheduleNextGunfight, nextFightTime);
    }
    
    function startSimulation() {
        if (gameState.isGameRunning) return;
        gameState.isGameRunning = true;
        ui.startSimBtn.disabled = true;
        ui.startSimBtn.textContent = `Game ${currentGameInSeries} in Progress...`;
        if (currentGameInSeries === 1 && seriesScore.teamA === 0 && seriesScore.teamB === 0) {
            ui.eventLog.innerHTML = '';
        }
        logEvent(`--- Game ${currentGameInSeries} Started! ---`, '#a1a1aa');
        gameInterval = setInterval(gameLoop, 1000 / simulationSpeed);
        scheduleNextGunfight();
    }
    
    function stopSimulation(gameWinnerMessage, gameWinnerId) {
        clearInterval(gameInterval);
        gameState.isGameRunning = false;
        ui.startSimBtn.textContent = 'Game Over';
        logEvent(`<strong>GAME ${currentGameInSeries} OVER: ${gameWinnerMessage}</strong>`, '#facc15');
        ui.hillState.textContent = 'Game Over';
        handleSeriesLogic(gameWinnerId);
    }

    function handleSeriesLogic(gameWinnerId) {
        if (gameWinnerId === 'teamA') seriesScore.teamA++;
        else if (gameWinnerId === 'teamB') seriesScore.teamB++;

        [...teams.teamA.players, ...teams.teamB.players].forEach(p => {
            p.seriesKills += p.kills;
            p.seriesDeaths += p.deaths;
            p.seriesHillTime += p.hillTime;
        });

        updateSeriesUI();
        const winsNeeded = Math.ceil(matchFormat / 2);

        if (seriesScore.teamA === winsNeeded || seriesScore.teamB === winsNeeded) {
            endSeries();
        } else {
            prepareNextGame();
        }
    }

    function prepareNextGame() {
        currentGameInSeries++;
        logEvent(`Next game starting in 5 seconds...`, '#a1a1aa');
        setTimeout(() => {
            setupSimulationUI();
        }, 5000);
    }

    function endSeries() {
        
   
        
        // Update standings for the two teams that just played
        const winnerId = seriesScore.teamA > seriesScore.teamB ? selectedTeamA_id : selectedTeamB_id;
        const loserId = winnerId === selectedTeamA_id ? selectedTeamB_id : selectedTeamA_id;

        // Check if the match just played was the player's match
        if (selectedTeamA_id === league.playerTeamId || selectedTeamB_id === league.playerTeamId) {
        // Update standings for the two teams that just played
        const winnerStanding = league.standings.find(s => s.id === winnerId);
        const loserStanding = league.standings.find(s => s.id === loserId);
        if (winnerStanding) winnerStanding.wins++;
        if (loserStanding) loserStanding.losses++;
    
        // Mark the player's match as complete in the schedule
        const currentWeekData = league.schedule.find(w => w.week === league.currentWeek);
        const playerMatchup = currentWeekData.matchups.find(m => m.teams.includes(playerTeamId));
        playerMatchup.winner = winnerId;
        const finalScore = `${seriesScore.teamA}-${seriesScore.teamB}`;
        playerMatchup.result = finalScore;
    
        // Call our new function to award coins
        awardCoins(finalScore);
    
        // Display post-match screen for the player
        calculateAndDisplayMVP();
        populateFinalScoreboard();
        ui.postMatchScreen.classList.remove('hidden');
        ui.backToMenuBtn.textContent = "Continue to League Hub";
        
        // Automatically simulate the rest of the week's games
        logEvent('Your match has ended. Simulating other matches for the week...', '#4f46e5');
        simulateRestOfWeek();
    }
}    
    
    function awardCoins(finalScore) {
    let coinsEarned = 0;
    const [scoreA, scoreB] = finalScore.split('-').map(Number);
    const playerIsTeamA = selectedTeamA_id === league.playerTeamId;

    const playerWon = (playerIsTeamA && scoreA > scoreB) || (!playerIsTeamA && scoreB > scoreA);

    if (playerWon) {
        coinsEarned = 800; // Base for a win
        // Add bonuses for decisive wins
        if (finalScore === '3-0' || finalScore === '0-3') {
            coinsEarned += 50;
        } else if (finalScore === '3-1' || finalScore === '1-3') {
            coinsEarned += 25;
        }
    } else {
        coinsEarned = 50; // Flat reward for a loss
    }

    league.playerCoins += coinsEarned;
    logEvent(`You earned <strong class="text-amber-400">${coinsEarned} coins</strong> for the match.`, '#facc15');
}

    function calculateAndDisplayMVP() {
        const allPlayers = [...teams.teamA.players, ...teams.teamB.players];
        let mvpPlayer = allPlayers[0];
        let highestImpactScore = -Infinity;

        allPlayers.forEach(p => {
            const impactScore = (p.seriesKills * 1) + (p.seriesHillTime * 1.5) - (p.seriesDeaths * 0.7);
            if (impactScore > highestImpactScore) {
                highestImpactScore = impactScore;
                mvpPlayer = p;
            }
        });
        const mvpTeam = teams.teamA.players.includes(mvpPlayer) ? teams.teamA : teams.teamB;
        ui.mvp.logo.src = mvpTeam.logo;
        ui.mvp.name.textContent = mvpPlayer.name;
        ui.mvp.team.textContent = mvpTeam.name;
        ui.mvp.kills.textContent = mvpPlayer.seriesKills;
        ui.mvp.deaths.textContent = mvpPlayer.seriesDeaths;
        ui.mvp.hillTime.textContent = `${mvpPlayer.seriesHillTime}s`;
        ui.mvp.card.style.borderColor = mvpTeam.color;
    }

    function populateFinalScoreboard() {
        ui.finalScoreboardContainer.innerHTML = '';
        [teams.teamA, teams.teamB].forEach(team => {
            let tableHTML = `<div class="final-scoreboard"><table class="w-full text-sm"><thead><tr><th class="text-left" style="color: ${team.color}">${team.name}</th><th class="text-center">Kills</th><th class="text-center">Deaths</th><th class="text-center">Hill Time</th></tr></thead><tbody>`;
            team.players.sort((a,b) => b.seriesKills - a.seriesKills).forEach(p => {
                tableHTML += `<tr class="border-t border-gray-700"><td class="font-bold">${p.name}</td><td class="text-center text-green-400">${p.seriesKills}</td><td class="text-center text-red-400">${p.seriesDeaths}</td><td class="text-center text-sky-400">${p.seriesHillTime}s</td></tr>`;
            });
            tableHTML += `</tbody></table></div>`;
            ui.finalScoreboardContainer.innerHTML += tableHTML;
        });
    }
    
    //================== NEW TRAINING FUNCTIONS ==================


    function executeTraining(drillType) {
    league.trainingCompletedThisWeek = true;
    
    // Hide the training options and show the progress bar
    ui.trainingAvailableContainer.classList.add('hidden');
    ui.trainingProgressContainer.classList.remove('hidden');

    // Reset progress bar
    const progressBar = ui.trainingProgressBar;
    progressBar.style.width = '0%';
    progressBar.style.transition = 'width 30s linear';

    // Trigger the animation
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 100);

    const statMap = {
        efficiency: 'Efficiency',
        pace: 'Pace',
        objective: 'Objective'
    };
    const statToTrain = statMap[drillType];

    // After 30 seconds, calculate results and show the modal
    setTimeout(() => {
        let resultsHTML = '';
        const playerTeam = TEAM_DATABASE[league.playerTeamId];

        playerTeam.players.forEach(player => {
            const roll = Math.random();
            let outcome = '';
            let originalStat = player.stats[statToTrain];

            if (roll < 0.05) {
                player.stats[statToTrain] += 2;
                outcome = `<p><strong style="color: ${playerTeam.color}">${player.name}</strong> had a breakthrough! ${statToTrain} <span class="text-gray-400">${originalStat} &rarr;</span> <strong class="text-yellow-400">${player.stats[statToTrain]} (+2)</strong></p>`;
            } else if (roll < 0.75) {
                player.stats[statToTrain] += 1;
                outcome = `<p><strong style="color: ${playerTeam.color}">${player.name}</strong> improved. ${statToTrain} <span class="text-gray-400">${originalStat} &rarr;</span> <strong class="text-green-400">${player.stats[statToTrain]} (+1)</strong></p>`;
            } else {
                outcome = `<p><strong style="color: ${playerTeam.color}">${player.name}</strong>'s training had no effect.</p>`;
            }
            resultsHTML += outcome;
        });

        renderRosterTab();
        // saveGame(); // <-- REMOVED THIS LINE

        ui.trainingProgressContainer.classList.add('hidden');
        ui.trainingResultsText.innerHTML = resultsHTML;
        ui.trainingResultsModal.classList.remove('hidden');

        renderTrainingTab();

    }, 30000);
}
    
    function toggleSimulationSpeed() {
        simulationSpeed = (simulationSpeed === 1) ? 5 : 1;
        ui.speedToggleBtn.textContent = `${simulationSpeed}x Speed`;
        if (gameState.isGameRunning) {
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, 1000 / simulationSpeed);
        }
    }
    
    //=========== SCRIPT EXECUTION ===========
    init();

    //=========== MULTIPLAYER LEAGUE FUNCTIONS ===========

    // Create a new private league
    async function createLeague(leagueName, maxTeams) {
        try {
            const leagueId = ID.unique();
            const league = await databases.createDocument(
                DATABASE_ID,
                LEAGUES_COLLECTION_ID,
                leagueId,
                {
                    name: leagueName,
                    maxTeams: parseInt(maxTeams),
                    currentTeams: 0,
                    status: 'forming', // forming, active, completed
                    createdBy: activeUser.$id,
                    createdAt: new Date().toISOString(),
                    teams: [],
                    members: []
                }
            );
            
            console.log('League created:', league);
            return league;
        } catch (error) {
            console.error('Error creating league:', error);
            throw error;
        }
    }

    // Join an existing league
    async function joinLeague(leagueId) {
        try {
            // Get the league
            const league = await databases.getDocument(
                DATABASE_ID,
                LEAGUES_COLLECTION_ID,
                leagueId
            );
            
            // Check if user is already a member
            const existingMembership = await databases.listDocuments(
                DATABASE_ID,
                LEAGUE_MEMBERS_COLLECTION_ID,
                [
                    Query.equal('leagueId', leagueId),
                    Query.equal('userId', activeUser.$id)
                ]
            );
            
            if (existingMembership.documents.length > 0) {
                throw new Error('You are already a member of this league');
            }
            
            // Check if league is full
            if (league.currentTeams >= league.maxTeams) {
                throw new Error('This league is full');
            }
            
            // Check if league is still forming
            if (league.status !== 'forming') {
                throw new Error('This league is no longer accepting members');
            }
            
            currentLeague = league;
            await loadAvailableTeams();
            showScreen('multiplayer-team-selection-screen');
            
        } catch (error) {
            console.error('Error joining league:', error);
            alert('Error joining league: ' + error.message);
        }
    }

    // Load available teams (teams not yet selected)
    async function loadAvailableTeams() {
        try {
            console.log('Loading available teams for league:', currentLeague.$id);
            
            // Get all current members
            const members = await databases.listDocuments(
                DATABASE_ID,
                LEAGUE_MEMBERS_COLLECTION_ID,
                [Query.equal('leagueId', currentLeague.$id)]
            );
            
            console.log('Found members:', members.documents);
            
            // Get all team IDs that are already taken
            const takenTeams = members.documents.map(member => member.teamId);
            
            // Filter available teams
            availableTeams = Object.keys(TEAM_DATABASE).filter(teamId => 
                !takenTeams.includes(teamId)
            );
            
            console.log('Available teams:', availableTeams);
            
            renderAvailableTeams();
            showScreen('multiplayer-team-selection-screen');
            
        } catch (error) {
            console.error('Error loading available teams:', error);
            // Fallback: show all teams as available
            availableTeams = Object.keys(TEAM_DATABASE);
            renderAvailableTeams();
            showScreen('multiplayer-team-selection-screen');
        }
    }

    // Render available teams grid
    function renderAvailableTeams() {
        ui.availableTeamsGrid.innerHTML = '';
        ui.leagueNameDisplay.textContent = currentLeague.name;
        
        availableTeams.forEach(teamId => {
            const team = TEAM_DATABASE[teamId];
            const teamCard = document.createElement('div');
            teamCard.className = 'bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 cursor-pointer transition-colors';
            teamCard.innerHTML = `
                <div class="text-center">
                    <img src="${team.logo}" alt="${team.name}" class="w-16 h-16 mx-auto mb-2 rounded-full">
                    <h3 class="font-bold text-lg">${team.name}</h3>
                    <p class="text-sm text-gray-400">Available</p>
                </div>
            `;
            
            teamCard.addEventListener('click', () => selectTeam(teamId));
            ui.availableTeamsGrid.appendChild(teamCard);
        });
    }

    // Select a team and join the league
    async function selectTeam(teamId) {
        try {
            // Create membership record
            const membership = await databases.createDocument(
                DATABASE_ID,
                LEAGUE_MEMBERS_COLLECTION_ID,
                ID.unique(),
                {
                    leagueId: currentLeague.$id,
                    userId: activeUser.$id,
                    userEmail: activeUser.email,
                    teamId: teamId,
                    joinedAt: new Date().toISOString()
                }
            );
            
            // Update league member count
            await databases.updateDocument(
                DATABASE_ID,
                LEAGUES_COLLECTION_ID,
                currentLeague.$id,
                {
                    currentTeams: currentLeague.currentTeams + 1,
                    teams: [...currentLeague.teams, teamId]
                }
            );
            
            userLeagueMembership = membership;
            playerTeamId = teamId;
            
            // Start the league season
            await startMultiplayerLeagueSeason();
            
        } catch (error) {
            console.error('Error selecting team:', error);
            alert('Error selecting team: ' + error.message);
        }
    }

    // Start multiplayer league season
    async function startMultiplayerLeagueSeason() {
        try {
            // Load all league members
            const members = await databases.listDocuments(
                DATABASE_ID,
                LEAGUE_MEMBERS_COLLECTION_ID,
                [Query.equal('leagueId', currentLeague.$id)]
            );
            
            leagueMembers = members.documents;
            
            // Generate schedule with all teams
            const allTeamIds = leagueMembers.map(member => member.teamId);
            const schedule = generateRoundRobinSchedule(allTeamIds);
            
            // Initialize league data
            league = {
                schedule: schedule,
                currentWeek: 1,
                standings: allTeamIds.map(id => ({ id: id, wins: 0, losses: 0 })),
                playerTeamId: playerTeamId,
                trainingCompletedThisWeek: false,
                playerCoins: 0,
                isMultiplayer: true,
                leagueId: currentLeague.$id
            };
            
            // Update league status to active
            await databases.updateDocument(
                DATABASE_ID,
                LEAGUES_COLLECTION_ID,
                currentLeague.$id,
                { status: 'active' }
            );
            
            renderLeagueHub();
            showScreen('league-hub-screen');
            renderTrainingTab();
            renderRosterTab();
            generateFreeAgents();
            renderMarketTab();
            
        } catch (error) {
            console.error('Error starting multiplayer league:', error);
        }
    }

    // Check if user is in a multiplayer league
    async function checkMultiplayerLeague() {
        try {
            const memberships = await databases.listDocuments(
                DATABASE_ID,
                LEAGUE_MEMBERS_COLLECTION_ID,
                [Query.equal('userId', activeUser.$id)]
            );
            
            if (memberships.documents.length > 0) {
                const membership = memberships.documents[0];
                const league = await databases.getDocument(
                    DATABASE_ID,
                    LEAGUES_COLLECTION_ID,
                    membership.leagueId
                );
                
                currentLeague = league;
                userLeagueMembership = membership;
                playerTeamId = membership.teamId;
                
                // Load league data and continue season
                await startMultiplayerLeagueSeason();
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error checking multiplayer league:', error);
            return false;
        }
    }
});