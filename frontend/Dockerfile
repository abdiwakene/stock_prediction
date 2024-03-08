# Define the first stage with a name "builder"
FROM node:20-alpine as builder

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

# Start the second stage for production
FROM node:20-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV HOSTNAME="http://localhost:"

WORKDIR /usr/src/app

COPY package.json ./

# Only install production dependencies
RUN npm install --only=production

# Correctly reference the "builder" stage
COPY --from=builder /usr/src/app/build ./build

# Assuming your build output directory is "build" and not "dist"
# Adjust accordingly if your React app outputs to a different directory

EXPOSE 3000

# Update the command to serve your app correctly
# This command might need to be adjusted based on how you serve your React app
# For example, if you're using serve, it would look something like:
CMD ["npx", "serve", "-s", "build"]
