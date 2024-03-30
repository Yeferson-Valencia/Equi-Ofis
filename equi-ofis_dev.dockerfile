# Utilizamos una imagen base de Python
FROM python:latest

# Instalamos Node.js y npm
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs npm && \
    apt-get clean

# Copiamos los archivos necesarios para la aplicación
COPY requirements.txt /app/requirements.txt

# Instalamos las dependencias de Python para tu aplicación
RUN pip install --no-cache-dir -r /app/requirements.txt

# Instalamos Create React App para poder crear aplicaciones de React
RUN npm install -g create-react-app

# Establecemos el directorio de trabajo
WORKDIR /app
