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
