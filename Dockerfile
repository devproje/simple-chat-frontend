FROM node:alpine3.18

RUN npm install -g pnpm

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /opt/client

COPY . .

RUN pnpm install
RUN pnpm build

ENTRYPOINT [ "pnpm", "start", "--hostname", "0.0.0.0" ]
