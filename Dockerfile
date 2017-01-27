FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/moonar-lander
WORKDIR /usr/src/moonar-lander

# Install moonar-lander dependencies
COPY package.json /usr/src/moonar-lander/
COPY backend/build /usr/src/moonar-lander/backend/build/
COPY frontend/build /usr/src/moonar-lander/frontend/build/
COPY frontend/static /usr/src/moonar-lander/frontend/static
RUN npm install

EXPOSE 4711
CMD [ "node", "./backend/build/index.js" ]