// Switch to Register form
function switchToRegister() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
}

// Switch to Login form
function switchToLogin() {
  document.getElementById("register-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
}

// Register a new user
function registerUser() {
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;

  if (username === "" || password === "") {
    document.getElementById("register-error").innerText = "Please fill in both fields.";
    return;
  }

  // Check if username already exists
  const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
  if (existingUsers.some(user => user.username === username)) {
    document.getElementById("register-error").innerText = "Username already taken.";
    return;
  }

  // Store the new user in localStorage
  existingUsers.push({ username, password });
  localStorage.setItem("users", JSON.stringify(existingUsers));
  document.getElementById("register-error").innerText = "";
  alert("Registration successful! You can now log in.");
  switchToLogin();
}

// Login an existing user
function loginUser() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  if (username === "" || password === "") {
    document.getElementById("login-error").innerText = "Please fill in both fields.";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    document.getElementById("login-error").innerText = "";
    alert("Login successful!");
    localStorage.setItem("currentUser", username);  // Store logged-in user
    window.location.href = "dashboard.html";  // Redirect to dashboard
  } else {
    document.getElementById("login-error").innerText = "Invalid username or password.";
  }
}

// Check if user is logged in on page load
function checkLoginStatus() {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    document.getElementById("login-register").style.display = "none";
    document.getElementById("welcome-message").innerText = `Welcome, ${currentUser}`;
  }
}

// Display username on the dashboard
function showDashboardContent() {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    document.getElementById("username").innerText = currentUser;
  } else {
    window.location.href = "index.html";  // Redirect to login if not logged in
  }
}

// Logout user
function logoutUser() {
  localStorage.removeItem("currentUser");
  alert("You have been logged out.");
  window.location.href = "index.html";  // Redirect to homepage
}

// Call functions when the page loads
window.onload = function() {
  if (document.body.id === "login-register") {
    checkLoginStatus();
  }
  if (document.body.id === "dashboard-content") {
    showDashboardContent();
  }
};

// Handle contact form submission
document.getElementById("contact-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("contact-name").value;
  const email = document.getElementById("contact-email").value;
  const message = document.getElementById("contact-message").value;

  if (!name || !email || !message) {
    document.getElementById("contact-status").textContent = "All fields are required.";
    return;
  }

  // Store the contact message in localStorage
  const contactMessages = JSON.parse(localStorage.getItem("contactMessages")) || [];
  contactMessages.push({ name, email, message });
  localStorage.setItem("contactMessages", JSON.stringify(contactMessages));

  document.getElementById("contact-status").textContent = "Your message has been sent!";
  document.getElementById("contact-form").reset();
});

// Fetch the list of contact messages for the admin
function fetchContactMessages() {
  const contactMessages = JSON.parse(localStorage.getItem("contactMessages")) || [];
  const messagesList = document.getElementById("contact-messages-list");
  
  // Clear current messages
  messagesList.innerHTML = "";

  // Add messages to the table
  contactMessages.forEach((message, index) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = message.name;

    const emailCell = document.createElement("td");
    emailCell.textContent = message.email;

    const messageCell = document.createElement("td");
    messageCell.textContent = message.message;

    row.appendChild(nameCell);
    row.appendChild(emailCell);
    row.appendChild(messageCell);
    messagesList.appendChild(row);
  });
}

// On page load, check if the user is an admin and display the messages
window.onload = function() {
  const currentAdmin = localStorage.getItem("currentAdmin");
  if (!currentAdmin) {
    window.location.href = "index.html";  // If no admin logged in, redirect to login
  } else {
    fetchUsersForAdmin();  // Fetch and display users in the admin panel
    fetchContactMessages();  // Fetch and display contact messages
  }
};

