## How to run

1. Clone this repository
```bash
git clone https://github.com/Celusgo/my-wallet-backend
```
2. Clone the front-end repository at https://github.com/Celusgo/my-wallet-frontend
3. Follow instructions to run front-end at https://github.com/Celusgo/my-wallet-frontend
4. Create a Database using the ``dump.sql`` file inside the ``database`` folder by following theses steps:

    - 4.1 Open your terminal. **Important: the terminal must be opened in the same path as the ``dump.sql`` file is located.**.

    - 4.2 Access PostgreSQL using the command ``sudo su postgres`` and enter your password when prompted.

    - 4.3 Next, type ``psql postgres`` and hit enter.

    - 4.4 Create a table by typing ``CREATE DATABASE mywallet;`` and hitting enter.

    - 4.5 Type ``\q`` and hit enter.

    - 4.6 Finally, type ```psql mywallet < dump.sql``` and hit enter. Your database should be ready after this step.

5. Go back to the root folder and install the dependencies
```bash
npm i
```
6. Also in the root folder, run the back-end with
```bash
node src/server.js
```
7. Your server should be running now.