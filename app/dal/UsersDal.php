<?php

class UsersDal {
    protected $db;
    protected $table = 'users';

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function getByUsername($username) {
        $sql = "SELECT * FROM {$this->table}
                WHERE username = :username
                LIMIT 1";

        $stmt = $this->db->prepare($sql);

        $stmt->execute(['username' => $username]);

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }
}