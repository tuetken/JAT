Setting Up and Running the Application (Maintenance Purposes)

The following will explain what the Job Application Tracker accomplishes, as well as how to install, configure, and maintain it.

Overview:
The application runs using the following technologies:

- Database: MongoDB
- Frontend: React.js
- Backend: Node.js + Express.js
- Authentication: Firebase
- Hosting:
  o Frontend: Vercel
  o Backend: Render

Key Features:

- Secure Login
- CRUD Operations for Applications
- Reminders / Local Notifications
- CSV Report Generation
- Analytics

Installation:

1. Clone the Repo to the Local Machine.
2. Install Dependencies (run ‘npm install’ inside both client and server folders).
3. Create .env files for both client and server folders.
   - Ensure MongoDB link and port sit inside server .env like the following:
     MONGO_URI = <link>
     PORT = <port>
   - Ensure Render link sits within client .env like the following:
     VITE_API_URL = <link>
4. Deploy Locally:
   - CD server and client separately and run ‘npm run dev’ to start the server.
   - Once both are up and running, click on the localhost link from the client to access the application.
5. (Optional) Host Application:
   - On Vercel, deploy using the /client folder and use information in the .env file for environment variables.
   - On Render, deploy using /server folder… once running, click connect and copy the outbound IP addresses.
   - On MongoDB, allow incoming IP addresses from Render by pasting in the outbound addresses into your cluster.

WARNING: If you decide to host the application, and therefore have to add .env files, do NOT forget to create a
.gitignore file containing your .env files. This also applies to your Firebase Keys if you decide to set up Firebase
Authentication as well.

---

Running the Application (User’s Perspective)

The purpose of this guide is to show you how to use the Job Application Tracker.

1. Visit the following link: jobapplicationtracker-phi.vercel.app
2. If you don’t have an account, create one by clicking ‘Sign up’; otherwise, enter your credentials and click ‘Log in’.
3. Enter a valid email and password
4. This will take you to your dashboard, where you get access to multiple features:

- At the top of the screen, you can see which account you’re currently logged into.
- Underneath that, you have your summary, where it shows the total number of applications, as well as how many of each status.
- The first button is ‘Add Application’, where a new element will appear. This is where you’ll add your application. Each application
  requires you to enter the company name, the position you’re applying for, and your current status. Optionally, you can enter notes
  (up to 500 characters), set a reminder date, and a reminder message to display locally when the day arrives.

5. Once you’ve logged your first application, you’ll see it listed in the table. Underneath the application log, you’ll see three separate charts:

- Application by Status: Shows all applications according to their current status.
- Applications Over Time: Lists the total number of applications per month, according to the date of their entry.
- Success Funnel: Tracks how your applications have changed since first entering them.

6. If, for whatever reason, you want to cancel the application you’re currently working on, just click the ‘Cancel’ button in
   the upper left corner of the New Application element.
7. If you’ve already created an application and want to either edit or delete it, the buttons are found on the far right of the
   log. Once updated, don’t forget to click the ‘Update’ button.
8. Once the log gets filled, it can be challenging to track all your applications, which is why there's a search bar on the upper
   right corner of the logs. From here, you can search by company (don’t worry about case sensitivity).
9. Right beneath the ‘All Applications’ section, there’s a ‘Generate Report’ button. This will download a CSV file for all of your
   current applications in the log. The file includes company, position, current status, notes, reminder, and the date/time of your entry.
   It also includes a timestamp when the report was generated.
10. In the upper left corner of the screen, you’ll notice a button with three horizontal lines. This is the sidebar, where, once
    clicked, it displays the application name, current screen, and, at the very bottom, the ‘Log Out’ button. Although bare for the
    time being, plans for additional features are forthcoming in the near future. Clicking the ‘Log Out’ button will bring you back to the login screen.

TIP: If you’re experiencing issues with the application, it's likely that your browser does not support the Job Application Tracker.
The application was built and tested using Google Chrome; please default to that browser if you’re having issues.
