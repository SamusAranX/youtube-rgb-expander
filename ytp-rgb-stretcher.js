// ==UserScript==
// @name         RGB Expander
// @namespace    https://peterwunder.de
// @version      1.55
// @description  Uses SVG filters to attempt to stretch the "TV" RGB range to the full RGB range. Depends on the "RGB Expander" userstyle: https://gist.github.com/SamusAranX/402b362fc5d3f5e49225ebde7084c927/
// @author       Peter Wunder
// @match        https://www.youtube.com/*
// @updateURL    https://gist.githubusercontent.com/SamusAranX/402b362fc5d3f5e49225ebde7084c927/raw/ytp-rgb-stretcher.js
// @downloadURL  https://gist.githubusercontent.com/SamusAranX/402b362fc5d3f5e49225ebde7084c927/raw/ytp-rgb-stretcher.js
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

var SVG_PREFIX = "<svg height='100%' version='1.1' viewBox='0 0 36 36' width='100%'><use class='ytp-svg-shadow' NS1:href='#ytp-id-19'></use>";
var SVG_SUFFIX = "</svg>";

var SVG_FILTER = `
<svg style="position:absolute;" xmlns="http://www.w3.org/2000/svg">
  <filter id="yt-rgb-fix">
	<feComponentTransfer>
	  <feFuncR type="linear" slope="1.1062906724511925" intercept="-0.019522776572668116"/>
	  <feFuncG type="linear" slope="1.1062906724511925" intercept="-0.019522776572668116"/>
	  <feFuncB type="linear" slope="1.1062906724511925" intercept="-0.019522776572668116"/>
	</feComponentTransfer>
  </filter>
</svg>
`;

// console.log(SVG_FILTER);

var SVG_TEXT_ICON = "<g><path d='M7.987,17.84l0.634,0c0.622,0 1.082,-0.104 1.378,-0.311c0.296,-0.208 0.444,-0.533 0.444,-0.978c0,-0.44 -0.151,-0.753 -0.454,-0.939c-0.302,-0.186 -0.771,-0.279 -1.406,-0.279l-0.596,0l0,2.507Zm0,1.599l0,3.561l-1.968,0l0,-9.28l2.704,0c1.261,0 2.194,0.23 2.799,0.689c0.605,0.459 0.908,1.156 0.908,2.091c0,0.546 -0.15,1.032 -0.451,1.457c-0.3,0.426 -0.726,0.759 -1.276,1l2.73,4.043l-2.184,0l-2.215,-3.561l-1.047,0Z' style='fill:#fff;fill-rule:nonzero;'/><path d='M17.604,17.789l3.681,0l0,4.812c-0.596,0.194 -1.158,0.331 -1.685,0.409c-0.527,0.078 -1.065,0.117 -1.615,0.117c-1.401,0 -2.471,-0.411 -3.209,-1.234c-0.739,-0.823 -1.108,-2.005 -1.108,-3.545c0,-1.498 0.429,-2.666 1.286,-3.504c0.857,-0.838 2.045,-1.257 3.564,-1.257c0.952,0 1.87,0.19 2.755,0.571l-0.654,1.574c-0.677,-0.338 -1.382,-0.507 -2.114,-0.507c-0.85,0 -1.532,0.285 -2.044,0.857c-0.512,0.571 -0.768,1.339 -0.768,2.304c0,1.007 0.206,1.776 0.619,2.307c0.413,0.531 1.012,0.797 1.8,0.797c0.41,0 0.827,-0.043 1.25,-0.127l0,-1.936l-1.758,0l0,-1.638Z' style='fill:#fff;fill-rule:nonzero;'/><path d='M22.974,13.72l2.889,0c1.316,0 2.271,0.187 2.866,0.562c0.594,0.374 0.891,0.97 0.891,1.787c0,0.554 -0.13,1.009 -0.39,1.365c-0.26,0.355 -0.606,0.569 -1.038,0.641l0,0.063c0.588,0.131 1.013,0.377 1.273,0.737c0.26,0.359 0.39,0.837 0.39,1.434c0,0.846 -0.306,1.507 -0.917,1.981c-0.611,0.474 -1.442,0.71 -2.491,0.71l-3.473,0l0,-9.28Zm1.968,3.676l1.143,0c0.533,0 0.919,-0.083 1.158,-0.248c0.239,-0.165 0.359,-0.438 0.359,-0.819c0,-0.355 -0.13,-0.61 -0.391,-0.765c-0.26,-0.154 -0.671,-0.231 -1.234,-0.231l-1.035,0l0,2.063Zm0,1.561l0,2.418l1.282,0c0.542,0 0.942,-0.103 1.2,-0.311c0.258,-0.207 0.387,-0.524 0.387,-0.952c0,-0.77 -0.55,-1.155 -1.65,-1.155l-1.219,0Z' style='fill:#fff;fill-rule:nonzero;'/></g>";
var SVG_CIRCLES_ICON = "<g><path d='M11.399,17.533c0.264,-0.274 0.559,-0.519 0.879,-0.726c0.455,1.441 1.455,2.671 2.773,3.416c-0.257,1.982 0.519,4.02 2.034,5.322l-0.002,0.001c-0.592,0.272 -1.235,0.424 -1.885,0.45l-0.009,0l-0.05,0.002l-0.018,0.001l-0.044,0l-0.018,0.001l-0.04,0l-0.015,0l-0.029,0l-0.032,0l-0.039,-0.001l-0.02,0l-0.048,-0.002l-0.009,0c-0.508,-0.018 -1.012,-0.112 -1.492,-0.281l-0.015,-0.006l-0.04,-0.014l-0.056,-0.021l-0.054,-0.021l-0.02,-0.008l-0.033,-0.013l-0.026,-0.011l-0.026,-0.011l-0.03,-0.013l-0.022,-0.009l-0.033,-0.015l-0.017,-0.007l-0.038,-0.017l-0.01,-0.005l-0.043,-0.02l-0.001,0c-0.296,-0.14 -0.578,-0.309 -0.841,-0.504l-0.004,-0.002l-0.037,-0.029l-0.01,-0.007l-0.033,-0.025l-0.014,-0.011l-0.029,-0.023l-0.017,-0.014l-0.027,-0.021l-0.021,-0.017l-0.022,-0.018l-0.026,-0.022l-0.018,-0.015l-0.043,-0.037l-0.042,-0.036l-0.013,-0.012l-0.028,-0.025l-0.016,-0.015l-0.024,-0.022l-0.017,-0.016l-0.024,-0.022l-0.017,-0.016l-0.036,-0.035l-0.022,-0.021l-0.016,-0.016l-0.023,-0.024l-0.014,-0.013l-0.025,-0.026l-0.009,-0.01c-0.042,-0.043 -0.083,-0.088 -0.124,-0.133l-0.004,-0.004l-0.03,-0.034l-0.003,-0.003c-0.042,-0.048 -0.083,-0.096 -0.123,-0.145l-0.002,-0.003l-0.028,-0.035l-0.004,-0.005l-0.028,-0.035l-0.001,-0.002c-0.027,-0.035 -0.055,-0.071 -0.081,-0.107l-0.008,-0.011l-0.021,-0.029l-0.012,-0.016l-0.019,-0.026l-0.013,-0.019l-0.017,-0.025l-0.025,-0.037l-0.004,-0.005l-0.011,-0.017l-0.02,-0.029l-0.012,-0.019l-0.019,-0.028l-0.011,-0.018l-0.02,-0.032l-0.01,-0.015l-0.029,-0.047c0,0 -0.027,-0.046 -0.027,-0.046l-0.009,-0.014l-0.019,-0.034l-0.009,-0.015l-0.025,-0.044l-0.01,-0.017l-0.015,-0.028l-0.012,-0.023l-0.012,-0.023l-0.013,-0.023l-0.014,-0.027l-0.006,-0.012l-0.016,-0.031l-0.007,-0.014l-0.016,-0.033l0,0c-0.02,-0.039 -0.038,-0.078 -0.057,-0.118l-0.001,-0.002c-0.018,-0.039 -0.035,-0.078 -0.052,-0.118l0,0c-0.023,-0.053 -0.045,-0.107 -0.066,-0.16l-0.002,-0.006c-0.014,-0.037 -0.028,-0.074 -0.041,-0.111l-0.006,-0.014l-0.011,-0.032l-0.007,-0.019l-0.008,-0.026l-0.007,-0.019l-0.009,-0.028l-0.008,-0.024l-0.01,-0.031l-0.006,-0.019l-0.015,-0.05l-0.004,-0.014l-0.012,-0.04l-0.004,-0.016l-0.015,-0.052l-0.014,-0.056l-0.006,-0.023l-0.008,-0.032l-0.008,-0.031l-0.005,-0.023l-0.009,-0.038l-0.003,-0.013c-0.23,-1.032 -0.126,-2.13 0.299,-3.099l0.005,-0.01l0.016,-0.035l0.009,-0.022l0.009,-0.019l0.011,-0.023l0.009,-0.019l0.01,-0.021l0.01,-0.021l0.009,-0.018l0.011,-0.024l0.007,-0.014l0.014,-0.027l0.005,-0.009l0.017,-0.033l0,0c0.124,-0.24 0.269,-0.47 0.431,-0.687l0.002,-0.002l0.023,-0.032l0.005,-0.006l0.021,-0.028l0.007,-0.009l0.02,-0.025l0.009,-0.011l0.018,-0.023l0.011,-0.014l0.017,-0.02l0.013,-0.016l0.015,-0.018l0.014,-0.018l0.014,-0.016l0.016,-0.019l0.014,-0.016l0.016,-0.019l0.013,-0.015l0.017,-0.019l0.014,-0.015l0.015,-0.017l0.016,-0.018l0.013,-0.014l0.018,-0.02l0.011,-0.011l0.021,-0.023l0.007,-0.007l0.026,-0.027l0.001,-0.001Z' style='fill:#fff;fill-opacity:0.34902;'/><path d='M18.945,25.559l-0.03,-0.014c1.515,-1.303 2.291,-3.339 2.034,-5.321c1.318,-0.746 2.318,-1.976 2.773,-3.417c0.403,0.262 0.767,0.582 1.08,0.947l0.031,0.036l0.03,0.037l0.012,0.015l0.019,0.023l0.013,0.016l0.018,0.022l0.013,0.017l0.027,0.035l0.026,0.034c0.272,0.36 0.492,0.756 0.661,1.176c0.293,0.741 0.403,1.552 0.322,2.344l0,0.003l-0.007,0.062l-0.006,0.055l-0.003,0.019l-0.005,0.037l-0.003,0.022l-0.006,0.042l-0.001,0.01l-0.003,0.019l-0.006,0.035l-0.004,0.025l-0.005,0.031l-0.005,0.024l-0.008,0.046l-0.001,0.006l-0.003,0.012l-0.008,0.042l-0.004,0.02l-0.008,0.038l-0.004,0.017l-0.012,0.055l-0.013,0.054l-0.005,0.019l-0.009,0.036l-0.006,0.023l-0.008,0.03l-0.007,0.026l-0.007,0.025l-0.007,0.027l-0.013,0.044l-0.001,0.004l-0.012,0.041l-0.003,0.009l-0.013,0.042l-0.002,0.004c-0.079,0.251 -0.179,0.496 -0.297,0.731l-0.002,0.003l-0.021,0.042l-0.001,0.001c-0.02,0.038 -0.04,0.077 -0.061,0.115l-0.012,0.021l-0.013,0.024l-0.015,0.026l-0.012,0.021l-0.018,0.03l-0.01,0.018l-0.028,0.047l-0.029,0.047l-0.01,0.015l-0.02,0.032l-0.011,0.018l-0.019,0.028l-0.012,0.019l-0.02,0.029l-0.011,0.017l-0.004,0.005l-0.025,0.037l-0.017,0.025l-0.013,0.019l-0.019,0.026l-0.012,0.016l-0.021,0.029l-0.008,0.011c-0.026,0.036 -0.054,0.072 -0.081,0.107l-0.001,0.002l-0.028,0.035l-0.004,0.005l-0.028,0.035l-0.002,0.003c-0.04,0.049 -0.081,0.097 -0.123,0.145l-0.003,0.003l-0.03,0.034l-0.004,0.004c-0.041,0.045 -0.082,0.09 -0.124,0.133l-0.009,0.01l-0.025,0.026l-0.014,0.013l-0.023,0.024l-0.016,0.016l-0.022,0.021l-0.036,0.035l-0.017,0.016l-0.024,0.022l-0.017,0.016l-0.024,0.022l-0.016,0.015l-0.028,0.025l-0.013,0.012l-0.042,0.036l-0.043,0.037l-0.018,0.015l-0.026,0.022l-0.022,0.018l-0.021,0.017l-0.027,0.021l-0.017,0.014l-0.029,0.023l-0.014,0.011l-0.033,0.025l-0.01,0.007l-0.037,0.029l-0.004,0.002c-0.263,0.195 -0.545,0.364 -0.841,0.504l-0.001,0l-0.043,0.02l-0.01,0.005l-0.038,0.017l-0.017,0.007l-0.033,0.015l-0.022,0.009l-0.03,0.013l-0.026,0.011l-0.026,0.011l-0.033,0.013l-0.02,0.008l-0.054,0.021l-0.056,0.021l-0.04,0.014l-0.015,0.006c-0.48,0.169 -0.984,0.263 -1.492,0.281l-0.009,0l-0.048,0.002l-0.02,0l-0.039,0.001l-0.032,0l-0.029,0l-0.015,0l-0.04,0l-0.02,-0.001l-0.038,0l-0.02,-0.001l-0.04,-0.001l-0.015,-0.001l-0.051,-0.002l-0.004,0c-0.522,-0.026 -1.039,-0.133 -1.527,-0.319l-0.006,-0.002l-0.048,-0.018l-0.008,-0.003l-0.053,-0.022l-0.003,-0.001l-0.048,-0.02l-0.04,-0.017l-0.04,-0.018l-0.02,-0.008l-0.015,-0.007Z' style='fill:#fff;fill-opacity:0.803922;'/><path d='M19.988,20.663c-1.271,0.451 -2.704,0.451 -3.976,0c-0.113,1.675 0.645,3.327 1.988,4.336c1.346,-1.012 2.099,-2.66 1.988,-4.336Z' style='fill:#fff;fill-opacity:0.560784;'/><path d='M18,17.001c-0.875,0.658 -1.525,1.601 -1.817,2.658c1.116,0.494 2.515,0.436 3.635,0c-0.294,-1.055 -0.942,-2 -1.818,-2.658Z' style='fill:#fff;'/><path d='M22.817,16.342c-0.498,-0.193 -1.024,-0.305 -1.56,-0.335c-0.107,-0.005 -0.214,-0.007 -0.322,-0.007c-0.698,0.014 -1.385,0.163 -2.02,0.455c0.841,0.724 1.475,1.68 1.807,2.739c1.014,-0.661 1.772,-1.685 2.095,-2.852Z' style='fill:#fff;fill-opacity:0.8;'/><path d='M17.085,16.455c-0.671,-0.31 -1.411,-0.459 -2.15,-0.455c-0.601,0.012 -1.194,0.124 -1.753,0.342c0.325,1.165 1.081,2.192 2.096,2.851c0.333,-1.058 0.966,-2.014 1.807,-2.738Z' style='fill:#fff;fill-opacity:0.698039;'/><path d='M18,10c0.645,0.004 1.284,0.124 1.882,0.367l0.004,0.002l0.059,0.024c0,0 0.054,0.023 0.054,0.023l0.053,0.024l0.053,0.024l0.032,0.015l0.019,0.009l0.036,0.018l0.015,0.007l0.04,0.02l0.01,0.005l0.049,0.025l0.048,0.025c0.281,0.151 0.549,0.329 0.797,0.531l0.043,0.035l0.042,0.036l0.043,0.037l0.043,0.037l0.042,0.038l0.043,0.039l0.042,0.04c0,0 0.04,0.038 0.04,0.038l0.013,0.013l0.026,0.026l0.015,0.016l0.023,0.023l0.017,0.017l0.039,0.04l0.034,0.036l0.036,0.039l0.023,0.026l0.012,0.013l0.024,0.028l0.008,0.009c0.041,0.046 0.08,0.093 0.119,0.14l0.034,0.042c0.04,0.05 0.079,0.101 0.117,0.153l0.031,0.043l0.027,0.037c0.026,0.038 0.052,0.075 0.077,0.114l0.007,0.009l0.02,0.031l0.01,0.015l0.018,0.029l0.029,0.045l0.026,0.043l0.029,0.047l0.011,0.02l0.017,0.029l0.011,0.019l0.019,0.032l0.008,0.016l0.027,0.049l0.026,0.047l0.007,0.015l0.018,0.034l0.008,0.016l0.023,0.045l0.023,0.046l0.012,0.025l0.022,0.046l0.018,0.041l0.02,0.045c0.065,0.145 0.122,0.293 0.172,0.444l0.002,0.003c0.012,0.039 0.025,0.077 0.036,0.116l0.004,0.013l0.01,0.033l0.014,0.046l0.013,0.048l0.006,0.025l0.009,0.031l0.005,0.02l0.012,0.05l0.004,0.015l0.01,0.04l0.003,0.016l0.012,0.054l0.012,0.054l0.003,0.017l0.008,0.039l0.003,0.017l0.01,0.049l0.004,0.026l0.004,0.025l0.006,0.032l0.001,0.011c0.061,0.375 0.078,0.757 0.052,1.136c-0.633,-0.222 -1.247,-0.325 -1.911,-0.338c-0.077,0 -0.154,0 -0.231,0.002c-0.993,0.031 -1.983,0.302 -2.846,0.802c-0.885,-0.513 -1.904,-0.784 -2.923,-0.804c-0.077,0 -0.154,0 -0.231,0.002c-0.639,0.02 -1.227,0.123 -1.834,0.336c-0.051,-0.764 0.073,-1.538 0.366,-2.248l0.007,-0.016l0.011,-0.025l0,-0.001l0.018,-0.042l0.007,-0.015l0.021,-0.048l0.023,-0.049l0.007,-0.015l0.017,-0.036l0.007,-0.016l0.022,-0.045l0.002,-0.002l0.004,-0.01l0.019,-0.037l0.011,-0.021l0.014,-0.027l0.012,-0.022l0.014,-0.026l0.009,-0.018l0.013,-0.024l0.011,-0.019l0.016,-0.028l0.009,-0.016l0.017,-0.031l0.003,-0.004l0.02,-0.035l0.021,-0.034l0.003,-0.006l0.02,-0.034l0.006,-0.008c0.022,-0.037 0.045,-0.073 0.068,-0.108l0.002,-0.003l0.022,-0.033l0.006,-0.008c0.022,-0.034 0.045,-0.068 0.069,-0.101l0.006,-0.009l0.02,-0.028l0.01,-0.014l0.02,-0.028l0.01,-0.014l0.018,-0.024l0.015,-0.02l0.016,-0.02l0.016,-0.021l0.017,-0.023l0.015,-0.019l0.027,-0.033l0.005,-0.007l0.007,-0.008l0.027,-0.033l0.012,-0.014l0.024,-0.029l0.011,-0.013l0.035,-0.041l0.041,-0.047l0.011,-0.012l0.031,-0.035l0.011,-0.012l0.032,-0.035l0.009,-0.01l0.035,-0.036l0.007,-0.007l0.038,-0.04l0.004,-0.004l0.043,-0.042l0,-0.001c0.318,-0.314 0.676,-0.585 1.065,-0.805l0.004,-0.002l0.049,-0.027l0.008,-0.005l0.045,-0.024l0.011,-0.006l0.043,-0.022l0.014,-0.008l0.041,-0.021l0.015,-0.007l0.056,-0.028c0,0 0.048,-0.022 0.048,-0.022l0.011,-0.005l0.04,-0.019l0.023,-0.01l0.004,-0.002c0.623,-0.279 1.295,-0.422 1.976,-0.435l0.065,0Z' style='fill:#fff;fill-opacity:0.603922;'/></g>";

var GM_RGB_ENABLED_KEY = "ytp-rgb-button-enabled";

var YTP_BUTTON_CLASS = "ytp-button";
var YTP_RGB_BUTTON_CLASS = "ytp-rgb-button";

var YTP_RGB_BODY_CLASS = "ytp-rgb-stretcher";

var YTP_MUTATION_OBSERVER_CLASS = "ytp-iv-video-content";

var bodyObserver, videoObserver;
var TIMEOUT_DELAY = 1500;
var timeoutID = 0;

var hasStarted = false;

function appendRawHTML(el, str) {
	var div = document.createElement('div');
	div.innerHTML = str;
	while (div.children.length > 0) {
		el.appendChild(div.children[0]);
	}
}

function doStuff() {
	// <button class="ytp-subtitles-button ytp-button" aria-pressed="false" style="" title="Subtitles/closed captions"></button>
	console.log("doing stuff");

	// Apply effect and styling depending on stored value
	var buttonEnabled = GM_getValue(GM_RGB_ENABLED_KEY, false);

	// Create player button element and add standard button classes
	var buttonElement = document.createElement("button");
	buttonElement.classList.add(YTP_BUTTON_CLASS, YTP_RGB_BUTTON_CLASS);
	buttonElement.title = "Stretch RGB levels";
	buttonElement.innerHTML = SVG_PREFIX + SVG_CIRCLES_ICON + SVG_SUFFIX;

	buttonElement.setAttribute("aria-pressed", buttonEnabled);

	console.log("button enabled: " + buttonEnabled);

	document.body.classList.toggle(YTP_RGB_BODY_CLASS, buttonEnabled);

	buttonElement.addEventListener("click", function(e) {
		var isCurrentlyPressed = this.getAttribute("aria-pressed") == "true";
		var newPressedStatus = !isCurrentlyPressed;

		this.setAttribute("aria-pressed", newPressedStatus);

		document.body.classList.toggle(YTP_RGB_BODY_CLASS, newPressedStatus);

		GM_setValue(GM_RGB_ENABLED_KEY, newPressedStatus);
	});

	var rightControls = document.getElementsByClassName("ytp-right-controls")[0];
	if (typeof rightControls === "undefined") {
		console.log("Couldn't find video controls.");
		return;
	}

	// If rightControls has zero children, something went wrong, abort
	var firstRightControl = rightControls.firstChild;
	if (rightControls.children.length == 0) {
		console.log("Can't place the new button.");
		return;
	}

	// Check if the button has already been placed and abort if so
	if (rightControls.getElementsByClassName(YTP_RGB_BUTTON_CLASS).length > 0) {
		console.log("The button is already there.");
		return;
	}

	appendRawHTML(document.body, SVG_FILTER);

	rightControls.insertBefore(buttonElement, firstRightControl);
}

function addVideoObserver() {
	var target = document.getElementsByClassName("html5-video-player")[0];
	if (typeof target === "undefined") {
		console.log("Can't find the video element.");
		return;
	}

	videoObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(m) {
			if (m.addedNodes.length > 0 && m.addedNodes[0].className == YTP_MUTATION_OBSERVER_CLASS) {
				console.log("Video/site change detected!");
				clearTimeout(timeoutID);
				timeoutID = setTimeout(doStuff, TIMEOUT_DELAY);
			}
		});
	});

	var videoConfig = { childList: true };
	videoObserver.observe(target, videoConfig);
	console.log("observer active");

	doStuff();
}

(function() {
	"use strict";

	bodyObserver = new MutationObserver(function(mutations) {
		var ytdAppElements = document.getElementsByTagName("ytd-app");
		if (ytdAppElements.length > 0) {
			console.log("Video page detected, attempting to do stuff.");
			addVideoObserver();
		} else {
			console.log("This is not a video page.");
		}
	});

	var bodyConfig = { attributes: true };
	bodyObserver.observe(document.body, bodyConfig);

	// doStuff();
})();