## Full Stack Project: MySQL, Node.js, React

### Mission Overview
In this project, you are tasked with building a vacation tagging system.

### System Roles
1. **User**
   - Can view vacations, tag (Follow), untag (Unfollow), and more.
2. **Admin**
   - Can add, edit, delete vacations, and view reports.

### Infrastructure
1. **Database**: MySQL
2. **Server-Side**: Node.js REST API using Express
3. **Server-Side Language**:  TypeScript
4. **Client-Side**: React (TypeScript)
5. **Client-Side Language**: TypeScript

### Project Details

#### Entities
1. **Users**
   - User ID (Primary Key)
   - First Name
   - Last Name
   - Email
   - Password
   - Role (Regular User or Admin)

2. **Vacations**
   - Vacation ID (Primary Key)
   - Destination
   - Description
   - Start Date
   - End Date
   - Price
   - Image Filename

3. **Followers (Which user follows which vacation)**
   - User ID (Foreign Key to Users)
   - Vacation ID (Foreign Key to Vacations)

#### Notes
- The database should include at least 12 vacations with real data.

### New Screens

1. **User Registration Page**:
   - All fields are required.
   - Email validation is required.
   - Password must be at least 4 characters long.
   - Ensure the email is unique; users cannot register with an already taken email.
   - Upon successful registration, redirect to the vacations page.

2. **Login Page for Registered Users**:
   - All fields are required.
   - Ensure the email is valid.
   - Password must be at least 4 characters long.
   - For incorrect login details, display an appropriate error message.
   - If the details are correct, redirect to the vacations page.

3. **Vacations Page**:
   - This page is accessible only to registered users.
   - Users attempting to access this page without being logged in should be redirected to the login page.
   - Vacations should be displayed in English.
   - Each card should show all vacation details, the number of followers, and whether the current user is following it.
   - Vacations should be sorted by start date in ascending order.
   - Users can follow or unfollow a vacation.
   - Display no more than 10 vacations per page and implement pagination.
   - Add a button or checkbox to filter and display only the vacations the user is following.
   - Add a button or checkbox to filter and display only vacations that haven’t started yet.
   - Add a button or checkbox to filter and display only active vacations (those that haven’t ended and have started).

4. **Admin Page**:
   - This page is accessible only to the admin.
   - The admin cannot perform Follow or Unfollow actions, and these options should not be displayed on the card.
   - At the top of the page, display a button to add a new vacation.
   - Each card should display buttons for editing and deleting the current vacation.
   - If the admin attempts to delete a vacation, confirm the action before proceeding with the deletion.

5. **Add Vacation Page**:
   - This page is accessible only to the admin.
   - All fields are required.
   - Do not allow negative prices or prices higher than $10,000.
   - Do not allow selecting an end date earlier than the start date.
   - Do not allow selecting past dates.
   - Images should be saved in a directory on the server, and only the file name (including the extension) should be saved in the database.

6. **Edit Vacation Page**:
   - This page is accessible only to the admin.
   - All fields are required except for the image field, which should be displayed and allow change but not be mandatory.
   - Do not allow negative prices or prices higher than $10,000.
   - Do not allow selecting an end date earlier than the start date.
   - Allow selecting past dates since the admin might need to edit vacations that have already ended.

7. **Vacations Report Page**:
   - This page is accessible only to the admin.
   - Display a report of vacations and follower counts on this page.
   - Use any reporting library you prefer.
   - The X-axis should display the vacation destination.
   - The Y-axis should display the number of followers per vacation.
   - Provide an option to generate and download a CSV file containing the vacation destinations and follower counts.
   - The CSV file format should follow this structure:
   ```plaintext
   Destination, Followers
   Puerto Rico Island, 4
   Las Vegas, 1
   Rhodes, 1
   Corfu, 5
   Rome, 3
   Honolulu, 2
   Kailua-Kona, 4
   Hilo, 7
   Montego Bay, 1
   Port Antonio, 3

8. **Excel CSV File**:
   - This option is available only to the admin.
   - The CSV file can be opened with Excel to display the vacation followers in a tabular format.

9. **Main Menu**:
   - Display a main menu depending on the user's role:
     - Unregistered users can only register or log in.
     - Registered users can view the vacations page, follow/unfollow vacations, filter, or log out.
     - Admins can add/edit/delete vacations, view the reports page, download the CSV file, or log out.
   - Display the full name of the logged-in user (including admins).
   - Add Unit Testing and Integration Testing.
