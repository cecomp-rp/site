# Cecomp's site


## Try it yourself
<https://luvas.io/>


## Setup


#### | Requirements


##### **External:**
>- NodeJS: https://nodejs.org/en/ (LTS version)
>- Git:    https://git-scm.com/downloads *(of course...)*
>- MongoDB: https://www.mongodb.com/download-center/community

>*Note: Don't forget to add to PATH during installation. Also, install NPM.*

*Test it:*
~~~
npm -v
node -v
git --version
~~~


##### **Global NPM modules:**
~~~
npm i nodemon -g
npm i env-cmd -g
npm i @angular/cli -g
~~~
>*Note: Use SUDO in linux.*



#### | Installation

##### **Copy repository:**
~~~
git clone https://github.com/cecomp-rp/site
~~~

>*Note: Run all commands from the created folder 'cecomp-site' where package.json is located, not 'src'.*

##### **Install dependencies:**
~~~
npm i
~~~

##### **Frontend:**

In any case:
>1. Create a folder called 'static'.
>2. Add your frontend files.

>*Note: Optmized for Angular and root file is "index.html".*

To clone the frontend from the repository https://github.com/cecomp-rp/site-front:
~~~
npm run build-front-win
~~~
Or, if you are using Linux:
~~~
npm run build-front-linux
~~~

#### | Configuration

##### **SSL config:**

In order to run in **localhost**:
>1. Create a folder called 'ssl'.
>2. Add 'cert.pem' and 'privkey.pem'.

>*Note: The certificates don't need to be valid, just readable.*

In order to run in **production**:
>1. The folder with 'cert.pem' and 'privkey.pem' need to be set as an environment variable SSLDIR.



##### **Environment variables:**

For **localhost**:
>1. Create a folder called 'config'.
>2. Create a file called 'dev.env' inside 'config'.
>3. Add the following variables:

>- PORT_HTTPS=443
>- PORT_HTTP=80
>- DATABASE_URL=

>*Note: Default values included.*


For **production**:
>1. Create a folder called 'config'.
>2. Create a file called 'prod.env' inside 'config'.
>3. Add the following variables:

>- PORT_HTTPS=443
>- PORT_HTTP=80
>- SSLDIR=/etc/letsencrypt/live/your_certbot_url
>- DATABASE_URL=

>*Note: Default values included.*

For **production (alternative)**:
>1. Set your variables in the environment :).



#### | Run

For **localhost**:
~~~
npm run dev
~~~

For **production**:
~~~
npm run prod
~~~

For **production (alternative)**:
~~~
npm start
~~~

>*Note: Use SUDO in linux.*


## Database

**User**
name: String
nick: String
email: String //Required
access_level: Number
googleId: String
profilePic: String
tokens: [
- token: String //Required
- machine: String
- os: String
- ip: String

]

**News**
title: String //Required
subtitle: String 
content: String //Required
author_id: String //Required

**ContactForm**
subject: String //Required
content: String //Required
form_class: String //Required
user_id: String
seen: Boolean

**Poll**
title: String //Required
content: String //Required
start_date: Date //Required
end_date: Date //Required
options: [
- desc: String
- img: String
- votes: Number

]

**PollVote**
user_id: String //Required
poll_id: String //Required

**Certificate**
user_email: String //Required
content: String //Required

**Transparency**
title: String //Required
desc: String
value: Decimal128 
date: Date

>- All of them have "created_at" and "updated_at" fields, by default.
>- **Images** encoded in base64.
>- **Dates** in UNIX format.


## Auth system

**Access levels:**
- none: Not logged
- 0: Logged but not verified (default)
- 1: Verified BCC member
- 10: Admin

>- 0: Any non- usp.br email **OR** any usp.br email that is not verified to be a BCC member.
>- 1: Usp.br email that is verified to be a BCC member.


## Site Structure

#### | Pages

**/**
Index page.
No login required.

**/about**
About us page.
No login required.

**/store**
Store page.
No login required.

**/contact**
Contact page.
No login required.

**/calendar**
Calendar page.
No login required.

**/cerficates**
Certificates page.
Login (access level 0) required.

**/transparency**
Transparency page.
Login (access level 1) required.

**/polls**
Polls page.
Login (access level 1) required.

**/console**
Console page.
Login (access level 10) required.

#### | Folders and files

**/static**
Folder with all frontend files (compiled Angular project).
https://github.com/cecomp-rp/site-front

**/ssl**
Folder with SSL certificates ("cert.pem" and "privkey.pem").

**/config**
Folder with environment variables files ("dev.env" and "prod.env").

**/apps**
Folder with all apps supported.

> **/apps/xuxulo**
> 

**/src**
Folder with all source code.

> **/src/app.js**
> Main file.

> **/src/database**
> Folder with all database models.
>
> > **database.js**
> > Database connection.
> >
> > **models**
> > Folder with all database models.
> >
> > > - **User.js**
> > > - **News.js**
> > > - **ContactForm.js**
> > > - **Poll.js**
> > > - **PollVote.js**
> > > - **Certificate.js**
> > > - **Transparency.js**

> **/src/routing**
> Folder with all routers.
>
> > **routers.js**
> > Where you reference all the other router files.
> >
> > **routers**
> > Folder with all routers.
> >
> > > - **auth.js**
> > > - **certificates.js**
> > > - **contactForm.js**
> > > - **news.js**
> > > - **polls.js**
> > > - **transparency.js**



## Endpoints

#### | News

**Get all news:**
GET /api/news/ ?page=
input: none
output: Array of news [title, subtitle, content, author_nick, created_at, updated_at]
access level: none

**Get news by id:**
GET /api/news/:id
input: none
output: News [title, subtitle, content, author_nick, created_at, updated_at]
access level: none

**Create news:**
POST /api/news
input: News [title, subtitle, content]
output: none
access level: 10

**Update news by id:**
PATCH /api/news/:id
input: News [title, subtitle, content]
output: none
access level: 10

**Delete news by id:**
DELETE /api/news/:id
input: none
output: none
access level: 10

#### | Contact Form

**Get all contact forms**
GET /api/contact/ ?page= ?seen= 
input: none
output: Array of ContactForm [subject, content, form_class, user_email /if exists/, created_at, updated_at]
access level: 10

**Get contact form by id**
GET /api/contact/:id
input: none
output: ContactForm [subject, content, form_class, user_email /if exists/, created_at, updated_at]
access level: 10

**Create contact form**
POST /api/contact
input: ContactForm [subject, content, form_class]
output: none
access level: none

**Delete contact form by id**
DELETE /api/contact/:id
input: none
output: none
access level: 10

> Note: content in forms will be different for each form_class.

#### | Polls

**Get all polls**
GET /api/polls/ ?page= ?active=
input: none
output: Array of Poll [title, content, start_date, end_date, created_at, updated_at]
access level: 1

**Get poll by id**
GET /api/polls/:id
input: none
output: Poll [title, content, start_date, end_date, created_at, updated_at]
access level: 1

**Create poll**
POST /api/polls
input: Poll [title, content, start_date, end_date, options]
output: none
access level: 10

**Update poll by id**
PATCH /api/polls/:id
input: Poll [title, content, start_date, end_date, options]
output: none
access level: 10

**Delete poll by id**
DELETE /api/polls/:id
input: none
output: none
access level: 10

**Vote in poll**
POST /api/polls/vote/:id
input: option_number
output: none
access level: 1

**Unvote in poll**
DELETE /api/polls/vote/:id
input: none
output: none
access level: 1

>- If polls date is over, you can't vote and "votes" for each option will be returned.

#### | Certificates

**Get certificates by id**
GET /api/certificates/id/:id
input: none
output: Certificate [content, certificate_id, created_at, updated_at]
access level: 0

**Get certificates by user email**
GET /api/certificates/email/:email ?page=
input: none
output: Array of Certificate [content, certificate_id, created_at, updated_at]
access level: (0 & (1 if email is the same as the logged user)) OR 10

**Create certificate**
POST /api/certificates
input: Certificate [user_email, content]
output: none
access level: 10

**Delete certificate by id**
DELETE /api/certificates/:id
input: none
output: none
access level: 10

#### | Transparency

**Get all transparency items**
GET /api/transparency/ ?page=
input: none
output: Array of Transparency [title, desc, value, created_at, updated_at, date, item_id]
access level: 1

**Get transparency summary**
GET /api/transparency/summary
input: none
output: [cash_total]

**Create transparency item**
POST /api/transparency/
input: Transparency [title, desc, value, date]
output: none
access level: 10

**Delete transparency item**
DELETE /api/transparency/:id
input: none
output: none
access level: 10


#### | Auth





>- Use **JSON**!!!
>- If json response has "error", it means that something went wrong.

>- Page is from 0 to n (each one has 10 items).

>- TODO
>- User endpoints
>- Add api limits to input (in db doc and endpoint doc)
>- Definir as form_classes
