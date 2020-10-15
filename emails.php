<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    require_once __DIR__ . '/vendor/phpmailer/phpmailer/src/Exception.php';
    require_once __DIR__ . '/vendor/phpmailer/phpmailer/src/PHPMailer.php';
    require_once __DIR__ . '/vendor/phpmailer/phpmailer/src/SMTP.php';

    // passing true in constructor enables exceptions in PHPMailer

    function SendMail( $username, $email, $validation_code, $is_registration ) {
        $mail = new PHPMailer(true);

        try {
            // Server settings
            //$mail->SMTPDebug = SMTP::DEBUG_SERVER; // for detailed debug output
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            $mail->Username = 'email'; // YOUR gmail email
            $mail->Password = 'password'; // YOUR gmail password

            // Sender and recipient settings
            $mail->setFrom('email', 'Shady Russian Hackers');
            $mail->addAddress( $email, $username );
            $mail->addReplyTo('email', 'Shady Russian Hackers'); // to set the reply to
            $mail->IsHTML(true);

            if ( $is_registration ) {

                $mail->Subject = "Validate your account";
                $mail->Body = 'Hey ' .$username. '! <br/> Thanks for registering at the mapmaker. <br/> Your validation code is: ' .$validation_code.  '.';
            }
            else {
                $mail->IsHTML(true);
                $mail->Subject = "Restore password";
                $mail->Body = 'Hey ' .$username. '! <br/> You requested to restore your password. <br/> Your secret code is: ' .$validation_code.  '.';
            }

            $mail->send();
        } catch (Exception $e) {
            die( "Error in sending email. Mailer Error: {$mail->ErrorInfo}" );
        }    
    }
?>