<?php

require_once __DIR__ . '/../dal/UsersDal.php';


class UsersModel
{
    private $usersDal;

    public function __construct(UsersDal $usersDal) {
        $this->usersDal = $usersDal;
    }

    public function authenticate($username, $password) {
        if (empty($username) || empty($password)) {
            return null;
        }

        $user = $this->usersDal->getByUsername($username);

        if ($user === null) {
            return null;
        }

        $hashedPassword = hash('sha256', $password);

        if ($hashedPassword !== $user['password']) {
            return null;
        }

        return $user;
    }
}
