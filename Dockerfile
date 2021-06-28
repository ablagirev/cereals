FROM python:3.9
ENV PYTHONUNBUFFERED=1
ENV PATH="${PATH}:/root/.local/bin"
RUN  pip install --upgrade pip
RUN apt-get clean && apt-get -q update && apt-get -y install netcat  && pip install poetry && apt-get -qy install curl && curl -sL https://deb.nodesource.com/setup_14.x | bash - &&  apt-get install -y nodejs
RUN poetry config virtualenvs.create false --local
RUN mkdir -p /app/
WORKDIR /app
COPY ./backend/poetry.lock ./backend/pyproject.toml /app/backend/
COPY ./frontend/package.json ./frontend/package-lock.json  /app/frontend/
RUN cd backend && poetry install
COPY ./ /app/
RUN mkdir -p /app/static/ && mkdir -p /app/media/ && mkdir -p /app/backend/media
#COPY ./frontend/.browserslistrc ./frontend/.env ./frontend/.eslintrc.js ./frontend/.gitignore ./frontend/.prettierrc ./frontend/babel.config.js ./frontend/package.json ./frontend/package-lock.json ./frontend/tsconfig.json ./frontend/vue.config.js /app/frontend/
#COPY ./frontend/src/  /app/frontend/src/
RUN chmod a+x ./entrypoint.sh ./wait-for
#RUN npm --prefix frontend install