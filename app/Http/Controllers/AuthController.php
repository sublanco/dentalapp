<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $datos = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $clave = 'login:' . $request->ip() . ':' .
            strtolower($datos['email']);

        if (RateLimiter::tooManyAttempts($clave, 5)) {
            throw ValidationException::withMessages([
                'email' => 'Demasiados intentos. Intentá nuevamente más tarde.',
            ]);
        }

        if (!Auth::attempt($datos)) {
            RateLimiter::hit($clave, 60);

            throw ValidationException::withMessages([
                'email' => 'Correo electrónico o contraseña incorrectos.',
            ]);
        }

        RateLimiter::clear($clave);

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Sesión iniciada correctamente',
            'user' => $request->user(),
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Sesión cerrada correctamente',
        ]);
    }
}
