# Stage 1: Build the Angular app
#FROM node:16.16.0-alpine as build
#WORKDIR /usr/src/app
#COPY package*.json ./
#RUN npm ci
#COPY . .
#RUN npm run build

# Stage 2: Serve the built Angular app using Nginx
#FROM nginx:1.21.0-alpine
#COPY --from=build /usr/src/app/dist/<your-angular-app-name> /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

# Use Alpine Linux as parent image
FROM node:16.16.0-alpine as node

# Working Directory
WORKDIR /app
COPY package*.json ./
COPY . .
# Copy the current directory contents into the container at /app
# COPY . .
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm install --force 
# Install any needed packages specified in package.json
# RUN npm install --force
# COPY . .
# Build the Angular application
RUN npm run build --prod

# Stage 2: Create the Nginx server
FROM nginx:alpine
COPY --from=node /app/dist/job_board_fnd /usr/share/nginx/html
# # Remove the default Nginx configuration
# RUN rm -rf /etc/nginx/conf.d

# Copy the Angular build files to the Nginx web root directory
# COPY --from=build /app/dist /usr/share/nginx/html

# # Copy a custom Nginx configuration file
# COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

#FROM nginx:alpine
#COPY --from=node /app/dist/angular-app /usr/share/nginx/html

# Start command
CMD ["nginx", "-g", "daemon off;"]