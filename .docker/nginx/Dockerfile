FROM nginx:1.29-alpine

COPY ./firewall /usr/share/nginx/html/
COPY ./docker /usr/share/nginx/html/
COPY ./proxy /usr/share/nginx/html/
COPY ./ssl /usr/share/nginx/html/
COPY ./home /usr/share/nginx/html/

COPY index.html /usr/share/nginx/html/index.html

