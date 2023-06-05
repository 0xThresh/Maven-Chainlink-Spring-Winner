FROM node:16.17-alpine
#FROM arm64v8/node:16.17
SHELL ["/bin/bash"]

COPY . /opt/lens-ea

# Install base Lens API packages
WORKDIR /opt/lens-ea/lens-api
RUN ["npm", "i"]

# Install base EA packages
WORKDIR /opt/lens-ea/external-adapter
RUN ["yarn", "install"]

# Expose the listening port
EXPOSE 8080

ENTRYPOINT ["yarn", "start"]
