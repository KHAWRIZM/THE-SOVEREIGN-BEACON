# 🦅 THE SOVEREIGN CONTAINER
FROM python:3.9-slim

# Install System Dependencies
RUN apt-get update && apt-get install -y apache2 && apt-get clean

# Setup Python Environment
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

# Setup Apache
COPY . /var/www/html/
RUN rm /var/www/html/index.html 
# (Apache default index removal if needed, but we overwrite anyway)

# Expose Ports
EXPOSE 80 5000

# Start Command (Apache + Brain)
CMD service apache2 start && python /var/www/html/brain.py
