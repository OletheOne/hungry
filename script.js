const databaseUrl = 'https://hungrydatabase-default-rtdb.firebaseio.com/answers.json'; // Replace with your Firebase Database URL

async function recordAnswer(answer) {
    const timestamp = new Date().toISOString();

    // Send answer to the database
    try {
        await fetch(databaseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answer, timestamp }),
        });

        // Hide buttons and fetch results
        document.getElementById('buttons').classList.add('hidden');
        fetchHistory();
    } catch (error) {
        console.error("Error posting data:", error);
    }
}

async function fetchHistory() {
    try {
        const response = await fetch(databaseUrl);
        const data = await response.json();
        const history = Object.values(data || {});

        showHistory(history);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function showHistory(history) {
    const yesCount = history.filter(h => h.answer === 'Yes').length;
    const noCount = history.filter(h => h.answer === 'No').length;
    const unsureCount = history.filter(h => h.answer === 'I’m Not Sure').length;

    // Generate personalized message
    let funMessage = '';
    if (yesCount > noCount && yesCount > unsureCount) {
        funMessage = 'You seem to be hungry most of the time!';
    } else if (noCount > yesCount && noCount > unsureCount) {
        funMessage = 'You’re usually not hungry!';
    } else if (unsureCount > yesCount && unsureCount > noCount) {
        funMessage = 'You’re often undecided!';
    } else {
        funMessage = 'You have a balanced set of choices!';
    }

    // Update result text
    const resultDiv = document.getElementById('result');
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = `
        <p>${funMessage}</p>
        <p>Yes: ${yesCount}, No: ${noCount}, Unsure: ${unsureCount}</p>
    `;

    // Show chart
    const ctx = document.getElementById('historyChart').getContext('2d');
    const chartCanvas = document.getElementById('historyChart');
    chartCanvas.classList.remove('hidden');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Yes', 'No', 'I’m Not Sure'],
            datasets: [{
                label: 'Responses',
                data: [yesCount, noCount, unsureCount],
                backgroundColor: ['#007bff', '#28a745', '#ffc107'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
            },
        },
    });
}
