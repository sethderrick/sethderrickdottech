// display.js
import interactiveSVGDisplay from "./displays/svg-display.js";
import webGLDisplay from "./displays/webgl-display.js";

class DisplayManager {
  constructor(containerId = "display-area") {
    this.container = document.getElementById(containerId);
    this.currentDisplay = null;
    this.isAnimating = false;
  }

  clear() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    if (this.currentDisplay?.cleanup) {
      this.currentDisplay.cleanup();
    }
    this.currentDisplay = null;
    this.isAnimating = false;
  }

  async setDisplay(displayModule) {
    this.clear();
    this.currentDisplay = await displayModule.create(this.container);
    if (displayModule.animate) {
      this.isAnimating = true;
      this.animate();
    }
  }

  animate() {
    if (!this.isAnimating || !this.currentDisplay?.update) return;
    this.currentDisplay.update();
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize with your chosen display
const display = new DisplayManager();

// Change this line to switch between displays
// display.setDisplay(interactiveSVGDisplay).catch(console.error);
display.setDisplay(webGLDisplay).catch(console.error);

export { DisplayManager };
