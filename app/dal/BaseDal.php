<?php

abstract class BaseDal
{
    protected $db;
    protected $table;
    protected $primaryKey = 'id';

    public function __construct($db) {
        $this->db = $db;
    }

    protected function query($sql, $params = []) {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $stmt;
    }

    public function getById($id) {
        $sql = "SELECT * FROM {$this->table} WHERE {$this->primaryKey} = :id LIMIT 1";
        
        $stmt = $this->query($sql, ['id' => $id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result ?: null;
    }

    public function getAll($conditions = [], $orderBy = '', $direction = 'ASC') {
        $sql = "SELECT * FROM {$this->table}";
        $params = [];

        if (!empty($conditions)) {
            $clauses = [];

            foreach ($conditions as $key => $value) {
                $clauses[] = "{$key} = :{$key}";
                $params[$key] = $value;
            }

            $sql .= " WHERE " . implode(' AND ', $clauses);
        }

        if ($orderBy !== '') {
            $direction = strtoupper($direction) === 'DESC'
                ? 'DESC'
                : 'ASC';

            $sql .= " ORDER BY {$orderBy} {$direction}";
        }

        return $this->query($sql, $params)
            ->fetchAll(PDO::FETCH_ASSOC);
    }

    public function insert($data) {
        $keys = array_keys($data);

        $fields = implode(', ', $keys);
        $placeholders = ':' . implode(', :', $keys);

        $sql = "INSERT INTO {$this->table} ({$fields})
                VALUES ({$placeholders})";

        $this->query($sql, $data);

        return $this->db->lastInsertId();
    }

    public function update($id, $data) {
        $fields = '';

        foreach ($data as $key => $value) {
            $fields .= "{$key} = :{$key}, ";
        }

        $fields = rtrim($fields, ', ');

        $sql = "UPDATE {$this->table}
                SET {$fields}
                WHERE {$this->primaryKey} = :primary_key_value";

        $data['primary_key_value'] = $id;

        $stmt = $this->query($sql, $data);

        return $stmt->rowCount() > 0;
    }

    public function delete($id) {
        $sql = "DELETE FROM {$this->table}
                WHERE {$this->primaryKey} = :id";

        $stmt = $this->query($sql, ['id' => $id]);

        return $stmt->rowCount() > 0;
    }
}