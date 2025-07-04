document.addEventListener('DOMContentLoaded', () => {

    //=========== GLOBAL STATE & DATABASE ===========
    const TEAM_DATABASE = {
        'faze': { name: "Atlanta FaZe", logo: "https://placehold.co/50x50/E23435/FFFFFF?text=FaZe", color: "#e23435", players: [ { name: "Simp", stats: { Overall: 93, Pace: 80, Efficiency: 88, Objective: 86 } }, { name: "Cellium", stats: { Overall: 94, Pace: 71, Efficiency: 94, Objective: 81 } }, { name: "Drazah", stats: { Overall: 91, Pace: 81, Efficiency: 87, Objective: 80 } }, { name: "aBeZy", stats: { Overall: 90, Pace: 80, Efficiency: 80, Objective: 79 } }, ] },
        'thieves': { name: "LA Thieves", logo: "https://placehold.co/50x50/000000/FFFFFF?text=LAT", color: "#000000", players: [ { name: "Envoy", stats: { Overall: 93, Pace: 81, Efficiency: 80, Objective: 97 } }, { name: "Ghosty", stats: { Overall: 94, Pace: 76, Efficiency: 84, Objective: 99 } }, { name: "Scrap", stats: { Overall: 99, Pace: 93, Efficiency: 91, Objective: 81 } }, { name: "Kremp", stats: { Overall: 90, Pace: 94, Efficiency: 93, Objective: 69 } }, ] },
        'optic': { name: "OpTic Texas", logo: "https://placehold.co/50x50/93C94E/000000?text=OpTic", color: "#93c94e", players: [ { name: "Dashy", stats: { Overall: 96, Pace: 75, Efficiency: 95, Objective: 75 } }, { name: "Kenny", stats: { Overall: 92, Pace: 85, Efficiency: 88, Objective: 88 } }, { name: "Shotzzy", stats: { Overall: 94, Pace: 98, Efficiency: 90, Objective: 80 } }, { name: "Pred", stats: { Overall: 95, Pace: 92, Efficiency: 94, Objective: 78 } }, ] },
        'ultra': { name: "Toronto Ultra", logo: "https://placehold.co/50x50/7B42F6/FFFFFF?text=Ultra", color: "#782cf2", players: [ { name: "CleanX", stats: { Overall: 91, Pace: 95, Efficiency: 89, Objective: 82 } }, { name: "Insight", stats: { Overall: 93, Pace: 70, Efficiency: 92, Objective: 90 } }, { name: "Envoy", stats: { Overall: 93, Pace: 81, Efficiency: 80, Objective: 97 } }, { name: "Scrappy", stats: { Overall: 99, Pace: 93, Efficiency: 91, Objective: 81 } }, ] },
        'nysl': { name: "New York Subliners", logo: "https://placehold.co/50x50/F2D649/000000?text=NYSL", color: "#f2d649", players: [ { name: "Viper", stats: { Overall: 58, Pace: 55, Efficiency: 60, Objective: 51 } }, { name: "Rogue", stats: { Overall: 56, Pace: 59, Efficiency: 52, Objective: 58 } }, { name: "Spectre", stats: { Overall: 59, Pace: 51, Efficiency: 57, Objective: 55 } }, { name: "Blaze", stats: { Overall: 52, Pace: 60, Efficiency: 54, Objective: 53 } }, ] },
        'breach': { name: "Boston Breach", logo: "https://placehold.co/50x50/004F31/FFFFFF?text=BOS", color: "#004f31", players: [ { name: "Havoc", stats: { Overall: 55, Pace: 58, Efficiency: 51, Objective: 59 } }, { name: "Jester", stats: { Overall: 60, Pace: 52, Efficiency: 58, Objective: 54 } }, { name: "Nomad", stats: { Overall: 53, Pace: 59, Efficiency: 55, Objective: 52 } }, { name: "Frost", stats: { Overall: 57, Pace: 54, Efficiency: 59, Objective: 57 } }, ] },
        'ravens': { name: "Carolina Royal Ravens", logo: "https://placehold.co/50x50/00AEEF/FFFFFF?text=CRR", color: "#00aeef", players: [ { name: "Wraith", stats: { Overall: 58, Pace: 60, Efficiency: 53, Objective: 51 } }, { name: "Cobra", stats: { Overall: 54, Pace: 51, Efficiency: 59, Objective: 58 } }, { name: "Apex", stats: { Overall: 59, Pace: 55, Efficiency: 54, Objective: 56 } }, { name: "Omen", stats: { Overall: 56, Pace: 57, Efficiency: 57, Objective: 53 } }, ] },
        'legion': { name: "Vegas Legion", logo: "https://placehold.co/50x50/E7B500/000000?text=LV", color: "#e7b500", players: [ { name: "Reaper", stats: { Overall: 60, Pace: 59, Efficiency: 58, Objective: 54 } }, { name: "Shadow", stats: { Overall: 52, Pace: 53, Efficiency: 52, Objective: 59 } }, { name: "Ghost", stats: { Overall: 57, Pace: 58, Efficiency: 56, Objective: 51 } }, { name: "Zenith", stats: { Overall: 55, Pace: 54, Efficiency: 59, Objective: 57 } }, ] }
    };

    let selectedTeamA_id = null, selectedTeamB_id = null, playstyleA = 'balanced', playstyleB = 'balanced', playerTeamId = null;
    let gameInterval = null, gameState = {}, teams = {}, simulationSpeed = 1;
    let matchFormat = 1, seriesScore = { teamA: 0, teamB: 0 }, currentGameInSeries = 1;
    let currentMode = 'menu';
    let tournament = {};
    let league = {};

    const ui = {
        mainMenuScreen: document.getElementById('main-menu-screen'),
        teamSelectionScreen: document.getElementById('team-selection-screen'),
        tournamentSetupScreen: document.getElementById('tournament-setup-screen'),
        tournamentBracketScreen: document.getElementById('tournament-bracket-screen'),
        franchiseSetupScreen: document.getElementById('franchise-setup-screen'),
        leagueHubScreen: document.getElementById('league-hub-screen'),
        simulationScreen: document.getElementById('simulation-screen'),
        postMatchScreen: document.getElementById('post-match-screen'),
        menuSingleMatchBtn: document.getElementById('menu-single-match-btn'),
        menuTournamentBtn: document.getElementById('menu-tournament-btn'),
        menuLeagueBtn: document.getElementById('menu-league-btn'),
        tournamentTeamSelectionGrid: document.getElementById('tournament-team-selection-grid'),
        tournamentTeamCount: document.getElementById('tournament-team-count'),
        tournamentStartBtn: document.getElementById('tournament-start-btn'),
        tournamentBackBtn: document.getElementById('tournament-back-btn'),
        bracketContainer: document.getElementById('bracket-container'),
        bracketHeaderTitle: document.getElementById('bracket-header-title'),
        bracketBackBtn: document.getElementById('bracket-back-btn'),
        leagueStandingsBody: document.getElementById('league-standings-body'),
        weeklyMatchupsContainer: document.getElementById('weekly-matchups-container'),
        leaguePlayMatchBtn: document.getElementById('league-play-match-btn'),
        leagueBackBtn: document.getElementById('league-back-btn'),
        leagueWeekTitle: document.getElementById('league-week-title'),
        franchiseSelectionGrid: document.getElementById('franchise-selection-grid'),
        yourFranchiseDisplay: document.getElementById('your-franchise-display'),
        startLeagueBtn: document.getElementById('start-league-btn'),
        franchiseBackBtn: document.getElementById('franchise-back-btn'),
        killfeedContainer: document.getElementById('killfeed-container'),
        teamListContainer: document.getElementById('team-list-container'),
        selectionSlotA: document.getElementById('selection-slot-a'),
        selectionSlotB: document.getElementById('selection-slot-b'),
        startMatchBtn: document.getElementById('start-match-btn'),
        resetSelectionBtn: document.getElementById('reset-selection-btn'),
        backToSelectionBtn: document.getElementById('back-to-selection-btn'),
        backToMenuBtn: document.getElementById('back-to-menu-btn'),
        playstyleButtons: document.querySelectorAll('.playstyle-btn'),
        matchFormatButtons: document.querySelectorAll('.match-format-btn'),
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
        mvp: { card: document.getElementById('mvp-card'), logo: document.getElementById('mvp-logo'), name: document.getElementById('mvp-name'), team: document.getElementById('mvp-team'), kills: document.getElementById('mvp-kills'), deaths: document.getElementById('mvp-deaths'), hillTime: document.getElementById('mvp-hilltime'), },
        finalScoreboardContainer: document.getElementById('final-scoreboard-container'),
    };
    
    // All functions are now declared in a logical order to prevent ReferenceErrors.
    // Helper functions are defined before they are called by more complex functions.

    // --- UTILITY & UI HELPERS ---
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
        const { name, stats } = player;
        const card = document.createElement('div');
        card.id = `player-${teamId}-${name}`;
        card.className = `p-4 rounded-lg border border-gray-700 bg-gray-900 transition-all duration-300`;
        card.innerHTML = `<div class="flex justify-between items-center"><h3 class="text-lg font-bold">${name}</h3><div id="player-status-${teamId}-${name}" class="text-sm font-semibold text-green-400">ALIVE</div></div><div class="player-stat-grid mt-2 text-sm text-gray-300"><span><strong>Overall:</strong> ${stats.Overall}</span><span><strong>Pace:</strong> ${stats.Pace}</span><span><strong>Efficiency:</strong> ${stats.Efficiency}</span><span><strong>Objective:</strong> ${stats.Objective}</span></div><div class="flex justify-between mt-3 pt-3 border-t border-gray-700 text-sm"><span class="font-semibold">Kills: <span id="kills-${teamId}-${name}" class="font-normal text-green-400">0</span></span><span class="font-semibold">Deaths: <span id="deaths-${teamId}-${name}" class="font-normal text-red-400">0</span></span><span class="font-semibold">Hill Time: <span id="hilltime-${teamId}-${name}" class="font-normal text-sky-400">0s</span></span></div>`;
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

    function updateSlot(slot, teamId) {
        if (teamId) {
            const team = TEAM_DATABASE[teamId];
            slot.innerHTML = `<img src="${team.logo}" alt="${team.name}" class="w-12 h-12 mb-2 rounded-full"><p class="font-bold">${team.name}</p>`;
            slot.classList.add('filled');
        } else {
            const slotNumber = slot.id.includes('a') ? 1 : 2;
            slot.innerHTML = `<p class="text-gray-500">Team ${slotNumber}</p>`;
            slot.classList.remove('filled');
        }
    }

    function selectPlayerForGunfight(team) {
        const alivePlayers = team.players.filter(p => p.isAlive);
        if (alivePlayers.length === 0) {
            return null;
        }
        const totalPace = alivePlayers.reduce((sum, p) => sum + p.stats.Pace, 0);
        let rand = Math.random() * totalPace;
        for (const player of alivePlayers) {
            rand -= player.stats.Pace;
            if (rand <= 0) {
                return player;
            }
        }
        return alivePlayers[alivePlayers.length - 1];
    }
    
    function awardHillTime(scoringPlayers) {
        if (scoringPlayers.length === 0) return;
        const playersOnHillRoll = Math.random();
        let numPlayersToCredit = 1;
        if (scoringPlayers.length > 1) {
            if (playersOnHillRoll < 0.80) { numPlayersToCredit = 1; }
            else if (playersOnHillRoll < 0.90) { numPlayersToCredit = 2; }
            else if (playersOnHillRoll < 0.95) { numPlayersToCredit = 3; }
            else { numPlayersToCredit = 4; }
        }
        numPlayersToCredit = Math.min(numPlayersToCredit, scoringPlayers.length);
        let lotteryPool = [];
        scoringPlayers.forEach(player => {
            for (let i = 0; i < player.stats.Objective; i++) {
                lotteryPool.push(player);
            }
        });
        for (let i = 0; i < numPlayersToCredit; i++) {
            if (lotteryPool.length === 0) break;
            const winnerIndex = Math.floor(Math.random() * lotteryPool.length);
            const winner = lotteryPool[winnerIndex];
            winner.hillTime++;
            lotteryPool = lotteryPool.filter(p => p !== winner);
        }
    }

    // --- GAME STATE LOGIC ---
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
                const card = document.getElementById(`player-${teamId}-${player.name}`);
                const statusDiv = document.getElementById(`player-status-${teamId}-${player.name}`);
                if (card && statusDiv) {
                    if (player.isAlive) {
                        card.classList.remove('respawning');
                        statusDiv.textContent = 'ALIVE';
                        statusDiv.className = 'text-sm font-semibold text-green-400';
                    } else {
                        card.classList.add('respawning');
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
        let state = 'Empty', stateColorClass = 'text-gray-400', isAnyoneScoring = false;
        if (totalObjective > 0) {
            const contestChance = 0.05, emptyChance = 0.15, rand = Math.random();
            const probA = totalObjectiveA / totalObjective;
            if (rand < probA * (1 - contestChance - emptyChance)) {
                state = `${teams.teamA.name} Scoring`;
                stateColorClass = `text-[${teams.teamA.color}]`;
                gameState.teamAScore++;
                isAnyoneScoring = true;
                awardHillTime(aliveA);
            } else if (rand < (1 - contestChance - emptyChance)) {
                state = `${teams.teamB.name} Scoring`;
                stateColorClass = `text-[${teams.teamB.color}]`;
                gameState.teamBScore++;
                isAnyoneScoring = true;
                awardHillTime(aliveB);
            } else if (rand < (1 - emptyChance)) {
                state = 'Contested';
                stateColorClass = 'text-amber-400';
            }
        }
        ui.hillState.textContent = state;
        ui.hillState.className = `text-2xl font-bold ${stateColorClass}`;
        if (!isAnyoneScoring && gameState.gameTimer > 0) gameState.gameTimer--;
    }

    function simulateGunfight() {
        const playerA = selectPlayerForGunfight(teams.teamA);
        const playerB = selectPlayerForGunfight(teams.teamB);
        if (!playerA || !playerB) return;
        const efficiencyA = playerA.stats.Efficiency;
        const efficiencyB = playerB.stats.Efficiency;
        const totalEfficiency = efficiencyA + efficiencyB;
        const probA_wins = efficiencyA / totalEfficiency;
        let winner, loser, winnerTeam, loserTeam;
        if (Math.random() < probA_wins) {
            winner = playerA; loser = playerB; winnerTeam = teams.teamA; loserTeam = teams.teamB;
        } else {
            winner = playerB; loser = playerA; winnerTeam = teams.teamB; loserTeam = teams.teamA;
        }
        loser.isAlive = false;
        loser.respawnTimer = 5;
        winner.kills++;
        loser.deaths++;
        const winnerTeamId = (winnerTeam === teams.teamA) ? 'A' : 'B';
        const loserTeamId = (loserTeam === teams.teamA) ? 'A' : 'B';
        updatePlayerCardUI(winner, winnerTeamId);
        updatePlayerCardUI(loser, loserTeamId);
        logEvent(`<strong style="color: ${winnerTeam.color}">${winner.name}</strong> eliminated <strong style="color: ${loserTeam.color}">${loser.name}</strong>!`, winnerTeam.color);
        showKillFeedEvent(winner, loser, winnerTeam, loserTeam);
    }

    function runGunfightCycle() {
        const aliveA = teams.teamA.players.filter(p => p.isAlive).length;
        const aliveB = teams.teamB.players.filter(p => p.isAlive).length;
        const maxFights = Math.min(aliveA, aliveB, 4);
        if (maxFights === 0) return;
        const numFights = Math.floor(Math.random() * maxFights) + 1;
        for (let i = 0; i < numFights; i++) {
            simulateGunfight();
        }
    }

    function checkWinConditions() {
        if (gameState.teamAScore >= 250) {
            stopSimulation(`${teams.teamA.name} win the game!`, 'teamA');
        } else if (gameState.teamBScore >= 250) {
            stopSimulation(`${teams.teamB.name} win the game!`, 'teamB');
        } else if (gameState.gameTimer <= 0) {
            let winnerMessage, winnerId;
            if (gameState.teamAScore > gameState.teamBScore) {
                winnerMessage = `${teams.teamA.name} win on time!`;
                winnerId = 'teamA';
            } else if (gameState.teamBScore > gameState.teamAScore) {
                winnerMessage = `${teams.teamB.name} win on time!`;
                winnerId = 'teamB';
            } else {
                winnerMessage = "It's a draw!";
                winnerId = 'draw';
            }
            stopSimulation(winnerMessage, winnerId);
        }
    }
    
    // --- GAME & SERIES FLOW CONTROL ---
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
        const winnerId = seriesScore.teamA > seriesScore.teamB ? selectedTeamA_id : selectedTeamB_id;
        const loserId = seriesScore.teamA > seriesScore.teamB ? selectedTeamB_id : selectedTeamA_id;

        if (currentMode === 'coach_league') {
            const winnerStanding = league.standings.find(s => s.id === winnerId);
            const loserStanding = league.standings.find(s => s.id === loserId);
            if (winnerStanding) winnerStanding.wins++;
            if (loserStanding) loserStanding.losses++;
            
            league.currentWeek++;
            renderLeagueHub();
            showScreen('league-hub-screen');
        } else if (currentMode === 'tournament') {
            const matchId = tournament.currentMatchId;
            const round = tournament.bracket.quarterfinals.find(m => m.id === matchId) ? 'quarterfinals' : tournament.bracket.semifinals.find(m => m.id === matchId) ? 'semifinals' : 'finals';
            const match = tournament.bracket[round].find(m => m.id === matchId);
            match.winner = winnerId;
            match.result = `${seriesScore.teamA}-${seriesScore.teamB}`;
            if (round === 'quarterfinals') {
                const sfIndex = Math.floor(['qf1', 'qf2', 'qf3', 'qf4'].indexOf(matchId) / 2);
                const teamSlot = ['qf1', 'qf3'].includes(matchId) ? 0 : 1;
                tournament.bracket.semifinals[sfIndex].teams[teamSlot] = winnerId;
            } else if (round === 'semifinals') {
                const teamSlot = ['sf1'].includes(matchId) ? 0 : 1;
                tournament.bracket.finals[0].teams[teamSlot] = winnerId;
            }
            renderBracket();
            showScreen('tournament-bracket-screen');
            if (round === 'finals') {
                setTimeout(() => {
                    ui.bracketHeaderTitle.textContent = `${TEAM_DATABASE[winnerId].name} are the Champions!`;
                }, 200);
            }
        } else { // singleMatch
            calculateAndDisplayMVP();
            populateFinalScoreboard();
            showScreen('post-match-screen');
        }
    }
    
    function startLeagueSeason() {
        if (!playerTeamId) return;
        currentMode = 'coach_league';
        const allTeamIds = Object.keys(TEAM_DATABASE);
        const opponentIds = allTeamIds.filter(id => id !== playerTeamId);
        const leagueTeams = [playerTeamId, ...opponentIds].slice(0, 8);
        const schedule = generateRoundRobinSchedule(leagueTeams);
        league = {
            schedule: schedule,
            currentWeek: 1,
            standings: leagueTeams.map(id => ({ id: id, wins: 0, losses: 0 })),
            teamPlaystyles: {} 
        };
        leagueTeams.forEach(id => { league.teamPlaystyles[id] = 'balanced'; });
        renderLeagueHub();
        showScreen('league-hub-screen');
        ui.leaguePlayMatchBtn.disabled = false;
        ui.leagueSimSeasonBtn.disabled = false;
    }
    
    function handleSimulateWeek() {
        const currentWeekData = league.schedule.find(w => w.week === league.currentWeek);
        if (!currentWeekData || !playerTeamId) return;
        ui.leaguePlayMatchBtn.disabled = true;
        ui.leaguePlayMatchBtn.textContent = 'Simulating...';
        const aiMatchups = currentWeekData.matchups.filter(m => !m.teams.includes(playerTeamId));
        const playerMatchup = currentWeekData.matchups.find(m => m.teams.includes(playerTeamId));
        aiMatchups.forEach(match => {
            if (!match.winner) {
                const winnerId = simulateSeriesHeadless(match.teams[0], match.teams[1], 5);
                const loserId = match.teams.find(id => id !== winnerId);
                const winnerStanding = league.standings.find(s => s.id === winnerId);
                const loserStanding = league.standings.find(s => s.id === loserId);
                if (winnerStanding) winnerStanding.wins++;
                if (loserStanding) loserStanding.losses++;
            }
        });
        renderLeagueHub();
        logEvent(`AI matches for Week ${league.currentWeek} simulated. Preparing your match...`, '#a1a1aa');
        setTimeout(() => {
            if (playerMatchup && !playerMatchup.winner) {
                simulateTournamentSeries(playerMatchup.id);
            } else {
                league.currentWeek++;
                renderLeagueHub();
                ui.leaguePlayMatchBtn.disabled = false;
                ui.leaguePlayMatchBtn.textContent = 'Play Your Match';
            }
        }, 2000);
    }
    
    function simulateSeriesHeadless(teamA_id, teamB_id, numGames) {
        const winsNeeded = Math.ceil(numGames / 2);
        let scoreA = 0, scoreB = 0;
        const teamA_data = JSON.parse(JSON.stringify(TEAM_DATABASE[teamA_id]));
        const teamB_data = JSON.parse(JSON.stringify(TEAM_DATABASE[teamB_id]));
        applyPlaystyle(teamA_data, null, teamA_id);
        applyPlaystyle(teamB_data, null, teamB_id);
        const localTeams = { teamA: teamA_data, teamB: teamB_data };
        while (scoreA < winsNeeded && scoreB < winsNeeded) {
            const totalOverallA = localTeams.teamA.players.reduce((sum, p) => sum + p.stats.Overall, 0);
            const totalOverallB = localTeams.teamB.players.reduce((sum, p) => sum + p.stats.Overall, 0);
            if (Math.random() * (totalOverallA + totalOverallB) < totalOverallA) {
                scoreA++;
            } else {
                scoreB++;
            }
        }
        return scoreA > scoreB ? teamA_id : teamB_id;
    }

    function calculateAndDisplayMVP() {
        const allPlayers = [...teams.teamA.players, ...teams.teamB.players];
        let mvpPlayer = null;
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
            team.players.forEach(p => {
                tableHTML += `<tr class="border-t border-gray-700"><td class="font-bold">${p.name}</td><td class="text-center text-green-400">${p.seriesKills}</td><td class="text-center text-red-400">${p.seriesDeaths}</td><td class="text-center text-sky-400">${p.seriesHillTime}s</td></tr>`;
            });
            tableHTML += `</tbody></table></div>`;
            ui.finalScoreboardContainer.innerHTML += tableHTML;
        });
    }
    
    function toggleSimulationSpeed() {
        simulationSpeed = (simulationSpeed === 1) ? 3 : 1;
        ui.speedToggleBtn.textContent = `${simulationSpeed}x Speed`;
        ui.speedToggleBtn.classList.toggle('speed-btn-active', simulationSpeed > 1);
        if (gameState.isGameRunning) {
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, 1000 / simulationSpeed);
        }
    }
    
    function generateRoundRobinSchedule(teamIds) {
        const schedule = [];
        const teams = [...teamIds];
        if (teams.length % 2 !== 0) {
            teams.push('BYE');
        }
        const numWeeks = teams.length - 1;
        const numMatchesPerWeek = teams.length / 2;
        for (let week = 0; week < numWeeks; week++) {
            const weeklyMatchups = [];
            for (let i = 0; i < numMatchesPerWeek; i++) {
                const teamA = teams[i];
                const teamB = teams[teams.length - 1 - i];
                if (teamA !== 'BYE' && teamB !== 'BYE') {
                    weeklyMatchups.push({ id: `w${week + 1}m${i + 1}`, teams: [teamA, teamB], winner: null, result: null });
                }
            }
            schedule.push({ week: week + 1, matchups: weeklyMatchups });
            const lastTeam = teams.pop();
            teams.splice(1, 0, lastTeam);
        }
        return schedule;
    }
    
    init();
});