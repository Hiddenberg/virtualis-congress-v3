FROM --platform=arm64 alpine:latest AS downloader

ARG PB_VERSION=0.36.1

RUN apk add --no-cache unzip wget curl

WORKDIR /db
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_arm64.zip
RUN unzip pocketbase_${PB_VERSION}_linux_arm64.zip


FROM --platform=arm64 alpine:latest

WORKDIR /db
COPY --from=downloader /db/pocketbase /usr/local/bin/pocketbase

EXPOSE 8080

CMD ["pocketbase", "serve", "--http", "0.0.0.0:8080"]