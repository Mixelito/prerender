#https://hub.docker.com/r/browserless/chrome/dockerfile
#https://www.ubuntuupdates.org/package/google_chrome/stable/main/base/google-chrome-stable
FROM node:9

# Application parameters and variables
ENV CHROME_VERSION=72.0.3626.109-1
ENV application_directory=/usr/src/app
ENV PORT=9090
ENV PAGE_LOAD_TIMEOUT=45000
ENV WAIT_AFTER_LAST_REQUEST=1000
ENV AWS_ACCESS_KEY_ID=
ENV AWS_SECRET_ACCESS_KEY=
ENV S3_BUCKET_NAME=
ENV S3_PREFIX_KEY=
#ENV CHROME_LOCATION="/usr/bin/google-chrome-stable"

# Configuration for Chrome
RUN mkdir -p $application_directory
WORKDIR $application_directory

# Install app dependencies
COPY package.json .
COPY . .

# It's a good idea to use dumb-init to help prevent zombie chrome processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# Install Chrome when specified
RUN apt-get update && apt-get install -y \
	apt-transport-https \
	ca-certificates \
	curl \
  gnupg \
	--no-install-recommends \
	&& curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
	&& echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
	&& apt-get update && apt-get install -y \
	# google-chrome-stable=$CHROME_VERSION \
	google-chrome-stable \
	--no-install-recommends \
	&& rm -rf /var/lib/apt/lists/*

# Build
RUN npm install && npm cache clean --force

# Cleanup
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Add Chrome as a user
RUN groupadd -r chrome && useradd -r -g chrome -G audio,video chrome \
  && mkdir -p /home/chrome/Downloads \
  && chown -R chrome:chrome /home/chrome \
  && chown -R chrome:chrome $application_directory

USER chrome

# Expose the web-socket and HTTP ports
EXPOSE $PORT
ENTRYPOINT ["dumb-init", "--"]
CMD [ "npm", "start" ]


