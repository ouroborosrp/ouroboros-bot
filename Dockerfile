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
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

RUN bun db:migrate
USER bun
ENTRYPOINT [ "bun", "dev" ]