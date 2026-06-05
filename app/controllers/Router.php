<?php

class Router {
    private $routes = [];

    public function add($uri, $controllerName) {
        $this->routes[$uri] = $controllerName;
    }

    public function dispatch($uri) {
        $method = $_SERVER['REQUEST_METHOD'];

        $uri = rtrim($uri, '/') ?: '/';

        foreach ($this->routes as $route => $controllerName) {
            $routeRegex = '#^' . preg_replace('/\{[a-zA-Z0-9_]+\}/', '([^/]+)', $route) . '$#';

            if (preg_match($routeRegex, $uri, $matches)) {
                array_shift($matches);

                if (!class_exists($controllerName)) {
                    http_response_code(500);
                    echo json_encode(['error' => "Controller '{$controllerName}' not found. Check autoloader!"]);
                    return;
                }

                $controller = new $controllerName();
                $methodToCall = '';

                if ($method === 'POST' && preg_match('#/upload$#', $uri)) {
                    $methodToCall = 'uploadImage';
                } 
                else {
                switch ($method) {
                    case 'GET': $methodToCall = 'get'; break;
                    case 'POST': $methodToCall = 'create'; break;
                    case 'PUT': $methodToCall = 'update'; break;
                    case 'DELETE': $methodToCall = 'delete'; break;
                    default:
                        http_response_code(405);
                        echo json_encode(['error' => 'HTTP Method not supported']);
                        return;
                    }
                }

                if (method_exists($controller, $methodToCall)) {
                    call_user_func_array([$controller, $methodToCall], $matches);
                    return;
                } else {
                    http_response_code(501);
                    echo json_encode(['error' => "Method '{$methodToCall}()' is missing in {$controllerName}"]);
                    return;
                }
            } 
        } 

        http_response_code(404);
        echo json_encode([
            'error' => 'Route not found',
            'debug_uri' => $uri,
            'debug_method' => $method
        ]);
        
    }
} 