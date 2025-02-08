"use strict";
const fetchData = async () => {
    console.log("WEWLAD!");
    try {
        const data = await window.electronAPI.requestData();
        console.log("Data received WEW:", data);
    }
    catch (error) {
        console.error("Error fetching data:", error);
    }
};
// fetchData();
// src/renderer/scripts/main.ts
const button = document.getElementById('fetchDataButton');
if (button) {
    button.addEventListener('click', fetchData);
}
else {
    console.log("Button not found"); // This will log if the button ID doesn't match
}
