function colorPalettes() {
  const colors = document.querySelectorAll('.wmcads-website-color-swatch__inner');

  // Function to convert rgb/rgba to hex
  function rgb2hex(rgb) {
    // Handle both rgb() and rgba() formats
    const rgbMatch = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);

    if (!rgbMatch) {
      // If it's already a hex color, return it as-is
      if (rgb.startsWith('#')) {
        return rgb;
      }
      // Fallback for unexpected formats
      return rgb;
    }

    function hex(x) {
      return `0${parseInt(x, 10).toString(16)}`.slice(-2);
    }

    return `#${hex(rgbMatch[1])}${hex(rgbMatch[2])}${hex(rgbMatch[3])}`;
  }

  const updateColors = () => {
    colors.forEach(swatch => {
      const ele = swatch;
      const rgbColor = getComputedStyle(swatch).backgroundColor;
      const hexColor = rgb2hex(rgbColor);

      const nextElement = ele.nextElementSibling;
      if (nextElement) {
        const colorHexElement = nextElement.querySelector('pre code .color-hex');
        if (colorHexElement) {
          colorHexElement.innerText = `color: '${hexColor}'`;
        }
      }
    });
  };

  // Wait for stylesheets to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateColors);
  } else {
    // Use setTimeout to ensure CSS is applied
    setTimeout(updateColors, 100);
  }
}

export default colorPalettes;
