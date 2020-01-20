FROM node:alpine
# Add an docker user, make work dir
RUN adduser --disabled-password --gecos "" docker && \
  echo "docker ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers && \
  mkdir -p /home/docker/mvp-sample-bizlogic && \
  chown docker:docker /home/docker/mvp-sample-bizlogic

WORKDIR /home/docker/mvp-sample-bizlogic

COPY . ./

RUN npm install

# RUN as docker user
USER docker
CMD node server