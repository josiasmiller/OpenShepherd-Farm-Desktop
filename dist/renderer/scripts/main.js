"use strict";
// Get references to the sidebar tabs and content sections
const homeTab = document.getElementById('homeTab');
const aboutTab = document.getElementById('aboutTab');
const settingsTab = document.getElementById('settingsTab');
const contactTab = document.getElementById('contactTab');
const homeContent = document.getElementById('homeContent');
const aboutContent = document.getElementById('aboutContent');
const settingsContent = document.getElementById('settingsContent');
const contactContent = document.getElementById('contactContent');
// Function to show content and hide other sections
const showContent = (contentToShow) => {
    // Hide all content sections
    [homeContent, aboutContent, settingsContent, contactContent].forEach((content) => {
        if (content) {
            content.style.display = 'none';
        }
    });
    // Show the selected content
    if (contentToShow) {
        contentToShow.style.display = 'block';
    }
};
// Event listeners for the sidebar tabs
if (homeTab) {
    homeTab.addEventListener('click', (e) => {
        e.preventDefault();
        showContent(homeContent); // Show home page content
    });
}
if (aboutTab) {
    aboutTab.addEventListener('click', (e) => {
        e.preventDefault();
        showContent(aboutContent); // Show about page content
    });
}
if (settingsTab) {
    settingsTab.addEventListener('click', (e) => {
        e.preventDefault();
        showContent(settingsContent); // Show settings page content
    });
}
if (contactTab) {
    contactTab.addEventListener('click', (e) => {
        e.preventDefault();
        showContent(contactContent); // Show contact page content
    });
}
// Optional: Show home content by default when the app starts
showContent(homeContent);
const fetchData = async () => {
    console.log("DATA BEING FETCHED!!");
    try {
        const data = await window.electronAPI.requestData();
        console.log("Data received:", data);
    }
    catch (error) {
        console.error("Error fetching data:", error);
    }
};
const button = document.getElementById('fetchDataButton');
if (button) {
    button.addEventListener('click', fetchData);
}
else {
    console.log("Button not found"); // This will log if the button ID doesn't match
}
