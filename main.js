// main.js

document.addEventListener("DOMContentLoaded", function() {
  const startButton = document.getElementById("startButton");
  startButton.addEventListener("click", openStartMenu);
});

function openStartMenu() {
  // Create a simple menu overlay
  const menu = document.createElement("div");
  menu.id = "startMenu";
  menu.style.position = "absolute";
  menu.style.bottom = "50px";
  menu.style.left = "10px";
  menu.style.background = "#fff";
  menu.style.border = "1px solid #ccc";
  menu.style.padding = "10px";
  menu.style.borderRadius = "4px";
  menu.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.3)";
  
  // Option: Open Web Browser
  const webBrowserBtn = document.createElement("button");
  webBrowserBtn.innerText = "Open Web Browser";
  webBrowserBtn.onclick = function() {
    openBrowserWindow("https://www.example.com");
    document.body.removeChild(menu);
  };
  menu.appendChild(webBrowserBtn);
  
  // Option: Run EXE file (uploads an exe and runs through emulator)
  const runExeBtn = document.createElement("button");
  runExeBtn.innerText = "Run EXE File";
  runExeBtn.style.marginLeft = "10px";
  runExeBtn.onclick = function() {
    triggerExeUpload();
    document.body.removeChild(menu);
  };
  menu.appendChild(runExeBtn);
  
  document.body.appendChild(menu);
}

function openBrowserWindow(url) {
  // Create a new window container for the web browser
  const win = document.createElement("div");
  win.className = "window";
  win.style.top = "50px";
  win.style.left = "50px";
  win.style.width = "800px";
  win.style.height = "600px";

  // Title bar with drag functionality
  const titlebar = document.createElement("div");
  titlebar.className = "titlebar";
  titlebar.innerText = "Web Browser";
  win.appendChild(titlebar);
  
  // Content area with an iframe that loads the site
  const content = document.createElement("div");
  content.className = "content";
  content.style.padding = "0";
  
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  
  content.appendChild(iframe);
  win.appendChild(content);
  
  document.getElementById("windowContainer").appendChild(win);
  makeDraggable(win, titlebar);
}

function openExeWindow(exeData) {
  // Create a new window container for the EXE emulator
  const win = document.createElement("div");
  win.className = "window";
  win.style.top = "100px";
  win.style.left = "100px";
  win.style.width = "800px";
  win.style.height = "600px";

  const titlebar = document.createElement("div");
  titlebar.className = "titlebar";
  titlebar.innerText = "EXE Runner";
  win.appendChild(titlebar);
  
  const content = document.createElement("div");
  content.className = "content";
  content.innerHTML = `<p>Loading EXE, please wait...</p>`;
  win.appendChild(content);
  
  document.getElementById("windowContainer").appendChild(win);
  makeDraggable(win, titlebar);

  // Check if the BoxedWine emulator library is loaded
  if (window.BoxedWine && typeof window.BoxedWine.runExe === "function") {
    // Call the BoxedWine emulator: pass the exeData and the content container element.
    window.BoxedWine.runExe(exeData, content, function(result) {
      // Callback after the exe has run (or if any error occurs)
      console.log("EXE execution complete or error occurred", result);
    });
  } else {
    content.innerHTML = "<p>Error: BoxedWine emulator is not available.</p>";
  }
}

function triggerExeUpload() {
  const exeInput = document.getElementById("exeInput");
  exeInput.click();
  exeInput.onchange = function(event) {
    const file = event.target.files[0];
    if (file) {
      // Read the file as ArrayBuffer to pass binary data to the emulator
      const reader = new FileReader();
      reader.onload = function(e) {
        const exeData = e.target.result;
        // Open the EXE window and integrate the emulator
        openExeWindow(exeData);
      };
      reader.readAsArrayBuffer(file);
    }
  };
}

// Simple draggable functionality
function makeDraggable(win, handle) {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  handle.addEventListener("mousedown", function(e) {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", function(e) {
    if (isDragging) {
      win.style.left = (e.clientX - offsetX) + "px";
      win.style.top = (e.clientY - offsetY) + "px";
    }
  });

  document.addEventListener("mouseup", function() {
    isDragging = false;
    document.body.style.userSelect = "auto";
  });
}
