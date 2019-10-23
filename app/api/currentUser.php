<?php

class currentUser extends mainApi {

    public function getMethod() {
        header('Content-Type: application/json'); //because we know what content we want print

        if (isset($_SESSION['userId'])) {
            $user = $this->pdo->prepare("Select firstName, lastName from users WHERE id = '{$_SESSION['userId']}' limit 1");

            if ($user->execute() === false) {
                throw new Exception();
            }

            $user = $user->fetch();

            die(json_encode($user));
        } else {
            if (!isset($_GET['login']) || !isset($_GET['password'])) {
                die(json_encode([]));
            }
            
            $passwordHash = hash('sha256', $_GET['password']);
            $user         = $this->pdo->prepare("Select * from users WHERE email = '{$_GET['login']}' AND password = '{$passwordHash}' limit 1");

            if ($user->execute() === false) {
                throw new Exception();
            };

            $user = $user->fetch();

            if (!$user) {
                die(json_encode([]));
            }

            $_SESSION['userId'] = $user['id'];
            die(json_encode($user));
        }
    }

    public function deleteMethod() {
        unset($_SESSION['userId']);
    }

}
