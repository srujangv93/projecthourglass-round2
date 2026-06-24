/* ==========================================================================
   PROJECT REWIND - ADVANCED SCIENTIST ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // GLOBAL APPLICATION STATE
  // ==========================================================================
  const systemState = {
    audioInitialized: false,
    currentRoom: null, // 'livingroom', 'playground', 'classroom' or null (selection lobby)
    repairedSectors: {
      livingroom: false,
      playground: false,
      classroom: false
    },
    
    // Living Room Round States
    lrRound: 1,
    lrPlaying: false,
    
    // Playground Round States
    pgRound: 1,
    pgDiffFound: { swing: false, bicycle: false, football: false },
    pgDiffCount: 0,
    pgBlurredSolved: false,
    
    // Classroom Hotspots Inspections
    classSeen: {
      Blackboard: false,
      WindowDesk: false,
      Notebook: false,
      Clock: false,
      Register: false,
      Photo: false,
      Bag: false
    }
  };

  // Audio Playback Trackers
  let currentAudioInstance = null;

  // DOM Elements Cache
  const elements = {
    canvas: document.getElementById('ambient-canvas'),
    audioToggleBtn: document.getElementById('audio-toggle-btn'),
    audioBtnText: document.getElementById('audio-btn-text'),
    btnEnterSystem: document.getElementById('btn-enter-system'),
    
    // Views
    viewLanding: document.getElementById('view-landing'),
    viewSelection: document.getElementById('view-selection'),
    viewLoader: document.getElementById('view-loader'),
    viewEnding: document.getElementById('view-ending'),
    immersiveMemorySpace: document.getElementById('immersive-memory-space'),
    
    // Status metrics
    lblStatusLivingroom: document.getElementById('lbl-status-livingroom'),
    lblStatusPlayground: document.getElementById('lbl-status-playground'),
    lblStatusClassroom: document.getElementById('lbl-status-classroom'),
    lblHoloIntegrity: document.getElementById('lbl-obsidian-integrity') || document.getElementById('hologram-integrity-text'),
    hudIntegrity: document.getElementById('lbl-obsidian-integrity'),
    hudSectors: document.getElementById('lbl-obsidian-sectors'),
    
    // Global room navigation
    lblActiveRoomTag: document.getElementById('lbl-active-room-tag'),
    btnLeaveMemory: document.getElementById('btn-leave-memory'),
    btnEndExploration: document.getElementById('btn-end-exploration'),
    btnTriggerNextRoom: document.querySelectorAll('.btn-trigger-next-room'),
    
    // Card Clicks
    cardLivingroom: document.getElementById('card-livingroom'),
    cardPlayground: document.getElementById('card-playground'),
    cardClassroom: document.getElementById('card-classroom'),
    
    // Immersive Panels
    roomLivingroom: document.getElementById('room-livingroom'),
    roomPlayground: document.getElementById('room-playground'),
    roomClassroom: document.getElementById('room-classroom'),
    
    // Living Room Elements
    lrClockTime: document.getElementById('lr-clock-time'),
    lrTvNoise: document.getElementById('lr-tv-noise-overlay'),
    lrTvWave: document.getElementById('lr-tv-waveform-overlay'),
    lrTvCaption: document.getElementById('lr-tv-screen-caption'),
    lrRemoteWidget: document.getElementById('lr-remote-widget'),
    btnPlayLr1: document.getElementById('btn-play-lr-1'),
    btnPlayLr2: document.getElementById('btn-play-lr-2'),
    btnPlayLr3: document.getElementById('btn-play-lr-3'),
    waveVis1: document.getElementById('wave-vis-1'),
    waveVis2: document.getElementById('wave-vis-2'),
    waveVis3: document.getElementById('wave-vis-3'),
    lrQuizChoices: document.querySelectorAll('#lr-round-success-card ~ .quiz-choices-stack .quiz-choice-btn, #lr-r1 .quiz-choice-btn, #lr-r2 .quiz-choice-btn'),
    inputLrDecode: document.getElementById('input-lr-decode'),
    btnSubmitLr3: document.getElementById('btn-submit-lr-3'),
    lrRoundSuccessCard: document.getElementById('lr-round-success-card'),
    lblLrSuccessTitle: document.getElementById('lbl-lr-success-title'),
    btnLrProceedRound: document.getElementById('btn-lr-proceed-round'),
    lrMemoryRestoredCard: document.getElementById('lr-memory-restored-card'),
    
    // Playground Elements
    lblPgDiffFound: document.getElementById('lbl-pg-diff-found'),
    spotSwing: document.getElementById('spot-swing'),
    spotBicycle: document.getElementById('spot-bicycle'),
    spotFootball: document.getElementById('spot-football'),
    pgSunsetBlurImg: document.getElementById('pg-sunset-blur-img'),
    pgFallbackBlur: document.getElementById('pg-fallback-blur-filter'),
    pgBlurCaption: document.getElementById('lbl-pg-blur-status'),
    pgBlurChoices: document.querySelectorAll('.pg-blur-choice'),
    pgSuccessCue: document.getElementById('pg-round-success-card'),
    lblPgSuccessTitle: document.getElementById('lbl-pg-success-title'),
    pgProceedRoundBtn: document.getElementById('btn-pg-proceed-round'),
    pgEndScreen: document.getElementById('pg-memory-restored-card'),
    pgGlitchyPhotoFrame: document.getElementById('pg-glitchy-photo-frame'),
    
    // Classroom Elements
    classroomHotspots: document.querySelectorAll('.classroom-hotspot'),
    classReadoutLogs: document.getElementById('class-readout-logs'),
    inputClassPasscode: document.getElementById('input-class-passcode'),
    btnClassVerify: document.getElementById('btn-class-verify'),
    lblClassVerifyStatus: document.getElementById('lbl-class-verify-status'),
    
    // Ending Elements
    endingLoaderBox: document.getElementById('ending-loader-box'),
    endingSummaryBox: document.getElementById('ending-summary-box'),
    endingFinalBlack: document.getElementById('ending-final-black'),
    endingHauntingLine: document.getElementById('ending-haunting-line')
  };

  // ==========================================================================
  // WEB AUDIO SYS SYNTH SOUND ENGINE (FAILSAFE GENERATORS)
  // ==========================================================================
  let audioCtx = null;
  let synthDrone = null;
  let synthDroneFilter = null;
  let droneGain = null;

  function initAudio() {
    if (systemState.audioInitialized) return;
    
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Ambient warm laboratory sub hum
      synthDrone = audioCtx.createOscillator();
      const synthSub = audioCtx.createOscillator();
      synthDroneFilter = audioCtx.createBiquadFilter();
      droneGain = audioCtx.createGain();
      
      synthDrone.type = 'sawtooth';
      synthDrone.frequency.value = 65.41; // C2 Low Hum
      
      synthSub.type = 'sine';
      synthSub.frequency.value = 32.70; // C1 Sub Hum
      
      synthDroneFilter.type = 'lowpass';
      synthDroneFilter.frequency.value = 140; // Soft lowpass
      synthDroneFilter.Q.value = 2;
      
      droneGain.gain.value = 0.05;
      
      synthDrone.connect(synthDroneFilter);
      synthSub.connect(synthDroneFilter);
      synthDroneFilter.connect(droneGain);
      droneGain.connect(audioCtx.destination);
      
      synthDrone.start();
      synthSub.start();
      
      systemState.audioInitialized = true;
      elements.audioBtnText.innerText = "SOUND ON";
      elements.audioToggleBtn.classList.add('hud-active');
    } catch (e) {
      console.warn("Web Audio API not allowed or supported: ", e);
    }
  }

  function toggleAudio() {
    if (!systemState.audioInitialized) {
      initAudio();
      return;
    }
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
      elements.audioBtnText.innerText = "SOUND ON";
      elements.audioToggleBtn.classList.remove('text-dim');
    } else if (audioCtx.state === 'running') {
      audioCtx.suspend();
      elements.audioBtnText.innerText = "SOUND OFF";
      elements.audioToggleBtn.classList.add('text-dim');
    }
  }

  function playBeep(freq = 600, duration = 0.1, type = 'sine') {
    if (!systemState.audioInitialized || audioCtx.state !== 'running') return;
    
    try {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.error(e);
    }
  }

  // Melodic rise on round clear
  function playMelodicChime() {
    if (!systemState.audioInitialized || audioCtx.state !== 'running') return;
    
    const scale = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    scale.forEach((freq, idx) => {
      setTimeout(() => playBeep(freq, 0.25, 'triangle'), idx * 120);
    });
  }

  // Failsafe Synthesized audio loops
  function playDiagnosticSynthesizer(type) {
    if (!systemState.audioInitialized || audioCtx.state !== 'running') return;
    
    if (type === 'cartoon') {
      // Cheerful ascending/descending notes
      const notes = [392.00, 440.00, 493.88, 392.00, 523.25, 493.88];
      notes.forEach((freq, i) => {
        setTimeout(() => playBeep(freq, 0.15, 'sine'), i * 180);
      });
    } else if (type === 'ad') {
      // Cute bouncy jingle melody
      const notes = [293.66, 349.23, 293.66, 440.00, 587.33];
      notes.forEach((freq, i) => {
        setTimeout(() => playBeep(freq, 0.18, 'triangle'), i * 150);
      });
    } else if (type === 'distorted') {
      // Oscillating telephone sound
      let c = 0;
      const ring = setInterval(() => {
        playBeep(980, 0.05, 'sawtooth');
        c++;
        if (c > 20) clearInterval(ring);
      }, 50);
    } else if (type === 'glitch') {
      // Cyber static burst
      let c = 0;
      const glitch = setInterval(() => {
        playBeep(Math.random() * 1800 + 300, 0.04, 'sawtooth');
        c++;
        if (c > 12) clearInterval(glitch);
      }, 40);
    }
  }

  // Warnings system siren during ending ejection
  function playScientistEmergencySiren() {
    if (!systemState.audioInitialized || audioCtx.state !== 'running') return;
    
    const filter = synthDroneFilter;
    const gain = droneGain;
    
    if (!filter || !gain) return;
    
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    
    let isHigh = false;
    const alarm = setInterval(() => {
      if (elements.viewEnding.classList.contains('hidden')) {
        clearInterval(alarm);
        return;
      }
      
      if (isHigh) {
        filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.5);
        playBeep(150, 0.5, 'sine');
      } else {
        filter.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.5);
        playBeep(190, 0.5, 'sine');
      }
      isHigh = !isHigh;
    }, 600);
  }

  elements.audioToggleBtn.addEventListener('click', toggleAudio);

  // ==========================================================================
  // SCIENTIST CENTRAL SYSTEM PARTICLES (AMBIENT SPHERES NETWORK)
  // ==========================================================================
  const ctx = elements.canvas.getContext('2d');
  let particles = [];
  let width = (elements.canvas.width = window.innerWidth);
  let height = (elements.canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = elements.canvas.width = window.innerWidth;
    height = elements.canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.radius = Math.random() * 3 + 2;
      // High end soft blue/purple glows
      this.color = Math.random() > 0.5 ? 'rgba(0, 243, 255, ' : 'rgba(189, 0, 255, ';
      this.alpha = Math.random() * 0.35 + 0.05;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 243, 255, ${0.08 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  function triggerNodeTurbulence() {
    particles.forEach(p => {
      p.vx *= 12;
      p.vy *= 12;
      p.alpha = 0.7;
    });
    setTimeout(() => {
      particles.forEach(p => {
        p.vx = (Math.random() - 0.5) * 0.25;
        p.vy = (Math.random() - 0.5) * 0.25;
        p.alpha = Math.random() * 0.35 + 0.05;
      });
    }, 1200);
  }

  // ==========================================================================
  // BOOT INTERFACE INITIALIZER
  // ==========================================================================
  elements.btnEnterSystem.addEventListener('click', () => {
    initAudio();
    playBeep(1000, 0.15);
    triggerNodeTurbulence();
    
    elements.viewLanding.classList.add('fade-out');
    
    setTimeout(() => {
      elements.viewLanding.classList.add('hidden');
      document.getElementById('view-obsidian-workspace').classList.remove('hidden');
      initObsidianWorkspace(); // Boot Obsidian Graph & sidebar explorer
      playBeep(700, 0.05);
    }, 800);
  });

  // ==========================================================================
  // NON-LINEAR LAYER NAVIGATION & ROUTER TIMELINES
  // ==========================================================================
  
  // Card clicks (Open File)
  document.querySelectorAll('.vault-file-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Prevent double trigger if buttons are clicked
      if (e.target.tagName === 'BUTTON') return;
      
      const target = card.dataset.target;
      playBeep(880, 0.08);
      loadMemoryLayer(target);
    });
  });

  document.querySelectorAll('.file-open-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid card click duplicate
      const target = btn.closest('.vault-file-card').dataset.target;
      playBeep(880, 0.08);
      loadMemoryLayer(target);
    });
  });

  // Master Room Loader Router
  function loadMemoryLayer(roomName) {
    elements.viewSelection.classList.add('fade-out');
    
    setTimeout(() => {
      elements.viewSelection.classList.add('hidden');
      
      // Open Loader transition screen
      elements.viewLoader.classList.remove('hidden');
      
      // Step through Loader timeline
      const statusText = elements.viewLoader.querySelector('#loader-status-text');
      const progressFill = elements.viewLoader.querySelector('#loader-fill-line');
      
      progressFill.style.width = '0%';
      statusText.innerText = "Loading Memory...";
      playBeep(500, 0.03);
      
      setTimeout(() => {
        progressFill.style.width = '55%';
        statusText.innerText = "Reconstructing Environment...";
        playBeep(600, 0.03);
        
        setTimeout(() => {
          progressFill.style.width = '100%';
          statusText.innerText = "Memory Ready";
          playBeep(800, 0.05);
          
          setTimeout(() => {
            // Fade loader out, show immersive room
            elements.viewLoader.classList.add('hidden');
            elements.immersiveMemorySpace.classList.remove('hidden');
            
            // Activate specific room
            elements.roomLivingroom.classList.add('hidden');
            elements.roomPlayground.classList.add('hidden');
            elements.roomClassroom.classList.add('hidden');
            
            systemState.currentRoom = roomName;
            elements.lblActiveRoomTag.innerText = roomName.toUpperCase() + ".EXE";
            
            if (roomName === 'livingroom') {
              elements.roomLivingroom.classList.remove('hidden');
              initializeLivingRoomGame();
            } else if (roomName === 'playground') {
              elements.roomPlayground.classList.remove('hidden');
              initializePlaygroundGame();
            } else if (roomName === 'classroom') {
              elements.roomClassroom.classList.remove('hidden');
              initializeClassroomGame();
            }
            
          }, 600);
        }, 800);
      }, 700);
    }, 800);
  }

  // Leaving/Exiting Memory Room Back to selection
  elements.btnLeaveMemory.addEventListener('click', () => {
    stopCurrentAudio();
    playBeep(500, 0.06);
    
    elements.immersiveMemorySpace.classList.add('hidden');
    elements.viewSelection.classList.remove('hidden');
    elements.viewSelection.classList.remove('fade-out');
  });

  // Switch Rooms at completion links
  elements.btnTriggerNextRoom.forEach(btn => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.next;
      stopCurrentAudio();
      playBeep(800, 0.08);
      
      elements.immersiveMemorySpace.classList.add('hidden');
      loadMemoryLayer(next);
    });
  });

  // Helper to stop any ongoing audio instances
  function stopCurrentAudio() {
    if (currentAudioInstance) {
      try {
        currentAudioInstance.pause();
        currentAudioInstance.currentTime = 0;
      } catch (e) {}
      currentAudioInstance = null;
    }
    systemState.lrPlaying = false;
    elements.waveVis1.classList.remove('playing');
    elements.waveVis2.classList.remove('playing');
    elements.waveVis3.classList.remove('playing');
  }

  // ==========================================================================
  // 🏠 ROOM 1: LIVINGROOM.EXE INTERACTIVE LOOPS
  // ==========================================================================
  function initializeLivingRoomGame() {
    systemState.lrRound = 1;
    
    // Toggle active round visual blocks
    document.getElementById('lr-r1').classList.add('active-round');
    document.getElementById('lr-r2').classList.remove('active-round');
    document.getElementById('lr-r3').classList.remove('active-round');
    elements.lrRoundSuccessCard.classList.add('hidden');
    elements.lrMemoryRestoredCard.classList.add('hidden');
    
    elements.lrTvNoise.style.display = 'block';
    elements.lrTvWave.style.display = 'none';
    elements.lrTvCaption.innerText = "SIGNAL LOST";
    
    // Clean old quiz choices styling
    elements.lrQuizChoices.forEach(b => b.className = 'quiz-choice-btn');
    elements.inputLrDecode.value = '';
  }

  // remote clicks
  elements.lrRemoteWidget.addEventListener('click', () => {
    playBeep(900, 0.05);
    elements.lrTvCaption.innerText = "DIAGNOSTIC ACTIVE";
    elements.lrTvNoise.style.display = 'none';
    elements.lrTvWave.style.display = 'block';
    setTimeout(() => {
      elements.lrTvNoise.style.display = 'block';
      elements.lrTvWave.style.display = 'none';
      elements.lrTvCaption.innerText = "SIGNAL LOST";
    }, 2000);
  });

  // Audio loading configurations - plays MP3 or dynamic synthesized fallsafes
  function configureImmersiveAudio(path, type, waveEl) {
    if (systemState.lrPlaying) {
      stopCurrentAudio();
      return;
    }
    
    systemState.lrPlaying = true;
    waveEl.classList.add('playing');
    
    const audio = new Audio(path);
    currentAudioInstance = audio;
    
    audio.addEventListener('play', () => {
      playBeep(700, 0.03);
    });
    
    audio.addEventListener('ended', () => {
      stopCurrentAudio();
    });
    
    // If the real file is missing, catch the error and fallback to synth!
    audio.addEventListener('error', () => {
      console.warn(`Audio asset missing: ${path}. Synthesizing tone fallsafe.`);
      playDiagnosticSynthesizer(type);
      setTimeout(() => {
        stopCurrentAudio();
      }, 1500);
    });

    audio.play().catch(() => {
      // Browser auto play policies block
      playDiagnosticSynthesizer(type);
      setTimeout(() => {
        stopCurrentAudio();
      }, 1500);
    });
  }

  // Audio round clicks
  elements.btnPlayLr1.addEventListener('click', () => {
    configureImmersiveAudio("audio/cartoon1.mp3", "cartoon", elements.waveVis1);
  });

  elements.btnPlayLr2.addEventListener('click', () => {
    configureImmersiveAudio("audio/ad1.mp3", "ad", elements.waveVis2);
  });

  elements.btnPlayLr3.addEventListener('click', () => {
    configureImmersiveAudio("audio/distorted1.mp3", "distorted", elements.waveVis3);
  });

  // Quiz click check
  elements.lrQuizChoices.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const round = parseInt(btn.dataset.round);
      const val = btn.dataset.val;
      
      if (round === 1) {
        if (val === 'Doraemon') {
          btn.className = 'quiz-choice-btn correct-choice';
          stopCurrentAudio();
          playMelodicChime();
          showLivingRoomSuccess("Audio Fragment Restored", "Doraemon cartoon feed mapped inside the TV screen.");
        } else {
          btn.className = 'quiz-choice-btn wrong-choice';
          playBeep(180, 0.3, 'sawtooth');
          setTimeout(() => btn.className = 'quiz-choice-btn', 800);
        }
      } else if (round === 2) {
        if (val === 'Vodafone ZooZoo') {
          btn.className = 'quiz-choice-btn correct-choice';
          stopCurrentAudio();
          playMelodicChime();
          showLivingRoomSuccess("Advertisement Archive Restored", "Vodafone ZooZoo jingle sync validated.");
        } else {
          btn.className = 'quiz-choice-btn wrong-choice';
          playBeep(180, 0.3, 'sawtooth');
          setTimeout(() => btn.className = 'quiz-choice-btn', 800);
        }
      }
    });
  });

  // Round 3 decode submission
  elements.btnSubmitLr3.addEventListener('click', () => {
    const text = elements.inputLrDecode.value.toLowerCase().trim();
    const matches = ["school bell", "cartoon intro", "tv startup sound", "telephone ringtone"];
    
    if (matches.includes(text)) {
      stopCurrentAudio();
      playMelodicChime();
      
      elements.lrTvNoise.style.display = 'none';
      elements.lrTvWave.style.display = 'block';
      elements.lrTvCaption.innerText = "FEED LOCKED";
      
      document.getElementById('lr-r3').classList.remove('active-round');
      elements.lrRoundSuccessCard.classList.add('hidden');
      elements.lrMemoryRestoredCard.classList.remove('hidden');
      
      markLayerAsSecured('livingroom');
    } else {
      elements.inputLrDecode.style.borderColor = 'var(--neon-alert)';
      playBeep(180, 0.3, 'sawtooth');
      setTimeout(() => elements.inputLrDecode.style.borderColor = 'rgba(226,167,76,0.25)', 1000);
    }
  });

  function showLivingRoomSuccess(title, msg) {
    elements.lblLrSuccessTitle.innerText = title;
    elements.lrRoundSuccessCard.classList.remove('hidden');
  }

  elements.btnLrProceedRound.addEventListener('click', () => {
    elements.lrRoundSuccessCard.classList.add('hidden');
    
    if (systemState.lrRound === 1) {
      systemState.lrRound = 2;
      document.getElementById('lr-r1').classList.remove('active-round');
      document.getElementById('lr-r2').classList.add('active-round');
    } else if (systemState.lrRound === 2) {
      systemState.lrRound = 3;
      document.getElementById('lr-r2').classList.remove('active-round');
      document.getElementById('lr-r3').classList.add('active-round');
    }
    playBeep(600, 0.05);
  });

  // ==========================================================================
  // ⚽ ROOM 2: PLAYGROUND.EXE INTERACTIVE LOOPS
  // ==========================================================================
  function initializePlaygroundGame() {
    systemState.pgRound = 1;
    systemState.pgDiffCount = 0;
    systemState.pgDiffFound = { swing: false, bicycle: false, football: false };
    systemState.pgBlurredSolved = false;
    
    document.getElementById('pg-r1').classList.add('active-round');
    document.getElementById('pg-r2').classList.remove('active-round');
    document.getElementById('pg-r-hidden').classList.add('hidden');
    elements.pgSuccessCue.classList.add('hidden');
    elements.pgEndScreen.classList.add('hidden');
    
    elements.lblPgDiffFound.innerText = "0 / 3";
    elements.pgSunsetBlurImg.className = "jpg-memory-asset blurred-img";
    elements.pgFallbackBlur.style.filter = "blur(14px)";
    elements.pgBlurCaption.innerText = "BLUR LEVEL: 100%";
    elements.pgBlurCaption.style.color = 'var(--neon-violet)';
    elements.pgBlurCaption.style.borderColor = 'var(--neon-violet)';
    
    // Clear differences markers in SVG
    document.getElementById('s-rope-1').setAttribute('stroke', '#777');
    document.getElementById('s-rope-2').setAttribute('stroke', '#ff3366');
    document.getElementById('s-seat').style.display = 'none';
    
    document.getElementById('s-wheel-1').setAttribute('stroke', 'rgba(255, 51, 102, 0.15)');
    document.getElementById('s-wheel-1').setAttribute('stroke-dasharray', '2 2');
    document.getElementById('s-wheel-2').setAttribute('stroke', 'rgba(255, 51, 102, 0.15)');
    document.getElementById('s-wheel-2').setAttribute('stroke-dasharray', '2 2');
    
    document.getElementById('s-ball').setAttribute('stroke', 'rgba(255, 51, 102, 0.15)');
    document.getElementById('s-ball').setAttribute('stroke-dasharray', '2 2');
    document.getElementById('s-ball').removeAttribute('fill');
    
    elements.pgBlurChoices.forEach(b => b.className = 'quiz-choice-btn pg-blur-choice');
  }

  // spot swing click
  elements.spotSwing.addEventListener('click', () => {
    if (systemState.pgDiffFound.swing) return;
    systemState.pgDiffFound.swing = true;
    
    document.getElementById('s-rope-1').setAttribute('stroke', '#888');
    document.getElementById('s-rope-2').setAttribute('stroke', '#888');
    document.getElementById('s-seat').style.display = 'block';
    
    playBeep(900, 0.05);
    incrementPlaygroundDiffs();
  });

  // spot bike click
  elements.spotBicycle.addEventListener('click', () => {
    if (systemState.pgDiffFound.bicycle) return;
    systemState.pgDiffFound.bicycle = true;
    
    document.getElementById('s-wheel-1').setAttribute('stroke', '#bd00ff');
    document.getElementById('s-wheel-1').removeAttribute('stroke-dasharray');
    document.getElementById('s-wheel-2').setAttribute('stroke', '#bd00ff');
    document.getElementById('s-wheel-2').removeAttribute('stroke-dasharray');
    
    playBeep(900, 0.05);
    incrementPlaygroundDiffs();
  });

  // spot ball click
  elements.spotFootball.addEventListener('click', () => {
    if (systemState.pgDiffFound.football) return;
    systemState.pgDiffFound.football = true;
    
    document.getElementById('s-ball').setAttribute('stroke', '#00f3ff');
    document.getElementById('s-ball').setAttribute('fill', '#00f3ff');
    document.getElementById('s-ball').removeAttribute('stroke-dasharray');
    
    playBeep(900, 0.05);
    incrementPlaygroundDiffs();
  });

  function incrementPlaygroundDiffs() {
    systemState.pgDiffCount++;
    elements.lblPgDiffFound.innerText = `${systemState.pgDiffCount} / 3`;
    
    if (systemState.pgDiffCount === 3) {
      playMelodicChime();
      elements.lblPgSuccessTitle.innerText = "Visual Fragment Recovered";
      elements.pgSuccessCue.classList.remove('hidden');
    }
  }

  // Blur quiz option clicks
  elements.pgBlurChoices.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (systemState.pgBlurredResolved) return;
      
      const val = btn.dataset.val;
      if (val === 'cricket bat') {
        systemState.pgBlurredResolved = true;
        btn.className = 'quiz-choice-btn correct-choice';
        playMelodicChime();
        
        // Remove blurs on images
        elements.pgSunsetBlurImg.className = "jpg-memory-asset";
        elements.pgFallbackBlur.style.filter = "blur(0px)";
        elements.pgBlurCaption.innerText = "OBJECT RESOLVED: CRICKET BAT";
        elements.pgBlurCaption.style.color = 'var(--neon-green)';
        elements.pgBlurCaption.style.borderColor = 'var(--neon-green)';
        
        // Flash corrupted group photo for 3 seconds
        setTimeout(triggerDistortedPhotoFlashing, 1200);
      } else {
        btn.className = 'quiz-choice-btn wrong-choice';
        playBeep(180, 0.3, 'sawtooth');
        setTimeout(() => btn.className = 'quiz-choice-btn pg-blur-choice', 800);
      }
    });
  });

  function triggerDistortedPhotoFlashing() {
    document.getElementById('pg-r2').classList.remove('active-round');
    document.getElementById('pg-r-hidden').classList.remove('hidden');
    
    playDiagnosticSynthesizer('glitch');
    elements.pgGlitchyPhotoFrame.classList.add('glitch-active');
    
    setTimeout(() => {
      elements.pgGlitchyPhotoFrame.classList.remove('glitch-active');
      document.getElementById('pg-r-hidden').classList.add('hidden');
      elements.pgEndScreen.classList.remove('hidden');
      
      markLayerAsSecured('playground');
    }, 3000);
  }

  elements.pgProceedRoundBtn.addEventListener('click', () => {
    elements.pgSuccessCue.classList.add('hidden');
    systemState.pgRound = 2;
    document.getElementById('pg-r1').classList.remove('active-round');
    document.getElementById('pg-r2').classList.add('active-round');
    playBeep(600, 0.05);
  });

  // ==========================================================================
  // 🏫 ROOM 3: CLASSROOM.EXE INTERACTIVE LOOPS
  // ==========================================================================
  function initializeClassroomGame() {
    // Reset room state
    Object.keys(systemState.classSeen).forEach(k => systemState.classSeen[k] = false);
    elements.inputClassPasscode.value = '';
    elements.lblClassVerifyStatus.innerText = "LOCKED";
    elements.lblClassVerifyStatus.className = "ver-status text-dim font-mono";
    
    elements.classroomHotspots.forEach(h => h.classList.remove('seen'));
    elements.classReadoutLogs.innerHTML = `<p class="font-mono text-dim">&gt; CRITICAL DECAY DETECTED. CLICK RECONSTRUCTION hotspots inside the classroom environment to map the missing variables.</p>`;
  }

  // Classroom click investigations
  elements.classroomHotspots.forEach(hotspot => {
    hotspot.addEventListener('click', () => {
      const type = hotspot.dataset.obj;
      
      systemState.classSeen[type] = true;
      hotspot.classList.add('seen');
      
      playBeep(520, 0.1, 'triangle');
      logClassroomDiagnostic(type);
    });
  });

  function logClassroomDiagnostic(type) {
    const database = {
      Blackboard: "PROJECT GROUPS LISTED ON SLATE BOARD:<br>• Group 1: ○<br>• Group 2: □<br>• Group 3: △ (HIGHLIGHTED / CIRCLED)<br>• Group 4: ☆",
      Notebook: "PAGES DATED SEPTEMBER 1999:<br>&gt; 'The triangle group always sat near the window.'",
      WindowDesk: "ETCHINGS SCRATCHED IN DESK WOOD:<br>&gt; 'G3_'",
      Clock: "WALL CLOCK PARALYSIS DATA:<br>&gt; Hands frozen exactly at 3:45.",
      Register: "1999 ROLL LIST INK:<br>&gt; Roll No. 03 (Circled in dark red).",
      Photo: "CLASS PHOTO SNAPSHOT:<br>&gt; Image shows 5 friends. Strangely, one middle seat is completely empty.",
      Bag: "DECAYING BACKPACK CONTENT:<br>&gt; Standard textbooks, geometry set, empty compass."
    };

    const p = document.createElement('p');
    p.className = "diag-history-line font-mono text-cyan";
    p.innerHTML = `&gt; ${type.toUpperCase()}: ${database[type]}`;
    
    if (elements.classReadoutLogs.querySelector('.text-dim')) {
      elements.classReadoutLogs.innerHTML = '';
    }
    
    elements.classReadoutLogs.appendChild(p);
    elements.classReadoutLogs.scrollTop = elements.classReadoutLogs.scrollHeight;
  }

  // Keypad Verification code checks
  elements.btnClassVerify.addEventListener('click', () => {
    const val = elements.inputClassPasscode.value.trim().toUpperCase();
    
    if (val === 'G345') {
      playMelodicChime();
      elements.lblClassVerifyStatus.innerText = "PASSCODE APPROVED";
      elements.lblClassVerifyStatus.className = "ver-status font-mono text-success";
      
      markLayerAsSecured('classroom');
      
      setTimeout(() => {
        // Exit room and return to Vault Selección Lobby
        elements.immersiveMemorySpace.classList.add('hidden');
        elements.viewSelection.classList.remove('hidden');
        elements.viewSelection.classList.remove('fade-out');
        
        showTransitionModal(
          "CRITICAL MEMORY CORE UNLOCKED",
          "Memory segment 01 classroom.exe successfully stabilized. Synaptic timeline mapped. Project Rewind ready to run core integration."
        );
      }, 1200);
    } else {
      elements.lblClassVerifyStatus.innerText = "ERROR: CODE MISMATCH";
      elements.lblClassVerifyStatus.className = "ver-status font-mono text-danger blink";
      playBeep(220, 0.4, 'sawtooth');
      
      setTimeout(() => {
        elements.lblClassVerifyStatus.innerText = "LOCKED";
        elements.lblClassVerifyStatus.className = "ver-status font-mono text-dim";
      }, 1200);
    }
  });

  // ==========================================================================
  // SEGMENT SYNCHRONIZATION HANDLER
  // ==========================================================================
  function markLayerAsSecured(sector) {
    if (systemState.repairedSectors[sector]) return;
    
    systemState.repairedSectors[sector] = true;
    
    // Update card HUD status
    const cardStatus = document.getElementById(`lbl-status-${sector}`);
    const cardDot = document.querySelector(`#card-${sector} .status-indicator-dot`);
    const cardEl = document.getElementById(`card-${sector}`);
    
    cardStatus.innerText = "SECURED";
    cardDot.className = "status-indicator-dot val-secured";
    cardEl.classList.add('secured');
    
    // Increment global integrity
    const repCount = Object.values(systemState.repairedSectors).filter(Boolean).length;
    systemState.currentIntegrity = 34 + repCount * 20; // 34% -> 54% -> 74% -> 94%
    
    // Update dashboard HUD text if visible
    elements.hudIntegrity.innerText = systemState.currentIntegrity + "%";
    elements.hudSectors.innerText = `${repCount} / 3`;
  }

  // ==========================================================================
  // ⚡ THE SYSTEM CRASH ENDING SEQUENCE
  // ==========================================================================
  elements.btnEndExploration.addEventListener('click', () => {
    stopCurrentAudio();
    playBeep(220, 0.5, 'sawtooth');
    
    elements.viewSelection.classList.add('fade-out');
    
    setTimeout(() => {
      elements.viewSelection.classList.add('hidden');
      elements.viewEnding.classList.remove('hidden');
      
      // Step through "Searching for Sam..." timers
      playScientistEmergencySiren();
      
      setTimeout(() => {
        document.getElementById('lbl-ending-status-2').style.display = 'block';
        playBeep(500, 0.05);
        
        setTimeout(() => {
          document.getElementById('lbl-ending-status-3').style.display = 'block';
          playBeep(500, 0.05);
          
          setTimeout(() => {
            document.getElementById('lbl-ending-status-4').style.display = 'block';
            playBeep(180, 0.35, 'sawtooth');
            
            // Screen Static sweep glitch
            document.getElementById('glitch-shader').classList.add('glitch-active');
            
            setTimeout(() => {
              document.getElementById('glitch-shader').classList.remove('glitch-active');
              
              // Hide search, show safe eject summary
              elements.endingLoaderBox.classList.add('hidden');
              elements.endingSummaryBox.classList.remove('hidden');
              
              // Sam fades from silhouette
              elements.endingSamSil.style.display = 'none';
              
              setTimeout(() => {
                elements.endingHauntingLine.style.opacity = '1';
                
                // Slow fade to absolute black
                setTimeout(() => {
                  elements.endingFinalBlack.classList.remove('hidden');
                  elements.endingFinalBlack.style.opacity = '0';
                  
                  setTimeout(() => {
                    elements.endingFinalBlack.style.opacity = '1';
                    // Mute sound drone
                    if (droneGain) droneGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.0);
                  }, 50);
                }, 5000);
                
              }, 1500);
              
            }, 800);
          }, 1500);
        }, 1200);
      }, 1200);
    }, 800);
  });

  // ==========================================================================
  // OBSIDIAN GRAPH WORKSPACE IMPLEMENTATION
  // ==========================================================================

  // Obsidian Note Database
  const noteDatabase = {
    "ProjectLogs.md": {
      title: "Project_Logs",
      category: "system",
      tags: ["system", "log"],
      status: "secured",
      content: `# Project Logs (SYS_LOG_99)
- **Author**: Dr. Aris (Bridge Operations Lead)
- **Date**: Oct 14, 1999

We have initiated Phase 1 of **Project Rewind**. The neural bridge has successfully locked onto target subject Sam's childhood memory files. Preliminary synaptic scanning shows significant decay in the Living Room and Classroom nodes.

We must stabilize all cognitive sectors before the bridge connection collapses. If target data degrades below 30%, memory recall files will be permanently lost.`
    },
    "NeuralBridge.md": {
      title: "Neural_Bridge_Specs",
      category: "system",
      tags: ["system", "hardware"],
      status: "secured",
      content: `# Neural Bridge Specifications
- **Frequency**: 430 THz (Synaptic Modulation band)
- **Grid Nodes**: 18
- **Sync Bandwidth**: 1.2 GB/s

The Cognitive Reconstruction Bridge links the technician's terminal directly to Sam's subconscious mind map.

> [!WARNING]
> Do NOT exceed 2400 seconds of continuous exposure. Technicians may experience "temporal echo drift" where memories of the subject begin blending with their own.`
    },
    "Sam.md": {
      title: "Sam_Memory_Core",
      category: "memory",
      tags: ["host", "unstable"],
      status: "unresolved",
      content: `# Sam_Memory_Core
This is the central host neuron for the subject's mind map. All surrounding memories connect back to this root node.

## Diagnostic Logs
- **Neural Integrity**: Degradation critical.
- **Status**: Locked. Synaptic paths are fragmented.

## Recovery Procedure
To restore Sam's consciousness core, you must secure all three childhood sectors:
1. **Living Room Sector**: Mapped through cartoons, ads, and daily sounds.
2. **Playground Sector**: Secured by visual anomalies correction.
3. **Classroom Sector**: Unlocked by keypad passcode verification.

Once all sectors are green, trigger the **FINAL INTEGRATION SYSTEM** below.

### Integration Key
Type **INTEGRATE** in the decoder input below to boot the system crash diagnostics.`
    },
    "LivingRoom_Sector.md": {
      title: "Living_Room_Sector",
      category: "memory",
      tags: ["folder", "livingroom"],
      status: "unresolved",
      content: `# Living_Room_Sector
This directory represents Sam's family living room memories from the late 90s. The evening environment contains the CRT Television centerpiece.

## Connected Files:
- [[Doraemon_Cartoon.md]]: Audio fragments of childhood cartoons.
- [[ZooZoo_Jingle.md]]: Retro advertisement archives.
- [[Daily_Sounds.md]]: Corrupted daily household sound waves.

*Solve all files in this sector to secure the Living Room network.*`
    },
    "Doraemon_Cartoon.md": {
      title: "Doraemon_Cartoon",
      category: "memory",
      tags: ["clue", "livingroom", "audio"],
      status: "unresolved",
      content: `# Doraemon_Cartoon.md
- **Memory Identifier**: Cartoon_Theme_1
- **File Integrity**: 71%

A warm memory of Sam sitting in front of the CRT Television after school. The audio fragment is distorted.

## Synaptic Task:
Tap Play on the decoder below and identify the cartoon theme from Sam's childhood memories to map the audio wave.`,
      puzzle: "lr-r1"
    },
    "ZooZoo_Jingle.md": {
      title: "ZooZoo_Jingle",
      category: "memory",
      tags: ["clue", "livingroom", "audio"],
      status: "unresolved",
      content: `# ZooZoo_Jingle.md
- **Memory Identifier**: Ad_Break_Chaos
- **File Integrity**: 71%

Sam recalls watching commercial breaks with his family during cricket matches.

## Synaptic Task:
Play the jingle archive and identify the classic nostalgic TV advertisement.`,
      puzzle: "lr-r2"
    },
    "Daily_Sounds.md": {
      title: "Daily_Sounds",
      category: "memory",
      tags: ["clue", "livingroom", "audio"],
      status: "unresolved",
      content: `# Daily_Sounds.md
- **Memory Identifier**: Distorted_Daily_Sound
- **File Integrity**: 71%

A household daily background sound that Sam heard every morning.

## Synaptic Task:
Play the corrupted sound clip and decode its identity. Type the matching item in the input box below.
- *Hint*: Refer to school bell, telephone ringtone, or TV startup sound.`,
      puzzle: "lr-r3"
    },
    "Playground_Sector.md": {
      title: "Playground_Sector",
      category: "memory",
      tags: ["folder", "playground"],
      status: "unresolved",
      content: `# Playground_Sector
This sector anchors Sam's sunset playground memory layer. Contains swings, bats, and bicycles.

## Connected Files:
- [[Swing_Anomalies.md]]: Spot visual omissions inside the memory photo.
- [[Cricket_Sunset.md]]: Blurred silhouette focal alignment.
- [[Group_Photo.md]]: Glitched photograph of Sam's friends group.

*Solve all files in this sector to secure the Playground network.*`
    },
    "Swing_Anomalies.md": {
      title: "Swing_Anomalies",
      category: "memory",
      tags: ["clue", "playground", "visual"],
      status: "unresolved",
      content: `# Swing_Anomalies.md
- **Memory Identifier**: Polaroid_A_B_Compare
- **File Integrity**: 47%

The visual frame of the playground swing is deteriorating.

## Synaptic Task:
Compare Image A and Image B in the decoder. Click on the 3 missing/corrupted anomalies in Image B to align the sunset environment.`,
      puzzle: "pg-r1"
    },
    "Cricket_Sunset.md": {
      title: "Cricket_Sunset",
      category: "memory",
      tags: ["clue", "playground", "visual"],
      status: "unresolved",
      content: `# Cricket_Sunset.md
- **Memory Identifier**: Silhouette_Focal_Lock
- **File Integrity**: 47%

A nostalgic object silhouette is locked in deep sunset blur.

## Synaptic Task:
Select the correct identity of the blurred silhouette from the options below to sync the camera focus.`,
      puzzle: "pg-r2"
    },
    "Group_Photo.md": {
      title: "Group_Photo",
      category: "memory",
      tags: ["clue", "playground", "visual"],
      status: "unresolved",
      content: `# Group_Photo.md
- **Memory Identifier**: Friends_Group_Glitch
- **File Integrity**: 47%

A Polaroid snapshot of Sam's close childhood group. The visual matrix is flashing and unstable.

## Diagnostic
This node is locked and connected to the focal point of the Playground memory. Resolving the Sunset Blur will trigger the alignment sweep on this file automatically.`
    },
    "Classroom_Sector.md": {
      title: "Classroom_Sector",
      category: "memory",
      tags: ["folder", "classroom"],
      status: "unresolved",
      content: `# Classroom_Sector
The classroom is the most critical and unstable sector of Sam's memory. It represents his grade 3 classroom at school.

## Connected Files:
- [[SlateBoard.md]]: Slated list of groups.
- [[RollRegister.md]]: School roll call book data.
- [[WindowDesk.md]]: Desk wood carvings.
- [[ClockDecay.md]]: Clock frozen data.
- [[EmptySeat.md]]: Class photo investigation.
- [[SchoolBag.md]]: Decaying backpack contents.

## Synaptic Task:
To unlock this critical directory core, search all adjacent classroom files for alphanumeric keys. Combine the clues to form the 6-character Memory Verification Key:
- Format: **[Letter][Number][Number][Number]** (e.g. A123)

Enter the verification passcode in the decoder keypad below.`,
      puzzle: "class-keypad"
    },
    "SlateBoard.md": {
      title: "SlateBoard",
      category: "memory",
      tags: ["clue", "classroom"],
      status: "unresolved",
      content: `# SlateBoard.md
- **Type**: Slate Chalkboard Log
- **Location**: Front of Classroom

## Investigation Log
The slated board lists four project groups:
- Group 1: Circle
- Group 2: Square
- Group 3: **Triangle** (Circled in yellow chalk, marked as critical)
- Group 4: Star

*Connects to [[WindowDesk.md]] and [[RollRegister.md]].*`,
      puzzle: "Blackboard"
    },
    "RollRegister.md": {
      title: "RollRegister",
      category: "memory",
      tags: ["clue", "classroom"],
      status: "unresolved",
      content: `# RollRegister.md
- **Type**: Roll Call Book
- **Location**: Teacher's Desk

## Investigation Log
The classroom register list shows:
- Roll No. 01: Active
- Roll No. 02: Active
- **Roll No. 03**: Circled in dark red ink. Name: *Sam*.
- Roll No. 04: Active

*Connects to [[SlateBoard.md]].*`,
      puzzle: "Register"
    },
    "WindowDesk.md": {
      title: "WindowDesk",
      category: "memory",
      tags: ["clue", "classroom"],
      status: "unresolved",
      content: `# WindowDesk.md
- **Type**: Wood Carving
- **Location**: Last row near the window

## Investigation Log
Etchings scratched into the corner wood of the desk:
- **G3_** (The rest is chipped off).

Cross-referenced note: *The triangle group always sat near the window.*

*Connects to [[SlateBoard.md]] and [[Classroom_Sector.md]].*`,
      puzzle: "WindowDesk"
    },
    "ClockDecay.md": {
      title: "ClockDecay",
      category: "memory",
      tags: ["clue", "classroom"],
      status: "unresolved",
      content: `# ClockDecay.md
- **Type**: Wall Clock Diagnostics
- **Location**: Above Blackboard

## Investigation Log
The classroom clock hands are frozen in place.
- Hour hand: **3**
- Minute hand: **45**
- Reading: **3:45**

*Connects to [[Classroom_Sector.md]].*`,
      puzzle: "Clock"
    },
    "EmptySeat.md": {
      title: "EmptySeat",
      category: "memory",
      tags: ["clue", "classroom"],
      status: "unresolved",
      content: `# EmptySeat.md
- **Type**: Class Photo Fragment
- **Location**: Notice Board

## Investigation Log
The class photo depicts 5 friends posing together. Strangely, the middle seat is completely empty, though there are arm shadows. It's as if someone was digitally erased from the memory.`,
      puzzle: "Photo"
    },
    "SchoolBag.md": {
      title: "SchoolBag",
      category: "memory",
      tags: ["clue", "classroom"],
      status: "unresolved",
      content: `# SchoolBag.md
- **Type**: Backpack Contents
- **Location**: Left floor corner

## Investigation Log
A blue backpack containing:
- Standard grade 3 notebooks.
- A geometry compass.
- An empty pencil pouch.`,
      puzzle: "Bag"
    }
  };

  // Node Graph Configuration Model
  const graphNodes = [
    { id: "ProjectLogs.md", label: "ProjectLogs.md", type: "system", isFolder: false, path: "system/ProjectLogs.md" },
    { id: "NeuralBridge.md", label: "NeuralBridge.md", type: "system", isFolder: false, path: "system/NeuralBridge.md" },
    { id: "Sam.md", label: "Sam.md", type: "host", isFolder: false, path: "memories/Sam.md" },
    { id: "LivingRoom_Sector.md", label: "LivingRoom_Sector.md", type: "folder", isFolder: true, path: "memories/LivingRoom/LivingRoom_Sector.md" },
    { id: "Doraemon_Cartoon.md", label: "Doraemon_Cartoon.md", type: "clue", isFolder: false, path: "memories/LivingRoom/Doraemon_Cartoon.md" },
    { id: "ZooZoo_Jingle.md", label: "ZooZoo_Jingle.md", type: "clue", isFolder: false, path: "memories/LivingRoom/ZooZoo_Jingle.md" },
    { id: "Daily_Sounds.md", label: "Daily_Sounds.md", type: "clue", isFolder: false, path: "memories/LivingRoom/Daily_Sounds.md" },
    { id: "Playground_Sector.md", label: "Playground_Sector.md", type: "folder", isFolder: true, path: "memories/Playground/Playground_Sector.md" },
    { id: "Swing_Anomalies.md", label: "Swing_Anomalies.md", type: "clue", isFolder: false, path: "memories/Playground/Swing_Anomalies.md" },
    { id: "Cricket_Sunset.md", label: "Cricket_Sunset.md", type: "clue", isFolder: false, path: "memories/Playground/Cricket_Sunset.md" },
    { id: "Group_Photo.md", label: "Group_Photo.md", type: "clue", isFolder: false, path: "memories/Playground/Group_Photo.md" },
    { id: "Classroom_Sector.md", label: "Classroom_Sector.md", type: "folder", isFolder: true, path: "memories/Classroom/Classroom_Sector.md" },
    { id: "SlateBoard.md", label: "SlateBoard.md", type: "clue", isFolder: false, path: "memories/Classroom/SlateBoard.md" },
    { id: "RollRegister.md", label: "RollRegister.md", type: "clue", isFolder: false, path: "memories/Classroom/RollRegister.md" },
    { id: "WindowDesk.md", label: "WindowDesk.md", type: "clue", isFolder: false, path: "memories/Classroom/WindowDesk.md" },
    { id: "ClockDecay.md", label: "ClockDecay.md", type: "clue", isFolder: false, path: "memories/Classroom/ClockDecay.md" },
    { id: "EmptySeat.md", label: "EmptySeat.md", type: "clue", isFolder: false, path: "memories/Classroom/EmptySeat.md" },
    { id: "SchoolBag.md", label: "SchoolBag.md", type: "clue", isFolder: false, path: "memories/Classroom/SchoolBag.md" }
  ];

  const graphLinks = [
    { source: "Sam.md", target: "ProjectLogs.md" },
    { source: "ProjectLogs.md", target: "NeuralBridge.md" },
    { source: "Sam.md", target: "LivingRoom_Sector.md" },
    { source: "Sam.md", target: "Playground_Sector.md" },
    { source: "Sam.md", target: "Classroom_Sector.md" },
    { source: "LivingRoom_Sector.md", target: "Doraemon_Cartoon.md" },
    { source: "LivingRoom_Sector.md", target: "ZooZoo_Jingle.md" },
    { source: "LivingRoom_Sector.md", target: "Daily_Sounds.md" },
    { source: "Playground_Sector.md", target: "Swing_Anomalies.md" },
    { source: "Playground_Sector.md", target: "Cricket_Sunset.md" },
    { source: "Playground_Sector.md", target: "Group_Photo.md" },
    { source: "Cricket_Sunset.md", target: "Group_Photo.md" },
    { source: "Classroom_Sector.md", target: "SlateBoard.md" },
    { source: "Classroom_Sector.md", target: "RollRegister.md" },
    { source: "Classroom_Sector.md", target: "WindowDesk.md" },
    { source: "Classroom_Sector.md", target: "ClockDecay.md" },
    { source: "Classroom_Sector.md", target: "EmptySeat.md" },
    { source: "Classroom_Sector.md", target: "SchoolBag.md" },
    { source: "SlateBoard.md", target: "WindowDesk.md" },
    { source: "SlateBoard.md", target: "RollRegister.md" }
  ];

  // Simulator State variables
  let currentActiveNote = null;
  let searchFilter = "";
  let activeTagFilter = "";
  let physicsRunning = true;

  // Visual Controls Cache
  let canvas = null;
  let canvasCtx = null;
  let graphScale = 1.0;
  let graphOffsetX = 0;
  let graphOffsetY = 0;
  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;
  let draggedNode = null;
  let hoverNode = null;

  // Sliders/Controls values
  let repulsionStrength = 4500;
  let gravityStrength = 0.02;
  let linkDistance = 130;
  let showLabels = true;
  let glowingEdges = true;

  function initObsidianWorkspace() {
    canvas = document.getElementById('obsidian-graph-canvas');
    if (!canvas) return;
    
    canvasCtx = canvas.getContext('2d');
    resizeGraphCanvas();
    window.addEventListener('resize', resizeGraphCanvas);

    // Initial Physics Setup
    initGraphPhysics();

    // Bind Event Listeners
    setupGraphInputListeners();
    setupWorkspaceUIListeners();

    // Render tree directory
    renderFileTree();

    // Open Sam.md by default
    openNote("Sam.md");

    // Hook game completion events to Obsidian status updates
    wrapGamePuzzleEvents();

    // Start Physics Animation Loop
    physicsRunning = true;
    requestAnimationFrame(updateGraphPhysicsLoop);
  }

  function resizeGraphCanvas() {
    if (!canvas) return;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }

  function initGraphPhysics() {
    const width = canvas.width;
    const height = canvas.height;
    
    graphNodes.forEach((node, idx) => {
      let angle = (idx / graphNodes.length) * Math.PI * 2;
      let radius = 150;
      
      if (node.id === "Sam.md") {
        node.x = width / 2;
        node.y = height / 2;
      } else if (node.type === "system") {
        node.x = width / 2 + Math.cos(angle) * 70;
        node.y = height / 2 + Math.sin(angle) * 70;
      } else if (node.type === "folder") {
        let r = 180;
        let sectorAngle = 0;
        if (node.id.includes("Living")) sectorAngle = 0;
        else if (node.id.includes("Playground")) sectorAngle = (2 * Math.PI) / 3;
        else sectorAngle = (4 * Math.PI) / 3;
        
        node.x = width / 2 + Math.cos(sectorAngle) * r;
        node.y = height / 2 + Math.sin(sectorAngle) * r;
      } else {
        let parentId = "";
        if (node.path.includes("LivingRoom")) parentId = "LivingRoom_Sector.md";
        else if (node.path.includes("Playground")) parentId = "Playground_Sector.md";
        else if (node.path.includes("Classroom")) parentId = "Classroom_Sector.md";
        
        let pNode = graphNodes.find(n => n.id === parentId) || { x: width/2, y: height/2 };
        let offsetAngle = Math.random() * Math.PI * 2;
        node.x = pNode.x + Math.cos(offsetAngle) * 90;
        node.y = pNode.y + Math.sin(offsetAngle) * 90;
      }
      
      node.vx = 0;
      node.vy = 0;
      node.radius = node.id === "Sam.md" ? 12 : node.isFolder ? 8 : 5;
    });

    // Reset Zoom/Offsets to fit view
    graphScale = 1.0;
    graphOffsetX = 0;
    graphOffsetY = 0;
  }

  function setupGraphInputListeners() {
    // Zooming
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = 1.1;
      const mousePos = getMousePos(e);
      
      const prevScale = graphScale;
      if (e.deltaY < 0) {
        graphScale = Math.min(graphScale * zoomFactor, 3.0);
      } else {
        graphScale = Math.max(graphScale / zoomFactor, 0.25);
      }

      // Adjust offsets so zoom is centered on mouse pointer
      graphOffsetX -= mousePos.x * (graphScale - prevScale);
      graphOffsetY -= mousePos.y * (graphScale - prevScale);
    });

    // Dragging & Panning
    canvas.addEventListener('mousedown', (e) => {
      const mousePos = getMousePos(e);
      // Check if mouse is on top of any node
      let clickedNode = null;
      for (let node of graphNodes) {
        let dx = mousePos.x - node.x;
        let dy = mousePos.y - node.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= node.radius + 5) {
          clickedNode = node;
          break;
        }
      }

      if (clickedNode) {
        draggedNode = clickedNode;
        canvas.style.cursor = 'grabbing';
      } else {
        isPanning = true;
        panStartX = e.clientX - graphOffsetX;
        panStartY = e.clientY - graphOffsetY;
        canvas.style.cursor = 'move';
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      const mousePos = getMousePos(e);
      
      // Node drag updates
      if (draggedNode) {
        draggedNode.x = mousePos.x;
        draggedNode.y = mousePos.y;
        draggedNode.vx = 0;
        draggedNode.vy = 0;
        return;
      }

      // View Panning
      if (isPanning) {
        graphOffsetX = e.clientX - panStartX;
        graphOffsetY = e.clientY - panStartY;
        return;
      }

      // Node Hover Check
      let foundHover = null;
      for (let node of graphNodes) {
        let dx = mousePos.x - node.x;
        let dy = mousePos.y - node.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= node.radius + 6) {
          foundHover = node;
          break;
        }
      }

      if (foundHover !== hoverNode) {
        hoverNode = foundHover;
        canvas.style.cursor = hoverNode ? 'pointer' : 'default';
      }
    });

    canvas.addEventListener('mouseup', () => {
      draggedNode = null;
      isPanning = false;
      canvas.style.cursor = hoverNode ? 'pointer' : 'default';
    });

    canvas.addEventListener('mouseleave', () => {
      draggedNode = null;
      isPanning = false;
      hoverNode = null;
    });

    // Double-click node to open
    canvas.addEventListener('dblclick', (e) => {
      const mousePos = getMousePos(e);
      for (let node of graphNodes) {
        let dx = mousePos.x - node.x;
        let dy = mousePos.y - node.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= node.radius + 6) {
          openNote(node.id);
          playBeep(880, 0.08);
          break;
        }
      }
    });
  }

  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - graphOffsetX) / graphScale,
      y: (e.clientY - rect.top - graphOffsetY) / graphScale
    };
  }

  function setupWorkspaceUIListeners() {
    // 1. Navigation View Toggles
    const toggleClassicBtn = document.getElementById('btn-toggle-classic-view');
    const toggleGraphBtn = document.getElementById('btn-toggle-graph-view');
    
    toggleClassicBtn.addEventListener('click', () => {
      playBeep(500, 0.05);
      document.getElementById('view-obsidian-workspace').classList.add('hidden');
      elements.viewSelection.classList.remove('hidden');
      elements.viewSelection.classList.remove('fade-out');
      physicsRunning = false;
    });

    toggleGraphBtn.addEventListener('click', () => {
      // Toggle to Graph View from anywhere
      playBeep(500, 0.05);
      elements.viewSelection.classList.add('hidden');
      document.getElementById('view-obsidian-workspace').classList.remove('hidden');
      physicsRunning = true;
      requestAnimationFrame(updateGraphPhysicsLoop);
    });

    // Legacy vault graph button inject
    if (!document.getElementById('btn-classic-vault-graph')) {
      const classicHeader = document.querySelector('.vault-header');
      if (classicHeader) {
        const toggleGraphClassic = document.createElement('button');
        toggleGraphClassic.className = 'scientist-btn';
        toggleGraphClassic.id = 'btn-classic-vault-graph';
        toggleGraphClassic.style.marginRight = '15px';
        toggleGraphClassic.innerHTML = '<span>NEURAL GRAPH VIEW</span>';
        classicHeader.insertBefore(toggleGraphClassic, elements.btnEndExploration);
        
        toggleGraphClassic.addEventListener('click', () => {
          toggleGraphBtn.click();
        });
      }
    }

    // End exploration
    document.getElementById('btn-obsidian-end-exploration').addEventListener('click', () => {
      document.getElementById('view-obsidian-workspace').classList.add('hidden');
      elements.btnEndExploration.click();
    });

    // 2. Search box input filter
    const searchInput = document.getElementById('obsidian-file-search');
    searchInput.addEventListener('input', () => {
      searchFilter = searchInput.value.trim();
      renderFileTree();
    });

    // 3. Tag cloud filtering
    document.querySelectorAll('#obsidian-tags-cloud .tag-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const tag = pill.dataset.tag;
        if (activeTagFilter === tag) {
          activeTagFilter = "";
          pill.classList.remove('active-tag');
        } else {
          document.querySelectorAll('#obsidian-tags-cloud .tag-pill').forEach(p => p.classList.remove('active-tag'));
          activeTagFilter = tag;
          pill.classList.add('active-tag');
        }
        playBeep(600, 0.03);
        renderFileTree();
      });
    });

    // 4. Graph Config Controls Panel toggling
    const btnToggleControls = document.getElementById('btn-toggle-controls');
    const controlsBody = document.getElementById('graph-controls-body');
    btnToggleControls.addEventListener('click', () => {
      controlsBody.classList.toggle('collapsed');
      btnToggleControls.innerText = controlsBody.classList.contains('collapsed') ? '⚙️' : '❌';
      playBeep(600, 0.04);
    });

    // 5. Physics Range sliders input updates
    const sliderGravity = document.getElementById('slider-gravity');
    const sliderRepulsion = document.getElementById('slider-repulsion');
    const sliderLinkDist = document.getElementById('slider-link-dist');
    const chkShowLabels = document.getElementById('chk-show-labels');
    const chkGlowingEdges = document.getElementById('chk-glowing-edges');
    const btnResetPhysics = document.getElementById('btn-reset-physics');

    sliderGravity.addEventListener('input', () => gravityStrength = parseFloat(sliderGravity.value));
    sliderRepulsion.addEventListener('input', () => repulsionStrength = parseFloat(sliderRepulsion.value));
    sliderLinkDist.addEventListener('input', () => linkDistance = parseFloat(sliderLinkDist.value));
    chkShowLabels.addEventListener('change', () => showLabels = chkShowLabels.checked);
    chkGlowingEdges.addEventListener('change', () => glowingEdges = chkGlowingEdges.checked);
    
    btnResetPhysics.addEventListener('click', () => {
      playBeep(800, 0.08);
      initGraphPhysics();
    });
  }

  function renderFileTree() {
    const container = document.getElementById('obsidian-file-tree');
    if (!container) return;
    container.innerHTML = '';

    // Helpers
    const isSearchMatch = (fileId) => {
      if (!searchFilter) return true;
      const term = searchFilter.toLowerCase();
      const node = noteDatabase[fileId];
      if (!node) return false;
      return fileId.toLowerCase().includes(term) || 
             node.title.toLowerCase().includes(term) ||
             node.content.toLowerCase().includes(term);
    };

    const isTagMatch = (fileId) => {
      if (!activeTagFilter) return true;
      const node = noteDatabase[fileId];
      if (!node) return false;
      return node.tags.includes(activeTagFilter);
    };

    // 1. Build System Folder
    const systemFiles = ["ProjectLogs.md", "NeuralBridge.md"].filter(f => isSearchMatch(f) && isTagMatch(f));
    if (systemFiles.length > 0) {
      container.appendChild(createFolderDom("system", systemFiles));
    }

    // 2. Build Memories folder
    const memoryChildren = [];
    const rootFiles = ["Sam.md"].filter(f => isSearchMatch(f) && isTagMatch(f));
    
    rootFiles.forEach(f => memoryChildren.push(createFileDom(f)));
    
    const lrFiles = ["LivingRoom_Sector.md", "Doraemon_Cartoon.md", "ZooZoo_Jingle.md", "Daily_Sounds.md"].filter(f => isSearchMatch(f) && isTagMatch(f));
    if (lrFiles.length > 0) {
      memoryChildren.push(createFolderDom("LivingRoom", lrFiles));
    }

    const pgFiles = ["Playground_Sector.md", "Swing_Anomalies.md", "Cricket_Sunset.md", "Group_Photo.md"].filter(f => isSearchMatch(f) && isTagMatch(f));
    if (pgFiles.length > 0) {
      memoryChildren.push(createFolderDom("Playground", pgFiles));
    }

    const classroomFiles = [
      "Classroom_Sector.md", "SlateBoard.md", "RollRegister.md", 
      "WindowDesk.md", "ClockDecay.md", "EmptySeat.md", "SchoolBag.md"
    ].filter(f => isSearchMatch(f) && isTagMatch(f));
    if (classroomFiles.length > 0) {
      memoryChildren.push(createFolderDom("Classroom", classroomFiles));
    }

    if (memoryChildren.length > 0 || rootFiles.length > 0) {
      const memoriesFolder = document.createElement('div');
      memoriesFolder.className = 'tree-folder';
      
      const mTitle = document.createElement('div');
      mTitle.className = 'tree-folder-title';
      mTitle.innerText = 'memories';
      memoriesFolder.appendChild(mTitle);
      
      const mChildren = document.createElement('div');
      mChildren.className = 'tree-folder-children';
      
      memoryChildren.forEach(el => mChildren.appendChild(el));
      memoriesFolder.appendChild(mChildren);
      
      container.appendChild(memoriesFolder);
    }

    // Hook collapse actions
    document.querySelectorAll('.tree-folder-title').forEach(title => {
      title.addEventListener('click', (e) => {
        e.stopPropagation();
        const folder = title.closest('.tree-folder');
        folder.classList.toggle('collapsed');
      });
    });

    // Hook file clicks
    document.querySelectorAll('.tree-file').forEach(fileEl => {
      fileEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const fileId = fileEl.dataset.file;
        openNote(fileId);
        playBeep(800, 0.05);

        // Center on clicked graph node
        let graphNode = graphNodes.find(n => n.id === fileId);
        if (graphNode) {
          graphOffsetX = canvas.width / 2 - graphNode.x * graphScale;
          graphOffsetY = canvas.height / 2 - graphNode.y * graphScale;
        }
      });
    });
  }

  function createFolderDom(name, files) {
    const folder = document.createElement('div');
    folder.className = 'tree-folder';
    
    const title = document.createElement('div');
    title.className = 'tree-folder-title';
    title.innerText = name;
    folder.appendChild(title);
    
    const children = document.createElement('div');
    children.className = 'tree-folder-children';
    
    files.forEach(file => {
      children.appendChild(createFileDom(file));
    });
    
    folder.appendChild(children);
    return folder;
  }

  function createFileDom(fileId) {
    const fileEl = document.createElement('div');
    fileEl.className = 'tree-file';
    if (currentActiveNote === fileId) fileEl.classList.add('active-file');
    
    const dbNode = noteDatabase[fileId];
    if (dbNode && dbNode.status === "secured") {
      fileEl.classList.add('file-secured');
      fileEl.innerHTML = `✅ 📄 ${fileId}`;
    } else {
      fileEl.innerHTML = `📄 ${fileId}`;
    }
    
    fileEl.dataset.file = fileId;
    return fileEl;
  }

  function openNote(noteId) {
    currentActiveNote = noteId;
    const noteContent = noteDatabase[noteId];
    if (!noteContent) return;

    // Highlights tree active state
    document.querySelectorAll('.tree-file').forEach(el => {
      if (el.dataset.file === noteId) el.classList.add('active-file');
      else el.classList.remove('active-file');
    });

    // Swap panes displays
    document.getElementById('note-placeholder').classList.add('hidden');
    document.getElementById('note-loaded-content').classList.remove('hidden');

    // Filename
    document.getElementById('note-open-filename').innerText = noteId;

    // YAML Block
    document.getElementById('note-frontmatter-block').innerText = `---
status: ${noteContent.status}
type: ${noteContent.category}
tags: [${noteContent.tags.join(', ')}]
---`;

    // Title
    document.getElementById('note-title').innerText = noteContent.title;

    // Parse text Wiki-links [[Link]]
    let txt = noteContent.content;
    txt = txt.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, target, alias) => {
      const label = alias || target.replace('.md', '');
      return `<span class="md-link" data-target="${target.trim()}">${label}</span>`;
    });
    
    txt = txt.replace(/>\s*\[!WARNING\]/g, '> ⚠️ **WARNING**');
    txt = txt.replace(/>\s*\[!IMPORTANT\]/g, '> 💡 **IMPORTANT**');
    txt = txt.replace(/\n/g, '<br>');

    document.getElementById('note-text-content').innerHTML = txt;

    // Click trigger links
    document.querySelectorAll('#note-text-content .md-link').forEach(link => {
      link.addEventListener('click', () => {
        openNote(link.dataset.target);
        playBeep(850, 0.05);
      });
    });

    // Puzzle injection check
    const pContainer = document.getElementById('note-puzzle-container');
    const pBody = document.getElementById('note-puzzle-body');
    
    // Clear and restore original room placements first
    returnPuzzlesToRooms();

    if (noteContent.puzzle && noteContent.status !== "secured") {
      pContainer.classList.remove('hidden');
      pBody.innerHTML = '';
      
      if (noteContent.puzzle === "lr-r1") {
        pBody.appendChild(document.getElementById('lr-r1'));
      } else if (noteContent.puzzle === "lr-r2") {
        pBody.appendChild(document.getElementById('lr-r2'));
      } else if (noteContent.puzzle === "lr-r3") {
        pBody.appendChild(document.getElementById('lr-r3'));
      } else if (noteContent.puzzle === "pg-r1") {
        pBody.appendChild(document.getElementById('pg-r1'));
      } else if (noteContent.puzzle === "pg-r2") {
        pBody.appendChild(document.getElementById('pg-r2'));
      } else if (noteContent.puzzle === "class-keypad") {
        pBody.innerHTML = `
          <div class="ver-label">Enter Memory Verification Key:</div>
          <div class="ver-input-row" style="margin-top:10px; display:flex; gap:10px;">
            <input type="text" id="obsidian-class-passcode" class="scientist-text-input" style="flex-grow:1; background:rgba(0,0,0,0.5); border:1px solid rgba(0,243,255,0.25); color:#fff; padding:8px;" maxlength="6" placeholder="KEY">
            <button class="scientist-btn" id="btn-obsidian-class-verify">VERIFY</button>
          </div>
          <div class="ver-status text-dim" id="lbl-obsidian-class-verify-status" style="margin-top:8px; font-size:0.7rem;">LOCKED</div>
        `;
        
        setTimeout(() => {
          document.getElementById('btn-obsidian-class-verify').addEventListener('click', () => {
            const val = document.getElementById('obsidian-class-passcode').value.trim().toUpperCase();
            elements.inputClassPasscode.value = val;
            elements.btnClassVerify.click();
            
            setTimeout(() => {
              const statusEl = document.getElementById('lbl-obsidian-class-verify-status');
              if (elements.lblClassVerifyStatus.innerText.includes("APPROVED")) {
                statusEl.innerText = "PASSCODE APPROVED";
                statusEl.className = "ver-status text-success";
                noteDatabase["Classroom_Sector.md"].status = "secured";
                Object.keys(noteDatabase).forEach(k => {
                  if (noteDatabase[k].tags.includes("classroom")) {
                    noteDatabase[k].status = "secured";
                  }
                });
                renderFileTree();
                openNote("Classroom_Sector.md");
              } else {
                statusEl.innerText = "ERROR: CODE MISMATCH";
                statusEl.className = "ver-status text-danger blink";
                setTimeout(() => {
                  statusEl.innerText = "LOCKED";
                  statusEl.className = "ver-status text-dim";
                }, 1500);
              }
            }, 200);
          });
        }, 100);
      }
    } else if (noteContent.status === "secured" && noteContent.puzzle) {
      pContainer.classList.remove('hidden');
      pBody.innerHTML = `<div class="text-success font-mono">✅ MEMORY FRAGMENT RESTORED & COGNITIVELY STABILIZED.</div>`;
    } else if (noteId === "Sam.md" && noteDatabase["LivingRoom_Sector.md"].status === "secured" && noteDatabase["Playground_Sector.md"].status === "secured" && noteDatabase["Classroom_Sector.md"].status === "secured") {
      // Integration command puzzle trigger
      pContainer.classList.remove('hidden');
      pBody.innerHTML = `
        <div class="ver-label text-warning font-mono">⚠️ ALL MEMORY SECTORS UNLOCKED. READY FOR CONTEXT INTEGRATION.</div>
        <p style="font-size:0.75rem; margin-top:5px; color:rgba(255,255,255,0.7);">Type "INTEGRATE" in the system command to boot exploration ejection:</p>
        <div class="ver-input-row" style="margin-top:10px; display:flex; gap:10px;">
          <input type="text" id="obsidian-integrate-input" class="scientist-text-input" style="flex-grow:1; background:rgba(0,0,0,0.5); border:1px solid rgba(255,51,102,0.25); color:#fff; padding:8px;" placeholder="COMMAND">
          <button class="scientist-btn terminate-btn" id="btn-obsidian-integrate-execute">EXECUTE</button>
        </div>
      `;
      
      setTimeout(() => {
        document.getElementById('btn-obsidian-integrate-execute').addEventListener('click', () => {
          const val = document.getElementById('obsidian-integrate-input').value.trim().toUpperCase();
          if (val === "INTEGRATE") {
            playBeep(220, 0.5, 'sawtooth');
            document.getElementById('view-obsidian-workspace').classList.add('hidden');
            elements.btnEndExploration.click();
          } else {
            playBeep(180, 0.2, 'sawtooth');
            alert("COMMAND ERROR: UNSUPPORTED RE-MAP KEY");
          }
        });
      }, 100);
    } else if (noteContent.tags.includes("classroom") && noteId !== "Classroom_Sector.md" && noteContent.status !== "secured") {
      // Hotspot clicker
      pContainer.classList.remove('hidden');
      pBody.innerHTML = `
        <button class="scientist-btn" id="btn-obsidian-investigate-clue" style="width:100%;">
          🔍 RUN NEURAL DECRYPTION RECON
        </button>
      `;
      
      setTimeout(() => {
        document.getElementById('btn-obsidian-investigate-clue').addEventListener('click', () => {
          const origObjName = noteContent.puzzle;
          // Find original hidden room hotspot element
          const hotspotEl = document.querySelector(`.classroom-hotspot[data-obj="${origObjName}"]`);
          if (hotspotEl) {
            hotspotEl.click();
            noteContent.status = "secured";
            renderFileTree();
            openNote(noteId);
          }
        });
      }, 100);
    } else {
      pContainer.classList.add('hidden');
    }

    // Backlinks rendering
    const blList = document.getElementById('note-backlinks-list');
    blList.innerHTML = '';
    
    let hasLinks = false;
    Object.keys(noteDatabase).forEach(dbId => {
      if (dbId === noteId) return;
      if (noteDatabase[dbId].content.includes(`[[${noteId}]]`)) {
        hasLinks = true;
        const li = document.createElement('li');
        li.innerHTML = `<span class="backlink-item-link" data-target="${dbId}">${dbId.replace('.md', '')}</span>`;
        blList.appendChild(li);
      }
    });

    if (!hasLinks) {
      blList.innerHTML = `<li class="text-dim" style="font-size:0.7rem;">(No links found connecting to this note)</li>`;
    } else {
      document.querySelectorAll('#note-backlinks-list .backlink-item-link').forEach(link => {
        link.addEventListener('click', () => {
          openNote(link.dataset.target);
          playBeep(850, 0.05);
        });
      });
    }
  }

  function returnPuzzlesToRooms() {
    const lrR1 = document.getElementById('lr-r1');
    const lrR2 = document.getElementById('lr-r2');
    const lrR3 = document.getElementById('lr-r3');
    const pgR1 = document.getElementById('pg-r1');
    const pgR2 = document.getElementById('pg-r2');
    
    if (lrR1 && lrR1.parentNode.id === "note-puzzle-body") {
      document.querySelector('#room-livingroom .nostalgic-hud-body').insertBefore(lrR1, document.getElementById('lr-round-success-card'));
    }
    if (lrR2 && lrR2.parentNode.id === "note-puzzle-body") {
      document.querySelector('#room-livingroom .nostalgic-hud-body').insertBefore(lrR2, document.getElementById('lr-round-success-card'));
    }
    if (lrR3 && lrR3.parentNode.id === "note-puzzle-body") {
      document.querySelector('#room-livingroom .nostalgic-hud-body').insertBefore(lrR3, document.getElementById('lr-round-success-card'));
    }
    if (pgR1 && pgR1.parentNode.id === "note-puzzle-body") {
      document.querySelector('#room-playground .nostalgic-hud-body').insertBefore(pgR1, document.getElementById('pg-round-success-card'));
    }
    if (pgR2 && pgR2.parentNode.id === "note-puzzle-body") {
      document.querySelector('#room-playground .nostalgic-hud-body').insertBefore(pgR2, document.getElementById('pg-round-success-card'));
    }
  }

  // Hooking completed original events to secure file database states
  function wrapGamePuzzleEvents() {
    // Round success card proceeds hook
    elements.btnLrProceedRound.addEventListener('click', () => {
      // Living Room R1 -> R2 -> R3
      if (systemState.lrRound === 2) {
        noteDatabase["Doraemon_Cartoon.md"].status = "secured";
        openNote("ZooZoo_Jingle.md");
      } else if (systemState.lrRound === 3) {
        noteDatabase["ZooZoo_Jingle.md"].status = "secured";
        openNote("Daily_Sounds.md");
      }
      renderFileTree();
    });

    // Trigger next room completion click hooks
    document.querySelectorAll('.btn-trigger-next-room').forEach(btn => {
      btn.addEventListener('click', () => {
        const nextRoom = btn.dataset.next;
        if (nextRoom === 'playground') {
          // Finished LR
          noteDatabase["Daily_Sounds.md"].status = "secured";
          noteDatabase["LivingRoom_Sector.md"].status = "secured";
          openNote("Playground_Sector.md");
        } else if (nextRoom === 'classroom') {
          // Finished PG
          noteDatabase["Playground_Sector.md"].status = "secured";
          openNote("Classroom_Sector.md");
        }
        renderFileTree();
      });
    });

    // Intercept choice correct clicks
    elements.lrQuizChoices.forEach(btn => {
      btn.addEventListener('click', () => {
        const round = parseInt(btn.dataset.round);
        const val = btn.dataset.val;
        
        if (round === 1 && val === 'Doraemon') {
          noteDatabase["Doraemon_Cartoon.md"].status = "secured";
          openNote("Doraemon_Cartoon.md");
        } else if (round === 2 && val === 'Vodafone ZooZoo') {
          noteDatabase["ZooZoo_Jingle.md"].status = "secured";
          openNote("ZooZoo_Jingle.md");
        }
        renderFileTree();
      });
    });

    elements.btnSubmitLr3.addEventListener('click', () => {
      const text = elements.inputLrDecode.value.toLowerCase().trim();
      const matches = ["school bell", "cartoon intro", "tv startup sound", "telephone ringtone"];
      if (matches.includes(text)) {
        noteDatabase["Daily_Sounds.md"].status = "secured";
        noteDatabase["LivingRoom_Sector.md"].status = "secured";
        renderFileTree();
        openNote("LivingRoom_Sector.md");
      }
    });

    // Playground Differences clicked
    const checkPlaygroundAnoms = () => {
      let count = 0;
      if (systemState.pgDiffFound.swing) count++;
      if (systemState.pgDiffFound.bicycle) count++;
      if (systemState.pgDiffFound.football) count++;
      
      if (count >= 1) {
        if (count === 3) {
          noteDatabase["Swing_Anomalies.md"].status = "secured";
          renderFileTree();
          if (currentActiveNote === "Swing_Anomalies.md") openNote("Swing_Anomalies.md");
        }
      }
    };

    elements.spotSwing.addEventListener('click', checkPlaygroundAnoms);
    elements.spotBicycle.addEventListener('click', checkPlaygroundAnoms);
    elements.spotFootball.addEventListener('click', checkPlaygroundAnoms);

    // Sunset focus click options
    elements.pgBlurChoices.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        if (val === 'cricket bat') {
          noteDatabase["Cricket_Sunset.md"].status = "secured";
          noteDatabase["Group_Photo.md"].status = "secured";
          noteDatabase["Playground_Sector.md"].status = "secured";
          renderFileTree();
          openNote("Playground_Sector.md");
        }
      });
    });

    elements.pgProceedRoundBtn.addEventListener('click', () => {
      noteDatabase["Swing_Anomalies.md"].status = "secured";
      renderFileTree();
      openNote("Cricket_Sunset.md");
    });
  }

  // Force-Directed physics updating loop (Euler integration)
  function updateGraphPhysicsLoop() {
    if (!physicsRunning) return;

    // Sub-stepping loops for math stiffness
    const steps = 3;
    for (let step = 0; step < steps; step++) {
      // 1. Repulsion (Push nodes apart)
      for (let i = 0; i < graphNodes.length; i++) {
        for (let j = i + 1; j < graphNodes.length; j++) {
          let nodeA = graphNodes[i];
          let nodeB = graphNodes[j];
          
          let dx = nodeB.x - nodeA.x;
          let dy = nodeB.y - nodeA.y;
          let dist = Math.sqrt(dx * dx + dy * dy) || 1;
          
          if (dist < 320) {
            let force = repulsionStrength / (dist * dist);
            if (force > 8) force = 8; // prevent extreme launch speeds
            let fx = (dx / dist) * force;
            let fy = (dy / dist) * force;
            
            nodeA.vx -= fx;
            nodeA.vy -= fy;
            nodeB.vx += fx;
            nodeB.vy += fy;
          }
        }
      }

      // 2. Attraction (Spring links pull nodes together)
      graphLinks.forEach(link => {
        let nodeSrc = graphNodes.find(n => n.id === link.source);
        let nodeTar = graphNodes.find(n => n.id === link.target);
        if (!nodeSrc || !nodeTar) return;

        let dx = nodeTar.x - nodeSrc.x;
        let dy = nodeTar.y - nodeSrc.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 1;
        
        let desired = linkDistance;
        let k = 0.015; // spring constant
        let force = (dist - desired) * k;
        
        let fx = (dx / dist) * force;
        let fy = (dy / dist) * force;
        
        nodeSrc.vx += fx;
        nodeSrc.vy += fy;
        nodeTar.vx -= fx;
        nodeTar.vy -= fy;
      });

      // 3. Central Gravity Pull & Boundaries & Friction Update
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      graphNodes.forEach(node => {
        if (node === draggedNode) return; // ignore dragged node physics

        // Gravity pull to center
        let dx = cx - node.x;
        let dy = cy - node.y;
        node.vx += dx * gravityStrength;
        node.vy += dy * gravityStrength;

        // Apply friction damping
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.85;
        node.vy *= 0.85;
        
        // Prevent launching off-screen boundaries
        node.x = Math.max(Math.min(node.x, canvas.width + 200), -200);
        node.y = Math.max(Math.min(node.y, canvas.height + 200), -200);
      });
    }

    // Render nodes
    drawGraph();

    // Loop
    requestAnimationFrame(updateGraphPhysicsLoop);
  }

  function drawGrid() {
    canvasCtx.save();
    canvasCtx.strokeStyle = 'rgba(0, 243, 255, 0.02)';
    canvasCtx.lineWidth = 0.5;
    
    const gridSize = 40;
    // Map grid lines relative to pan offset and scale
    const startX = -graphOffsetX / graphScale;
    const startY = -graphOffsetY / graphScale;
    const endX = startX + canvas.width / graphScale;
    const endY = startY + canvas.height / graphScale;
    
    // Draw vertical
    const firstX = Math.floor(startX / gridSize) * gridSize;
    for (let x = firstX; x < endX; x += gridSize) {
      canvasCtx.beginPath();
      canvasCtx.moveTo(x, startY);
      canvasCtx.lineTo(x, endY);
      canvasCtx.stroke();
    }
    
    // Draw horizontal
    const firstY = Math.floor(startY / gridSize) * gridSize;
    for (let y = firstY; y < endY; y += gridSize) {
      canvasCtx.beginPath();
      canvasCtx.moveTo(startX, y);
      canvasCtx.lineTo(endX, y);
      canvasCtx.stroke();
    }
    canvasCtx.restore();
  }

  function drawGraph() {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    
    canvasCtx.save();
    canvasCtx.translate(graphOffsetX, graphOffsetY);
    canvasCtx.scale(graphScale, graphScale);
    
    // 1. Grid
    drawGrid();

    // 2. Draw Connections (Links)
    canvasCtx.shadowBlur = 0;
    graphLinks.forEach(link => {
      let nodeSrc = graphNodes.find(n => n.id === link.source);
      let nodeTar = graphNodes.find(n => n.id === link.target);
      if (!nodeSrc || !nodeTar) return;

      let isHoverConnected = (hoverNode && (hoverNode.id === nodeSrc.id || hoverNode.id === nodeTar.id));
      
      canvasCtx.beginPath();
      canvasCtx.moveTo(nodeSrc.x, nodeSrc.y);
      canvasCtx.lineTo(nodeTar.x, nodeTar.y);

      if (isHoverConnected) {
        canvasCtx.strokeStyle = 'rgba(0, 243, 255, 0.8)';
        canvasCtx.lineWidth = 2.0;
        if (glowingEdges) {
          canvasCtx.shadowBlur = 10;
          canvasCtx.shadowColor = 'rgba(0, 243, 255, 0.6)';
        }
      } else {
        if (hoverNode) {
          canvasCtx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        } else {
          canvasCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        }
        canvasCtx.lineWidth = 0.75;
      }
      canvasCtx.stroke();
      canvasCtx.shadowBlur = 0; // reset
    });

    // 3. Draw Nodes
    graphNodes.forEach(node => {
      let dbNode = noteDatabase[node.id];
      let isSecured = dbNode ? dbNode.status === "secured" : false;
      let isActive = currentActiveNote === node.id;
      let isSearchMatch = searchFilter && node.id.toLowerCase().includes(searchFilter.toLowerCase());
      let isTagMatch = activeTagFilter && dbNode && dbNode.tags.includes(activeTagFilter);

      let opacity = 1.0;
      if (hoverNode) {
        let isHoverConnected = (hoverNode.id === node.id || graphLinks.some(l => 
          (l.source === hoverNode.id && l.target === node.id) ||
          (l.target === hoverNode.id && l.source === node.id)
        ));
        if (!isHoverConnected) opacity = 0.2;
      }
      if (activeTagFilter && !isTagMatch) opacity = 0.15;

      canvasCtx.globalAlpha = opacity;

      // Outer active ring
      if (isActive || isSearchMatch) {
        canvasCtx.beginPath();
        canvasCtx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
        canvasCtx.strokeStyle = isSearchMatch ? 'rgba(255, 51, 102, 0.7)' : 'rgba(0, 243, 255, 0.7)';
        canvasCtx.lineWidth = 1.5;
        canvasCtx.stroke();
      }

      // Draw Node Dot
      canvasCtx.beginPath();
      canvasCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      
      let color = '#f0f3ff';
      if (isSecured) color = 'rgba(46, 204, 113, 0.9)'; // Green
      else if (node.id === "Sam.md") {
        let pulse = 1 + Math.sin(Date.now() / 150) * 0.08;
        color = 'rgba(255, 51, 102, 0.95)';
        node.radius = 12 * pulse;
      }
      else if (node.type === "system") color = 'rgba(189, 0, 255, 0.9)'; // Purple
      else if (node.type === "folder") color = 'rgba(226, 167, 76, 0.9)'; // Gold
      else if (node.type === "clue") color = 'rgba(0, 243, 255, 0.9)'; // Cyan

      canvasCtx.fillStyle = color;
      
      if (glowingEdges) {
        canvasCtx.shadowBlur = 12;
        canvasCtx.shadowColor = color;
      }
      canvasCtx.fill();
      canvasCtx.shadowBlur = 0; // reset

      // Draw Node Name Label
      let drawLabelText = showLabels || node === hoverNode || (hoverNode && graphLinks.some(l => 
        (l.source === hoverNode.id && l.target === node.id) ||
        (l.target === hoverNode.id && l.source === node.id)
      )) || isSearchMatch || isActive;

      if (drawLabelText && opacity > 0.25) {
        canvasCtx.font = `${node.id === "Sam.md" ? 'bold 10px' : '9px'} 'Share Tech Mono', monospace`;
        canvasCtx.fillStyle = node.id === "Sam.md" ? 'rgba(255, 51, 102, 0.95)' : 'rgba(240, 243, 255, 0.8)';
        canvasCtx.textAlign = 'center';
        let cleanName = node.label.replace('.md', '');
        canvasCtx.fillText(cleanName, node.x, node.y - node.radius - 6);
      }
    });

    canvasCtx.restore();
    canvasCtx.globalAlpha = 1.0;
  }

});
