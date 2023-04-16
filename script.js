const settings = document.getElementById("settings");
const inhaleInput = document.getElementById("inhale");
const holdInput = document.getElementById("hold");
const exhaleInput = document.getElementById("exhale");
const roundsInput = document.getElementById("rounds");
const startBtn = document.getElementById("start-btn");
const timerDisplay = document.getElementById("timer-display");
const phaseDisplay = document.getElementById("phase-display");
const roundsLeftDisplay = document.getElementById("rounds-left-display");

const addTimerSetBtn = document.getElementById("add-timer-set");
const timerSets = document.getElementById("timer-sets");

let inhaleTime = 0;
let holdTime = 0;
let exhaleTime = 0;
let rounds = 0;
let currentRound = 1;

const timerSetsData = [];

startBtn.addEventListener("click", () => {
	inhaleTime = parseInt(inhaleInput.value) * 1000;
	holdTime = parseInt(holdInput.value) * 1000;
	exhaleTime = parseInt(exhaleInput.value) * 1000;
	rounds = parseInt(roundsInput.value);
  
	settings.style.display = "none";
	roundsLeftDisplay.style.display = "block";
  
	performBreathing();
  });

function updateTimerDisplay(time) {
  timerDisplay.textContent = time;
}

function updatePhaseDisplay(phase) {
  phaseDisplay.textContent = phase;
}

function updateRoundsLeftDisplay(roundsLeft) {
  roundsLeftDisplay.textContent = `Rounds left: ${roundsLeft}`;
}

function updateTimer (phaseTime, phaseName, nextPhase) {
    let remainingTime = phaseTime;
    updateTimerDisplay(remainingTime / 1000);
    updatePhaseDisplay(phaseName);
    const timerInterval = setInterval(() => {
      remainingTime -= 1000;
      updateTimerDisplay(remainingTime / 1000);
      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        if (nextPhase) {
          nextPhase();
        }
      }
    }, 1000);
  };

  function performBreathing() {
	if (currentRound > rounds) {
	  resetPage();
	  return;
	}
  
	updateRoundsLeftDisplay(rounds - currentRound + 1);
  
	let currentTimerSetIndex;
	if (currentRound === 1) {
	  currentTimerSetIndex = -1; // Use the original timers for the first round
	} else {
	  currentTimerSetIndex = (currentRound - 2) % timerSetsData.length;
	}
  
	const currentTimerSet = timerSetsData[currentTimerSetIndex] || {};
	const currentInhaleTime = currentTimerSet.inhaleTime || inhaleTime;
	const currentHoldTime = currentTimerSet.holdTime || holdTime;
	const currentExhaleTime = currentTimerSet.exhaleTime || exhaleTime;
  
	const timerSequence = [
	  { duration: currentInhaleTime, name: "INHALE" },
	  { duration: currentHoldTime, name: "HOLD" },
	  { duration: currentExhaleTime, name: "EXHALE" },
	  { duration: currentHoldTime, name: "HOLD" },
	];
  
	timerSetsData.forEach((set) => {
	  set.inhaleTime = parseInt(set.inhale.value) * 1000;
	  set.holdTime = parseInt(set.hold.value) * 1000;
	  set.exhaleTime = parseInt(set.exhale.value) * 1000;
  
	  timerSequence.push(
		{ duration: set.inhaleTime, name: "INHALE" },
		{ duration: set.holdTime, name: "HOLD" },
		{ duration: set.exhaleTime, name: "EXHALE" },
		{ duration: set.holdTime, name: "HOLD" }
	  );
	});
  
	let timerIndex = 0;
  
	function nextTimer() {
	  if (timerIndex < timerSequence.length) {
		const timer = timerSequence[timerIndex];
		updateTimer(timer.duration, timer.name, () => {
		  	timerIndex++;
			// Wait for 1 second before moving to the next timer
			setTimeout(() => {
			nextTimer();
			}, 1000);
		});
	  } else {
		currentRound++;
		performBreathing();
	  }
	}
  
	nextTimer();
  }
  

function resetPage() {
	settings.style.display = "block";
	timerDisplay.textContent = inhaleInput.value;
	phaseDisplay.textContent = "";
	roundsLeftDisplay.style.display = "none";
	currentRound = 1;
  }
  
  addTimerSetBtn.addEventListener("click", () => {
	const timerSet = document.createElement("div");
	timerSet.classList.add("timer-set");
  
	const inhaleInput = document.createElement("input");
	inhaleInput.type = "number";
	inhaleInput.min = "1";
	inhaleInput.value = "4";
	inhaleInput.classList.add("timer-input");
  
	const holdInput = document.createElement("input");
	holdInput.type = "number";
	holdInput.min = "1";
	holdInput.value = "4";
	holdInput.classList.add("timer-input");
  
	const exhaleInput = document.createElement("input");
	exhaleInput.type = "number";
	exhaleInput.min = "1";
	exhaleInput.value = "4";
	exhaleInput.classList.add("timer-input");
  
	timerSet.appendChild(inhaleInput);
	timerSet.appendChild(holdInput);
	timerSet.appendChild(exhaleInput);
  
	timerSets.appendChild(timerSet);
  
	timerSetsData.push({
	  inhale: inhaleInput,
	  hold: holdInput,
	  exhale: exhaleInput
	});
  });


  