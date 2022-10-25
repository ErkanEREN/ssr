# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 18, 16, 14, 18-bullseye, 16-bullseye, 14-bullseye, 18-buster, 16-buster, 14-buster
ARG VARIANT=16-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}
# Install MongoDB command line tools - though mongo-database-tools not available on arm64
# VOLUME /workspaces/ssr
# ARG MONGO_TOOLS_VERSION=6.0
ARG PORT="9000"
# ARG MONGO_CONNECTION_STRING="mongodb://DEFAULT_MONGO_USERNAME:DEFAULT_MONGO_PASSWORD@localhost:27017/reaxpresst?authSource=admin&authMechanism=SCRAM-SHA-256&readPreference=primary&ssl=false"
RUN . /etc/os-release \
#    && curl -sSL "https://www.mongodb.org/static/pgp/server-${MONGO_TOOLS_VERSION}.asc" | gpg --dearmor > /usr/share/keyrings/mongodb-archive-keyring.gpg \
#    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg] http://repo.mongodb.org/apt/debian ${VERSION_CODENAME}/mongodb-org/${MONGO_TOOLS_VERSION} main" | tee /etc/apt/sources.list.d/mongodb-org-${MONGO_TOOLS_VERSION}.list \
    && apt-get update && export DEBIAN_FRONTEND=noninteractive \
#    && apt-get -y install mongodb-mongosh \
#    && if [ "$(dpkg --print-architecture)" = "amd64" ]; then apt-get -y install mongodb-database-tools; fi \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*
ENV PORT="${PORT}"
# ENV MONGO_CONNECTION_STRING="${MONGO_CONNECTION_STRING}"
# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node packages
# RUN su node -c "npm install -g <your-package-list -here>"
