import os
from PIL import Image

# Ruta de la carpeta de origen y destino
carpeta_origen = '/home/yeferson/Escritorio/Equi-ofis/assets/Imagenes'
carpeta_destino = '/home/yeferson/Escritorio/Equi-ofis/assets/Imagenes2'

# Iterar sobre cada carpeta y subcarpeta en la carpeta de origen
for ruta_carpeta_origen, carpetas, archivos in os.walk(carpeta_origen):
    # Iterar sobre cada archivo en la carpeta actual
    for archivo in archivos:
        # Obtener la ruta completa del archivo de origen
        ruta_origen = os.path.join(ruta_carpeta_origen, archivo)
        
        # Verificar si el archivo es una imagen
        if os.path.isfile(ruta_origen) and archivo.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            # Crear la carpeta de destino si no existe
            carpeta_destino_rel = os.path.join(carpeta_destino, os.path.relpath(ruta_carpeta_origen, carpeta_origen))
            os.makedirs(carpeta_destino_rel, exist_ok=True)
            
            # Abrir la imagen
            imagen = Image.open(ruta_origen)
            
            # Optimizar y guardar la imagen
            ruta_destino = os.path.join(carpeta_destino_rel, archivo)
            imagen.save(ruta_destino, optimize=True)
