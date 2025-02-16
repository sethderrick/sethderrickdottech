// svg-display.js
const interactiveSVGDisplay = {
  create: async (container) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.width = '100%';
    svg.style.height = '100%';

    // Create multiple circles with different properties
    const circles = Array.from({ length: 12 }, (_, i) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '50');
      circle.setAttribute('cy', '50');
      circle.setAttribute('r', 5 + i * 3);
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', `hsl(${i * 30}, 70%, 50%)`);
      circle.setAttribute('stroke-width', '0.5');
      return circle;
    });

    circles.forEach(circle => svg.appendChild(circle));
    container.appendChild(svg);

    let mouseX = 0;
    let mouseY = 0;
    let time = 0;

    // Add mouse move listener
    const handleMouseMove = (e) => {
      const rect = svg.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      mouseY = ((e.clientY - rect.top) / rect.height) * 100;
    };

    container.addEventListener('mousemove', handleMouseMove);

    return {
      update: () => {
        time += 0.016; // Approximately 60fps
        circles.forEach((circle, i) => {
          const phase = time + i * 0.2;
          const radiusOffset = Math.sin(phase) * 2;
          const xOffset = (mouseX - 50) * 0.1 * (i + 1) / circles.length;
          const yOffset = (mouseY - 50) * 0.1 * (i + 1) / circles.length;

          circle.setAttribute('cx', 50 + xOffset);
          circle.setAttribute('cy', 50 + yOffset);
          circle.setAttribute('r', (5 + i * 3 + radiusOffset).toString());
        });
      },
      cleanup: () => {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  },
  animate: true
};

export default interactiveSVGDisplay;
