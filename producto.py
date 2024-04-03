import os
import csv

def guardar_rutas_imagenes(ruta_directorio, archivo_csv):
    with open(archivo_csv, 'w', newline='') as archivo:
        escritor_csv = csv.writer(archivo)
        escritor_csv.writerow(['Nombre', 'Clase', 'Subclase', 'Descripción', 'Ruta'])

        for carpeta_raiz, carpetas, archivos in os.walk(ruta_directorio):
            for archivo in archivos:
                ruta_completa = os.path.join(carpeta_raiz, archivo)
                ruta_relativa = os.path.relpath(ruta_completa, ruta_directorio)
                nombre_archivo, extension = os.path.splitext(archivo)
                subclase = os.path.basename(carpeta_raiz)
                if os.path.basename(os.path.dirname(carpeta_raiz)) == 'Imagenes':
                    clase = None
                else:
                    clase = os.path.basename(os.path.dirname(carpeta_raiz))

                descripcion = ''  # Agrega aquí la lógica para obtener la descripción si es necesario

                escritor_csv.writerow([nombre_archivo, clase, subclase, descripcion, ruta_relativa])

    print(f"Se han guardado las rutas de las imágenes en el archivo {archivo_csv}.")

# Ejemplo de uso
ruta_imagenes = 'assets/Imagenes'
archivo_csv = 'productos.csv'

guardar_rutas_imagenes(ruta_imagenes, archivo_csv)