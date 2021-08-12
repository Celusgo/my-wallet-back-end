## How to run

1. Clone this repository
```bash
git clone https://github.com/Celusgo/my-wallet-backend
```
2. Clone the front-end repository at https://github.com/Celusgo/my-wallet-frontend
3. Follow instructions to run front-end at https://github.com/Celusgo/my-wallet-frontend
4. Create a Database using the ``dump.sql`` file inside the ``database`` folder by following these steps:

    - 4.1 Open your terminal. **Important: the terminal must be opened in the same path as the ``dump.sql`` file is located.**.

    - 4.2 Access PostgreSQL using the command ``sudo su postgres`` and enter your password when prompted.

    - 4.3 Next, type ``psql postgres`` and hit enter.

    - 4.4 Create a table by typing ``CREATE DATABASE mywallet;`` and hitting enter.

    - 4.5 Type ``\q`` and hit enter.

    - 4.6 Finally, type ```psql mywallet < dump.sql``` and hit enter. Your database should be ready after this step.

5. In your terminal, go back to the root folder of this project and install the dependencies
```bash
npm i
```

6. Also in the root folder, create a file named ``.env`` in the same format as the ``.env.example`` file and fill with your information. e.g.: ``DATABASE_URL=postgres://postgres:YOURPASSWORD@localhost:5432/mywallet`` (where ``YOURPASSWORD`` is your PostgreSQL password) and ``PORT=YOURPORT`` (where ``YOURPORT`` is a port of your choice, usually 4000).

7. Finally, run the back-end with
```bash
npm run dev
```
8. Your server should be running now.
<br/>
<br/>

## In case you want to run the tests

1. Make sure you have followed the ``step 4`` from the session above **as strictly as specified**.

2. You will have to create a test database (so your data from your original database is not erased when you run the tests). Follow these steps:

    - 2.1 Open your terminal.

    - 2.2 Access PostgreSQL using the command ``sudo su postgres`` and enter your password when prompted.

    - 2.3 Next, type ``psql postgres`` and hit enter.

    - 2.4 Create a table by typing ``CREATE DATABASE mywallettest template mywallet;`` and hitting enter. **This will create a new database with the same pattern your first database**.

3. Move back to the root folder of your project, create a file named ``.env.test`` in the same format as the ``.env.example`` file and fill with your information. e.g.: ``DATABASE_URL=postgres://postgres:YOURPASSWORD@localhost:5432/mywallettest`` (where ``YOURPASSWORD`` is your PostgreSQL password) and ``PORT=YOURPORT`` (where ``YOURPORT`` is a port of your choice, usually 4000).    

4. That's it! Everything should be ready. Now, to run the tests, move to the folder of your project in the terminal and use the command
```bash
npm run test
```

5. The tests will run on the terminal.



