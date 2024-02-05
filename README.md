# Equalizer assignment

## Requirements

- Display grid of random size
- Allow user to select an audio file
- Once selected audio should play in audio player
- Grid should show waves based on audio file

## Notes

- There are two possible approaches: use HTML elements to display a grid and a canvas. I decided to go with a canvas to decrease the number of DOM manipulations. If it is required to use HTML elements, the solution could be easily adjusted, and we can render a grid on the initial render and then just change the style property for each grid item
