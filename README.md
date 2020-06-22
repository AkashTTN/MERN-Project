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
Application will have 3 features listed below:
1. Buzz
2. Complaints
3. Resolve

### Buzz: 
User can create two categories of buzz
1. Activity buzz
2. Lost and found buzz
Buzz can also include images as of now.

### Complaints : 
User can lock 3 types of complaints
1. Hardware 
2. Infrastructure
3. Others

### Resolve (Admin view only) :
 Admin can change the status of complaints either as in progress or resolved, along with estimated time.

### User Role: 
This application has two type of role:
1. TTND employee role 
2. Admin role 
