FROM debian:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y \
    postfix \
    dovecot-core dovecot-imapd dovecot-lmtpd \
    openssl \
    ca-certificates \
    wget \
    curl \
    mailutils \
    sudo \
    && apt-get clean

COPY main.cf /etc/postfix/main.cf
COPY master.cf /etc/postfix/master.cf

COPY dovecot.conf /etc/dovecot/dovecot.conf
COPY 10-ssl.conf /etc/dovecot/conf.d/10-ssl.conf

RUN useradd -m -s /bin/bash mailuser \
    && mkdir -p /var/mail/vhosts \
    && chown -R mailuser:mailuser /var/mail/vhosts

EXPOSE 25 465 587 993

CMD service postfix start && service dovecot start && tail -f /var/log/mail.log
