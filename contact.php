<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recibe los datos del formulario
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    // Validación de datos
    if (empty($name) || empty($email) || empty($message)) {
        // Si algún campo está vacío, muestra un mensaje de error y detiene el proceso
        echo 'Por favor, completa todos los campos.';
        exit;
    }

    // Validación del correo electrónico
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Si el correo electrónico no es válido, muestra un mensaje de error y detiene el proceso
        echo 'El correo electrónico ingresado no es válido.';
        exit;
    }

    // Configura el correo electrónico
    $to = 'pepemanpro.17@gmail.com'; // Cambia por tu dirección de correo electrónico
    $subject = 'Productos Equi-Ofis';
    $body = "Nombre: $name\nCorreo: $email\nMensaje:\n$message";
    $headers = "From: $name <$email>";

    // Envía el correo electrónico
    if (mail($to, $subject, $body, $headers)) {
        // Si el correo se envió correctamente, muestra un mensaje de éxito
        echo '¡El mensaje ha sido enviado con éxito!';
    } else {
        // Si hubo un error al enviar el correo, muestra un mensaje de error
        echo 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.';
    }
} else {
    // Si no se envió el formulario por POST, redireccionar a la página del formulario
    header('Location: about.html');
    exit;
}
?>
