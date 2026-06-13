# Setting Up Email for the Quote Form

The quote form uses **EmailJS** (free — 200 emails/month, no server needed).

## Steps (takes ~10 minutes)

### 1. Create a free EmailJS account
Go to: https://www.emailjs.com — sign up free.

### 2. Add an Email Service
- In your dashboard, click **Email Services → Add New Service**
- Choose **Gmail** and connect your Gmail account (silvacameron62@gmail.com)
- Copy the **Service ID** (looks like `service_xxxxxxx`)

### 3. Create an Email Template
- Click **Email Templates → Create New Template**
- Set **To Email**: silvacameron62@gmail.com
- Use this template body:

```
New quote request from your website!

Name: {{from_name}}
Phone: {{from_phone}}
Email: {{from_email}}
Address: {{address}}
Service Needed: {{service}}

Message:
{{message}}
```

- Set **Reply-To**: `{{reply_to}}`
- Save and copy the **Template ID** (looks like `template_xxxxxxx`)

### 4. Get your Public Key
- Go to **Account → General**
- Copy your **Public Key**

### 5. Paste the IDs into script.js
Open `script.js` and find these 3 lines near the top of the form section:

```javascript
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
```

Replace each value with your real IDs.

---

## Until EmailJS is configured
The form still works! Clicking submit will open your email app (mailto fallback) 
pre-filled with the customer's info. You can send from there.

