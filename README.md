README.md:

````md
# Secure Web Application

## Overview

This project is a secure web application developed using Node.js with Express, SQLite, HTML, CSS, and JavaScript.

The application provides a simple user management system with the following features:

- User registration
- User login
- User dashboard
- Admin page

The project demonstrates common web security vulnerabilities and their mitigations, including:

- SQL Injection
- Weak Password Storage
- Cross-Site Scripting (XSS)
- Access Control / Role-Based Access Control (RBAC)
- Encryption and secure session cookies

The goal of this project is to apply secure coding practices and show how common web application vulnerabilities can be detected and mitigated.

---

## Steps to Run the Application

This project must be run locally because it uses a Node.js backend server, Express routes, and a SQLite database. GitHub Pages cannot run the backend server or database operations.

1. Download or clone the repository.

2. Open the project folder in the terminal. Make sure you are inside the folder that contains:

```text
server.js
package.json
database.sqlite
server.cert
server.key
````

3. Install the required dependencies:

```bash
npm install
```

4. Start the server:

```bash
node server.js
```

5. Open the application in the browser:

```text
https://localhost:3000
```

6. If the browser shows a certificate warning, click:

```text
Advanced → Proceed to localhost
```

This warning appears because the project uses a self-signed SSL certificate for local testing.

---

## Instructions to Test the Security Features

### 1. SQL Injection

The project demonstrates SQL Injection using a vulnerable login route and then mitigates it using parameterized queries.

Test input example:

```text
' OR '1'='1' --
```

Before mitigation, the vulnerable version shows how SQL Injection can affect the SQL query logic.

After mitigation, the secure version uses parameterized queries, so the same input is treated as plain text and the login attempt is rejected.

Expected result after mitigation:

```text
Invalid username or password
```

---

### 2. Weak Password Storage

The project demonstrates weak password storage using MD5, then mitigates it using bcrypt.

Before mitigation, weak hashing can produce predictable hashes.

After mitigation, passwords are stored using bcrypt.

Expected result after mitigation:

```text
Passwords are stored as bcrypt hashes, and identical passwords produce different hashes because bcrypt uses salting.
```

---

### 3. Cross-Site Scripting (XSS)

The project demonstrates XSS using user-generated input in the bio field.

Test payload example:

```html
<script>alert('XSS')</script>
```

Before mitigation, the script can execute in the browser.

After mitigation, the input is sanitized using the xss library before being displayed.

Expected result after mitigation:

```text
The malicious script is displayed as plain text and is not executed.
```

---

### 4. Access Control / RBAC

The admin page is protected using Role-Based Access Control.

Access rules:

| Role  | Dashboard Access | Admin Page Access |
| ----- | ---------------- | ----------------- |
| user  | Allowed          | Denied            |
| admin | Allowed          | Allowed           |

#### Test 1: Access admin page without login

Open:

```text
https://localhost:3000/admin.html
```

Expected result:

```text
The user is redirected to the login page.
```

#### Test 2: Access admin page as a regular user

Log in with a regular user account where:

```text
role = user
```

Then open:

```text
https://localhost:3000/admin.html
```

Expected result:

```text
Access Denied
```

#### Test 3: Access admin page as an admin

Log in with an admin account where:

```text
role = admin
```

After login, the dashboard should display the Admin Panel button.

Then click the Admin Panel button or open:

```text
https://localhost:3000/admin.html
```

Expected result:

```text
Admin Panel is displayed successfully.
```

Note: The username alone does not make a user an admin. The user must have `role = admin` in the database.

---

### 5. Encryption and Secure Sessions

The application uses HTTPS/TLS with a self-signed SSL certificate for local testing.

The session cookie is configured using security options such as:

* `httpOnly`
* `sameSite`
* `secure`

Expected result:

```text
The application runs on https://localhost:3000, and the session cookie is protected when HTTPS is used.
```

Note:

```text
The browser may display a warning because the SSL certificate is self-signed and not issued by a trusted Certificate Authority.
```

```

