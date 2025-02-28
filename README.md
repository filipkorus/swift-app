## Starting application in Docker
```shell
docker compose up
```
To force rebuild the image add the `--build` flag at the end of the command.

## Run tests in Docker
```shell
docker compose -f docker-compose.test.yml up --abort-on-container-exit
```
To force rebuild the image add the `--build` flag at the end of the command.

## Run tests with coverage in Docker
```shell
docker compose -f docker-compose.test.yml -f docker-compose.test-coverage.yml up --abort-on-container-exit
```
To force rebuild the image add the `--build` flag at the end of the command.

## Running application in development mode locally
**NOTE**: You must have Node.js installed. Moreover, PostgreSQL should be running on your machine.

1. Start the postgres database on your machine.
   - You can use Docker:
     ```shell
     docker run -d \
      -e POSTGRES_USER=admin \
      -e POSTGRES_PASSWORD=super_secret_password \
      -e POSTGRES_DB=prisma \
      -p 5432:5432 \
      -v ./pgdata:/var/lib/postgresql/data \
      postgres
     ```
2. Fill the [backend/.env.dev](backend/.env.dev) file with the correct values, including the database URL. **NOTE**: If you are using Docker command from previous step, you can skip this step.
3. Run the following commands:
    ```shell
    cd backend
    npm install
    npm run prisma:generate
    npm run prisma:migrate
    npm run start:dev
    ```
4. Server will start listening on [localhost:8080](http://localhost:8080).
5. To run tests, stop the server and use the following command:
    ```shell
    npm run test
    ```
6. To run tests with coverage, use the following command:
    ```shell
    npm run test:coverage
    ```
