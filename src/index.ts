import '../styles/styles.css';
// import { createSketch } from './sketch';


import { createSketch } from './translatedForceTest';

const other = ace.edit("textEditor");

function openCity(evt: MouseEvent, cityName: string): void {
    let i: number;
    let tabcontent: HTMLCollectionOf<Element>;
    let tablinks: HTMLCollectionOf<HTMLAnchorElement>;
  
    tabcontent = document.getElementsByClassName("tabcontent") as HTMLCollectionOf<Element>;
    
    for (i = 0; i < tabcontent.length; i++) {
      (tabcontent[i] as HTMLElement).style.display = "none";
    }
  
    tablinks = document.getElementsByClassName("tablinks") as HTMLCollectionOf<HTMLAnchorElement>;
    
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    const selectedCity = document.getElementById(cityName);
    if (selectedCity) {
      (selectedCity as HTMLElement).style.display = "block";
    }
  
    (evt.currentTarget as HTMLElement).className += " active";
}
  
  (window as any).openCity = openCity;

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