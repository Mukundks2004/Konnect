import '../styles/styles.css';
import { createSketch } from './translatedForceTest';

const other = ace.edit("textEditor");

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