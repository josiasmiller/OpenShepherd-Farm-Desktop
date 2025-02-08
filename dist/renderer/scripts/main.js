"use strict";
const fetchData = async () => {
    try {
        const data = await window.electronAPI.requestData();
        console.log("Data received:", data);
    }
    catch (error) {
        console.error("Error fetching data:", error);
    }
};
fetchData();
