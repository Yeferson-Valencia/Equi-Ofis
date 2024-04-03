import os
from PIL import Image

# Ruta de la carpeta de origen y destino
carpeta_origen = 'assets/Imagenes'
carpeta_destino = 'assets/Imagenes2'

# Iterar sobre cada carpeta y subcarpeta en la carpeta de origen
for ruta_carpeta_origen, carpetas, archivos in os.walk(carpeta_origen):
    # Iterar sobre cada archivo en la carpeta actual
    for archivo in archivos:
        # Obtener la ruta completa del archivo de origen
        ruta_origen = os.path.join(ruta_carpeta_origen, archivo)
        
        # Verificar si el archivo es una imagen
        if os.path.isfile(ruta_origen) and archivo.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            # Abrir la imagen
            imagen = Image.open(ruta_origen)
            
            # Redimensionar la imagen a 800x800
            imagen_resized = imagen.resize((800, 800))
            
            # Obtener la ruta relativa de la carpeta actual en la carpeta de origen
            carpeta_rel = os.path.relpath(ruta_carpeta_origen, carpeta_origen)
            
            # Obtener la ruta completa del archivo de destino
            ruta_destino = os.path.join(carpeta_destino, carpeta_rel, archivo)
            
            # Crear la carpeta de destino si no existe
            os.makedirs(os.path.dirname(ruta_destino), exist_ok=True)
            
            # Guardar la imagen redimensionada en la carpeta de destino
            imagen_resized.save(ruta_destino)
