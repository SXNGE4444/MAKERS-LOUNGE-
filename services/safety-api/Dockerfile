FROM alpine:3.22

ARG PB_VERSION=0.40.4

RUN apk add --no-cache ca-certificates unzip wget

WORKDIR /pb

RUN wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" -O /tmp/pocketbase.zip \
  && unzip /tmp/pocketbase.zip -d /pb \
  && rm /tmp/pocketbase.zip \
  && chmod +x /pb/pocketbase

COPY pb_hooks /pb/pb_hooks
COPY pb_migrations /pb/pb_migrations

RUN mkdir -p /pb/pb_data

EXPOSE 8090

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]
