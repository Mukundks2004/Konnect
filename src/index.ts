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