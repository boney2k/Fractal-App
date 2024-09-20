document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fractal-canvas');
    const ctx = canvas.getContext('2d');
    const fractalTypeSelect = document.getElementById('fractal-type');
    const iterationsInput = document.getElementById('iterations');
    const generateButton = document.getElementById('generate');

    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b})`;
    }

    function generateFractal() {
        const fractalType = fractalTypeSelect.value;
        const iterations = Math.min(parseInt(iterationsInput.value, 10), 30);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let points = [[0, 0], [canvas.width, 0]];
        let currentIteration = 0;

        function drawIteration() {
            if (currentIteration >= iterations) {
                return;
            }

            const newPoints = [];
            for (let j = 0; j < points.length - 1; j++) {
                const [x1, y1] = points[j];
                const [x2, y2] = points[j + 1];

                newPoints.push([x1, y1]);

                if (fractalType === 'dragon') {
                    const midX = (x1 + x2) / 2 - (y2 - y1) / 2;
                    const midY = (y1 + y2) / 2 + (x2 - x1) / 2;
                    newPoints.push([midX, midY]);
                } else if (fractalType === 's') {
                    const midX = (x1 + x2) / 2;
                    const midY = (y1 + y2) / 2;
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const perpX = midX + dy / 3;
                    const perpY = midY - dx / 3;
                    newPoints.push([perpX, perpY]);
                }
            }
            newPoints.push(points[points.length - 1]);
            points = newPoints;

            // Scale and draw the current iteration
            const minX = Math.min(...points.map(([x]) => x));
            const maxX = Math.max(...points.map(([x]) => x));
            const minY = Math.min(...points.map(([, y]) => y));
            const maxY = Math.max(...points.map(([, y]) => y));

            const scale = Math.min(canvas.width / (maxX - minX), canvas.height / (maxY - minY)) * 0.95;
            const offsetX = (canvas.width - (maxX - minX) * scale) / 2 - minX * scale;
            const offsetY = (canvas.height - (maxY - minY) * scale) / 2 - minY * scale;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(points[0][0] * scale + offsetX, points[0][1] * scale + offsetY);

            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i][0] * scale + offsetX, points[i][1] * scale + offsetY);
                if (i % 100 === 0) {
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(points[i][0] * scale + offsetX, points[i][1] * scale + offsetY);
                    ctx.strokeStyle = getRandomColor();
                }
            }
            ctx.stroke();

            currentIteration++;
            requestAnimationFrame(drawIteration);
        }

        // Start the fractal generation
        requestAnimationFrame(drawIteration);
    }

    generateButton.addEventListener('click', generateFractal);
    generateFractal(); // Generate initial fractal
});