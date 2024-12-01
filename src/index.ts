import '../styles/styles.css';
import { createSketch } from './sketch';

const editor = ace.edit("textEditor");
editor.setReadOnly(true);

function downloadText() {
	var content = editor.getValue();
	
	var blob = new Blob([content], { type: "text/plain" });
	var link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = "myGraphData_" + Date.now() + ".txt";
	
	link.click();
	
	URL.revokeObjectURL(link.href);
}

const pathElement: SVGPathElement = <SVGPathElement>(<unknown>document.getElementById('iconPath'));

const inputElement: HTMLInputElement | null = <HTMLInputElement>document.getElementById('colourSelector');
if (inputElement !== null) {
	inputElement.addEventListener('input', function() {
		const event: CustomEvent = new CustomEvent<string>('colourChanged', { detail: inputElement.value });
		if (pathElement !== null) {
			pathElement.setAttribute('fill', inputElement.value);
		}
        window.dispatchEvent(event);
	});
}

window.addEventListener('textUpdated', function(event: Event) {
	const customEvent: CustomEvent<string> = event as CustomEvent<string>;
	editor.setValue(customEvent.detail);
	editor.getSession().selection.clearSelection();
});

window.addEventListener('sendGraphAttributes', function(event: Event) {
	const customEvent: CustomEvent<Map<string, string>> = event as CustomEvent<Map<string, string>>;
	const cyclicDiv = document.getElementById("cyclicValue");
	const connectedDiv = document.getElementById("connectedValue");
	const completeDiv = document.getElementById("completeValue");
	const planarDiv = document.getElementById("planarValue");
	const treeDiv = document.getElementById("treeValue");
	const forestDiv = document.getElementById("forestValue");
	const nodeCountDiv = document.getElementById("totalNodesValue");
	const edgeCountDiv = document.getElementById("totalEdgesValue");

	if (cyclicDiv) {
		const result = customEvent.detail.get("ShortestCycle");
		if (result === "-1") {
			cyclicDiv.innerHTML = "No";
		}
		else if (result) {
			cyclicDiv.innerHTML = result;
		}
	}

	if (connectedDiv) {
		const result = customEvent.detail.get("IsConnected");
		if (result) {
			connectedDiv.innerHTML = result === "true" ? "Yes" : "No";
		}
	}

	if (completeDiv) {
		const result = customEvent.detail.get("IsComplete");
		if (result) {
			completeDiv.innerHTML = result === "true" ? "Yes" : "No";
		}
	}

	if (nodeCountDiv) {
		const result = customEvent.detail.get("NodeCount");
		if (result) {
			nodeCountDiv.innerHTML = result;
		}
	}

	if (edgeCountDiv) {
		const result = customEvent.detail.get("EdgeCount");
		if (result) {
			edgeCountDiv.innerHTML = result;
		}
	}
});

const saveImageButton = document.getElementById('saveImageButton') as HTMLButtonElement;

if (saveImageButton) {
	saveImageButton.addEventListener('click', () => {
		window.dispatchEvent(new CustomEvent('saveImage'));
	});
}

const downloadTextButton = document.getElementById('saveTextButton') as HTMLButtonElement;
const clearButton = document.getElementById('clearButton') as HTMLButtonElement;
const randomButton = document.getElementById('randomButton') as HTMLButtonElement;

if (downloadTextButton) {
	downloadTextButton.addEventListener('click', () => {
		downloadText();
	});
}

if (clearButton) {
	clearButton.addEventListener('click', () => {
		window.dispatchEvent(new CustomEvent('clearGraph'));;
	});
}

if (randomButton) {
	randomButton.addEventListener('click', () => {
		window.dispatchEvent(new CustomEvent('randomGraph'));;
	});
}

const nodeSize = document.getElementById('nodeSizeElement') as HTMLInputElement;
const edgeSize = document.getElementById('edgeSizeElement') as HTMLInputElement;


if (edgeSize !== null) {
	edgeSize.onchange = function() {
		const event: CustomEvent = new CustomEvent<string>('newEdgeSize', { detail: edgeSize.value });
		window.dispatchEvent(event);
  	}
}

if (nodeSize) {
	nodeSize.onchange = function() {
		const event: CustomEvent = new CustomEvent<string>('newNodeSize', { detail: nodeSize.value });
		window.dispatchEvent(event);
	};
}

function openTab(evt: MouseEvent, tabName: string): void {
    let i: number;
    let tabcontent: HTMLCollectionOf<Element>;
    let tablinks: HTMLCollectionOf<HTMLAnchorElement>;
  
    globalThis.state = tabName;
    tabcontent = document.getElementsByClassName("tabcontent") as HTMLCollectionOf<Element>;
    
    for (i = 0; i < tabcontent.length; i++) {
      (tabcontent[i] as HTMLElement).style.display = "none";
    }
  
    tablinks = document.getElementsByClassName("tablinks") as HTMLCollectionOf<HTMLAnchorElement>;
    
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
      (selectedTab as HTMLElement).style.display = "block";
    }
  
    (evt.currentTarget as HTMLElement).className += " active";

	if (tabName === "Attributes") {
		console.log("Changing to attributes, pulling data");
		const event: CustomEvent = new CustomEvent('getGraphAttributes');
        window.dispatchEvent(event);
	}
}
  
  (window as any).openTab = openTab;

document.addEventListener("DOMContentLoaded", () => {
    const defaultTab = document.querySelector(".tablinks") as HTMLElement;
    if (defaultTab) {
        defaultTab.click();
    }
});

const sketchContainer = document.getElementById('sketchContainer');

if (sketchContainer) {
    createSketch(sketchContainer);
}