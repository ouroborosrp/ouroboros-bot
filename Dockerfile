FROM oven/bun:1 as base
WORKDIR /usr/src/app

ARG BOT_TOKEN=${BOT_TOKEN}
ENV BOT_TOKEN=${BOT_TOKEN}

ARG APPLICATION_ID=${APPLICATION_ID}
ENV APPLICATION_ID=${APPLICATION_ID}

ARG BOT_SECRET=${BOT_SECRET}
ENV BOT_SECRET=${BOT_SECRET}

ARG ADMINS=${ADMINS}
ENV ADMINS=${ADMINS}

FROM base AS install
RUN mkdir -p /temp/deps
COPY package.json bun.lockb /temp/deps/
RUN cd /temp/deps && bun install

FROM base AS release
COPY --from=install /temp/deps/node_modules node_modules
COPY . .

RUN mkdir -p /usr/src/app/data
RUN bun db:migrate
ENTRYPOINT [ "bun", "dev" ]