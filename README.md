# MERN-Project 
> This project is under active development. Below mentioned features are the end goal.

## Quick Start

``` bash
# start mongodb as a service
sudo service mongod start

# Install server dependencies
cd server && npm i

# Serve on localhost:4000 with nodemon
cd server && npm start

# Install client dependencies
cd client && npm i

# Serve on localhost:3000
cd client && npm start
```

### Main Features:  
Application has 3 features listed below:
1. Buzz
2. Complaints
3. Resolve
4. User's Buzz
5. Requests  

  Email notification for important events are sent to the users email.

### Buzz: 
User can create two categories of buzz
1. Activity buzz
2. Lost and found buzz  
  Buzz can also include image(s).  
  User can delete or edit posts he created.  
  User can like/dislike a post.  
  User can comment or reply to a comment on a post.  

### Complaints : 
User can lock 3 types of complaints
1. Hardware 
2. Infrastructure
3. Others  

  Complaints are automatically assigned to either an employee of respective department/team or to the admin.  
  Complaint details can be viewed.

### Resolve (Admin view only) :
Admin can change the status of complaints either as in progress or resolved.

### Requests (Admin view only):
Admin can view, reject or approve requests for profile update.

### User Role: 
This application has two type of role:
1. TTND employee role 
2. Admin role 

  User can apply for a profile update.  
  Users are able to search for profiles.  
  Users can follow or befriend other users.   
  Users can chat with one another.  
  Users can view the list of people they are following, are friends with or are followers   of.  