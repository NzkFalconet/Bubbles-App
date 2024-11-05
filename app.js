
const canvas = document.getElementById("bubblesCanvas");
const ctx = canvas.getContext("2d");

// Define the initial state for circles and arrows
const circles = [
    { x: 50, y: 50, radius: 20, color: "red", arrowX: 350, arrowY: 50 },
    { x: 50, y: 150, radius: 20, color: "green", arrowX: 350, arrowY: 150 },
    { x: 50, y: 250, radius: 20, color: "blue", arrowX: 350, arrowY: 250 },
    { x: 50, y: 350, radius: 20, color: "yellow", arrowX: 350, arrowY: 350 },
];

// Store the initial colors for reset purposes
const initialCircleColors = ["red", "green", "blue", "yellow"];

// Function to draw circles and arrows on the canvas
function drawCirclesAndArrows() {
    // Clear canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each circle with its corresponding arrow pointing left
    circles.forEach((circle) => {
        // Draw circle
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.hit ? "gray" : circle.color; // Change color on hit
        ctx.fill();
        ctx.closePath();

        // Draw arrow with arrowhead pointing left
        const arrowLength = 20;  // Length of the arrow shaft
        const arrowHeadSize = 5; // Size of the arrowhead

        ctx.beginPath();
        // Draw arrow shaft as a line segment pointing to the left
        ctx.moveTo(circle.arrowX, circle.arrowY);  // Start of the line (base of the arrow)
        ctx.lineTo(circle.arrowX - arrowLength, circle.arrowY);  // End of the line (near arrowhead)
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw arrowhead pointing left
        ctx.beginPath();
        ctx.moveTo(circle.arrowX - arrowLength, circle.arrowY);  // Tip of arrow
        ctx.lineTo(circle.arrowX - arrowLength + arrowHeadSize, circle.arrowY - arrowHeadSize); // Top of arrowhead
        ctx.lineTo(circle.arrowX - arrowLength + arrowHeadSize, circle.arrowY + arrowHeadSize); // Bottom of arrowhead
        ctx.lineTo(circle.arrowX - arrowLength, circle.arrowY);  // Complete arrowhead by returning to the tip
        ctx.fillStyle = "black";
        ctx.fill();
    });
}


// Initialize the canvas with circles and arrows
drawCirclesAndArrows();

// Function to handle arrow movement toward the circle when clicked
function moveArrowToCircle(index) {
    const circle = circles[index];
    const arrowSpeed = 4;

    function animateArrow() {
        // Calculate the stopping point for the arrow so it stops at the circle's edge
        const stopX = circle.x + circle.radius + 20; // 20 is the arrow shaft length

        // Move the arrow towards the circle
        if (circle.arrowX > stopX) {
            circle.arrowX -= arrowSpeed;
            drawCirclesAndArrows();
            requestAnimationFrame(animateArrow);
        } else {
            // Arrow has reached the edge of the circle, change circle color
            circle.color = "gray";
            drawCirclesAndArrows();
        }
    }

    animateArrow();
}


// Handle click events on the canvas to detect circle clicks
canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    circles.forEach((circle, index) => {
        const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
        
        if (distance < circle.radius) {
            moveArrowToCircle(index);
        }
    });
});

// Reset button functionality to restore the initial state of the app
document.getElementById("resetButton").addEventListener("click", function() {
    circles.forEach((circle, index) => {
        circle.color = initialCircleColors[index];
        circle.arrowX = 350; // Reset arrow start position
    });
    
    drawCirclesAndArrows();
});