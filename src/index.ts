import '../styles/styles.css';
import { createSketch } from './sketch';

const editor = ace.edit("textEditor");
editor.setReadOnly(true);

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