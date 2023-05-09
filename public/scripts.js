// If you would like to see some examples of similar code to make an interface interact with an API, 
// check out the coin-server example from a previous COMP 426 semester.
// https://github.com/jdmar3/coinserver
// Function to send a call to the API server
async function sendAPICall(endpoint, data) {
  try {
    const response = await fetch(`https://localhost:5000/app/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Function to play with an opponent or request a random draw
async function playGame(opponentChoice) {
  try {
    const data = {
      opponentChoice: opponentChoice,
    };
    const result = await sendAPICall('play', data);
    // Handle the result
    console.log(result);
  } catch (error) {
    // Handle errors
    console.error(error);
  }
}

// Function to play Rock-Paper-Scissors or Rock-Paper-Scissors-Lizard-Spock
async function playRPSorRPSLS(gameType, playerChoice) {
  try {
    const data = {
      gameType: gameType,
      playerChoice: playerChoice,
    };
    const result = await sendAPICall('play/rps-or-rpsls', data);
    // Handle the result
    console.log(result);
  } catch (error) {
    // Handle errors
    console.error(error);
  }
}

// Function to reset the selections and reset the interface
function resetInterface() {
  // Clear the selected choices and reset the interface as needed
  console.log('Resetting interface...');
}

// Event listener for play with opponent button click
document.getElementById('play-opponent-button').addEventListener('click', function () {
  const opponentChoice = document.querySelector('input[name="opponent-choice"]:checked').value;
  playGame(opponentChoice);
});

// Event listener for play without opponent button click
document.getElementById('play-no-opponent-button').addEventListener('click', function () {
  playGame(null);
});

// Event listener for play RPS button click
document.getElementById('play-rps-button').addEventListener('click', function () {
  const playerChoice = document.querySelector('input[name="player-choice"]:checked').value;
  playRPSorRPSLS('rps', playerChoice);
});

// Event listener for play RPSLS button click
document.getElementById('play-rpsls-button').addEventListener('click', function () {
  const playerChoice = document.querySelector('input[name="player-choice"]:checked').value;
  playRPSorRPSLS('rpsls', playerChoice);
});

// Event listener for play button click
document.getElementById('play-button').addEventListener('click', function () {
  const gameType = document.querySelector('input[name="game-type"]:checked').value;
  const gameMode = document.querySelector('input[name="game-mode"]:checked').value;

  if (gameMode === 'opponent') {
    const opponentChoice = document.querySelector('input[name="opponent-choice"]:checked').value;
    playGame(opponentChoice);
  } else {
    playGame(null);
  }
});

// Event listener for reset button click
document.getElementById('reset-button').addEventListener('click', resetInterface);
