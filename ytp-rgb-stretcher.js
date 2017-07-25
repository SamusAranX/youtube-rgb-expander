// ==UserScript==
// @name         RGB Stretcher
// @namespace    https://peterwunder.de
// @version      1.0
// @description  Uses CSS filters to attempt to stretch the "TV" RGB range to the full RGB range. Depends on the "RGB Stretcher" userstyle.
// @author       Peter Wunder
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // <button class="ytp-subtitles-button ytp-button" aria-pressed="false" style="" title="Subtitles/closed captions"></button>
    var buttonElement = document.createElement("button");
    buttonElement.classList.add("ytp-rgb-button", "ytp-button");
    buttonElement.setAttribute("aria-pressed", "false");
    buttonElement.title = "Stretch RGB levels";
    buttonElement.innerHTML = "<svg height='100%' version='1.1' viewBox='0 0 36 36' width='100%'><use class='ytp-svg-shadow' NS1:href='#ytp-id-19'></use><g transform='matrix(1,0,0,1,-0.239352,16.9415)'><g transform='matrix(1.02283,0,0,1.05062,-0.165282,0.0196127)'><path d='M9.056,0.984L9.642,0.984C10.216,0.984 10.64,0.889 10.913,0.697C11.187,0.506 11.323,0.205 11.323,-0.205C11.323,-0.611 11.184,-0.901 10.904,-1.072C10.625,-1.244 10.192,-1.33 9.607,-1.33L9.056,-1.33L9.056,0.984ZM9.056,2.461L9.056,5.748L7.239,5.748L7.239,-2.818L9.735,-2.818C10.9,-2.818 11.761,-2.607 12.319,-2.183C12.878,-1.759 13.157,-1.115 13.157,-0.252C13.157,0.252 13.019,0.7 12.741,1.093C12.464,1.485 12.071,1.793 11.564,2.015L14.083,5.748L12.067,5.748L10.023,2.461L9.056,2.461Z' style='fill:white;fill-rule:nonzero;'/></g><g transform='matrix(0.995556,0,0,1.02196,-0.475325,0.0645846)'><path d='M18.413,0.937L21.812,0.937L21.812,5.379C21.261,5.558 20.742,5.684 20.256,5.757C19.77,5.829 19.273,5.865 18.765,5.865C17.472,5.865 16.484,5.485 15.803,4.725C15.121,3.966 14.78,2.875 14.78,1.453C14.78,0.07 15.176,-1.008 15.967,-1.781C16.758,-2.555 17.855,-2.942 19.257,-2.942C20.136,-2.942 20.983,-2.766 21.8,-2.414L21.196,-0.961C20.571,-1.274 19.921,-1.43 19.245,-1.43C18.46,-1.43 17.831,-1.166 17.358,-0.639C16.886,-0.111 16.65,0.598 16.65,1.488C16.65,2.418 16.84,3.128 17.221,3.618C17.602,4.108 18.155,4.353 18.882,4.353C19.261,4.353 19.646,4.314 20.036,4.236L20.036,2.449L18.413,2.449L18.413,0.937Z' style='fill:white;fill-rule:nonzero;'/></g><g transform='matrix(0.944649,0,0,1.05062,-0.29118,0.0196127)'><path d='M23.851,-2.818L26.517,-2.818C27.732,-2.818 28.613,-2.646 29.162,-2.3C29.711,-1.954 29.985,-1.404 29.985,-0.651C29.985,-0.139 29.865,0.281 29.625,0.609C29.385,0.937 29.066,1.135 28.667,1.201L28.667,1.26C29.21,1.381 29.602,1.607 29.842,1.939C30.082,2.271 30.202,2.713 30.202,3.264C30.202,4.045 29.92,4.654 29.356,5.092C28.791,5.529 28.025,5.748 27.056,5.748L23.851,5.748L23.851,-2.818ZM25.667,0.574L26.722,0.574C27.214,0.574 27.57,0.498 27.791,0.346C28.012,0.193 28.122,-0.059 28.122,-0.41C28.122,-0.738 28.002,-0.974 27.762,-1.116C27.522,-1.259 27.142,-1.33 26.622,-1.33L25.667,-1.33L25.667,0.574ZM25.667,2.015L25.667,4.248L26.851,4.248C27.351,4.248 27.72,4.152 27.958,3.961C28.196,3.769 28.316,3.476 28.316,3.082C28.316,2.371 27.808,2.015 26.792,2.015L25.667,2.015Z' style='fill:white;fill-rule:nonzero;'/></g></g></svg>";
    
    buttonElement.addEventListener("click", function(e) {
        var isCurrentlyPressed = this.getAttribute("aria-pressed") == "true";
        var newPressedStatus = !isCurrentlyPressed;
        this.setAttribute("aria-pressed", newPressedStatus);

        document.body.classList.toggle("ytp-rgb-stretcher", newPressedStatus);
    });
    
    var rightControls = document.getElementsByClassName("ytp-right-controls")[0];
    var firstRightControl = rightControls.firstChild;
    rightControls.insertBefore(buttonElement, firstRightControl);
})();