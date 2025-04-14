/**
 * PotatoPathFinder - Chart Configuration
 * Created by: Ritika Chaudhary and Veer Vikram Singh
 */

// Function to render the disease statistics chart
function renderChart(labels, data) {
    const ctx = document.getElementById('disease-stats-chart').getContext('2d');
    
    // Define colors for each disease category
    const colors = {
        'Healthy': '#4bb462',          // Success green
        'Early Blight': '#f1b434',     // Warning yellow
        'Late Blight': '#c1433f'       // Danger red
    };
    
    // Create background colors array based on labels
    const backgroundColors = labels.map(label => {
        return colors[label] || '#8fb996'; // Default to secondary color if not found
    });
    
    // Create a slightly darker version for the border colors
    const borderColors = backgroundColors.map(color => {
        // Convert hex to RGB, darken, and convert back to hex
        let r = parseInt(color.substring(1, 3), 16);
        let g = parseInt(color.substring(3, 5), 16);
        let b = parseInt(color.substring(5, 7), 16);
        
        r = Math.max(0, r - 20);
        g = Math.max(0, g - 20);
        b = Math.max(0, b - 20);
        
        return `rgb(${r}, ${g}, ${b})`;
    });
    
    // Create the chart
    const diseaseStatsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Potato Disease Distribution',
                    font: {
                        size: 18
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.formattedValue || '';
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((context.raw / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
    
    return diseaseStatsChart;
}

// Function to render the accuracy trend chart (if needed)
function renderAccuracyTrendChart(dates, accuracies) {
    const ctx = document.getElementById('accuracy-trend-chart').getContext('2d');
    
    const accuracyTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Detection Accuracy',
                data: accuracies,
                backgroundColor: 'rgba(74, 124, 89, 0.2)',
                borderColor: '#4a7c59',
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: '#4a7c59',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 70,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Accuracy (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Detection Accuracy Trend',
                    font: {
                        size: 18
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Accuracy: ' + context.formattedValue + '%';
                        }
                    }
                }
            }
        }
    });
    
    return accuracyTrendChart;
}
