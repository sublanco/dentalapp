<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PacienteController extends Controller
{
    // Mostrar solamente pacientes activos
    public function index()
    {
        $pacientes = Paciente::where('archivado', false)->get();

        return response()->json($pacientes);
    }

    // Crear un paciente
    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'dni' => 'required|string|max:20|unique:pacientes,dni',
            'fecha_nacimiento' => 'nullable|date',
            'telefono' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:255',
            'obra_social' => 'nullable|string|max:255',
            'numero_afiliado' => 'nullable|string|max:100',
            'observaciones' => 'nullable|string',
        ]);

        $paciente = Paciente::create($datos);

        return response()->json($paciente, 201);
    }

    // Mostrar la ficha de un paciente
    public function show(string $id)
    {
        $paciente = Paciente::find($id);

        if (!$paciente) {
            return response()->json([
                'mensaje' => 'Paciente no encontrado'
            ], 404);
        }

        return response()->json($paciente);
    }

    // Modificar un paciente
    public function update(Request $request, string $id)
    {
        $paciente = Paciente::find($id);

        if (!$paciente) {
            return response()->json([
                'mensaje' => 'Paciente no encontrado'
            ], 404);
        }

        $datos = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'dni' => [
                'required',
                'string',
                'max:20',
                Rule::unique('pacientes', 'dni')->ignore($paciente->id),
            ],
            'fecha_nacimiento' => 'nullable|date',
            'telefono' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:255',
            'obra_social' => 'nullable|string|max:255',
            'numero_afiliado' => 'nullable|string|max:100',
            'observaciones' => 'nullable|string',
        ]);

        $paciente->update($datos);

        return response()->json($paciente);
    }

    // Archivar un paciente en lugar de eliminarlo
    public function destroy(string $id)
    {
        $paciente = Paciente::find($id);

        if (!$paciente) {
            return response()->json([
                'mensaje' => 'Paciente no encontrado'
            ], 404);
        }

        $paciente->archivado = true;
        $paciente->save();

        return response()->json([
            'mensaje' => 'Paciente archivado correctamente'
        ]);
    }

    // Mostrar pacientes archivados
    public function archivados()
    {
        $pacientes = Paciente::where('archivado', true)->get();

        return response()->json($pacientes);
    }

    // Reactivar un paciente archivado
    public function reactivar(string $id)
    {
        $paciente = Paciente::find($id);

        if (!$paciente) {
            return response()->json([
                'mensaje' => 'Paciente no encontrado'
            ], 404);
        }

        $paciente->archivado = false;
        $paciente->save();

        return response()->json([
            'mensaje' => 'Paciente reactivado correctamente'
        ]);
    }
}
