[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT license.

# Overview:

Mern-Auth-Web is a React JS (web) application that runs on any device browser.

### Key Features:

- **Sign Up**: allows users to create a new account by providing necessary details like username, email, and password.
- **Account Activation**: involves sending an activation link containing a unique token to the provided email address.
- **Login**: allows registered users to log in to their accounts using their credentials (email and password).
- **Forgot Password**: allows users to enter their email and receive a unique reset password token or link to reset their password.

# Environment and Setup:

>**Note**: Make sure you have installed the latest version of [Git](https://git-scm.com/downloads), [Node.js](https://nodejs.org/en/download/package-manager), and [MongoDB](https://www.mongodb.com/try/download/community) before proceeding.

### 1. Clone the Repository

Download the project to your local machine (Desktop):

```bash
    $ cd Desktop
    $ git clone https://github.com/Dennis-Maigua/mern-auth-web.git
    $ exit
```

### 2. Run the Backend and Frontend

Open the project folders in 2 terminals, install their packages/dependencies, and run them seperately:

- Terminal 1 (Backend/Server):

```bash
    # using npm
    $ cd Destop/mern-auth-web/server
    $ npm i
    $ npm start

    # OR using Yarn
    $ cd Desktop/mern-auth-web/server
    $ yarn add
    $ yarn start
```

- Terminal 2 (Frontend/Client):

```bash
    # using npm
    $ cd Destop/mern-auth-web/client
    $ npm i
    $ npm start

    # OR using Yarn
    $ cd Desktop/mern-auth-web/client
    $ yarn add
    $ yarn start
```

### 3. (Optional) Update the Packages/Dependencies

If you want to keep all packages and dependencies up-to-date, run on both terminals:

```bash
    # using npm
    $ npm i -g npm-check-updates
    $ ncu -u
    $ npm install

    # OR using Yarn
    $ yarn add -g yarn-check-updates
    $ ncu -u
    $ yarn add
```

If everything is set up correctly, you should see your new app running in your Android Emulator or iOS Simulator shortly provided you have set it up correctly.

This is one way to run your app — you can also run it directly from within your Smartphone/Mobile Device, or Android Studio, and Xcode respectively.
   
# Contributing:

We welcome contributions from developers, legal experts, and technology enthusiasts. Feel free to fork the repository, make improvements, and submit pull requests.
