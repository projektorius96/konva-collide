// === VIEWPORT
const correctionCoeff = 0.987;     
const verticalScrollbarWidth = (document.body.clientWidth - window.innerWidth);     
const FULL_VIEWPORT_WIDTH = (document.body.clientWidth - verticalScrollbarWidth)  * correctionCoeff;     
const FULL_VIEWPORT_HEIGHT = (window.innerHeight + correctionCoeff);
// === OTHER
//...

export default {
    VIEWPORT: {
        FULL_VIEWPORT_WIDTH,
        FULL_VIEWPORT_HEIGHT
    }
    /* OTHER : {
        ...
    } */
}