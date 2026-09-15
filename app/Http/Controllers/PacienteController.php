<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;

class PacienteController extends Controller
{
    public function index()
    {
        $pacientes = Paciente::all();

        return response()->json($pacientes);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $request->validate([
        'nombre' => 'required|string|max:255',
        'apellido' => 'required|string|max:255',
        'dni' => 'required|string|max:20|unique:pacientes,dni',
        'fecha_nacimiento' => 'nullable|date',
        'telefono' => 'nullable|string|max:30',
        'email' => 'nullable|email|max:255',
        'obra_social' => 'nullable|string|max:255',
        'observaciones' => 'nullable|string',
    ]);

    $paciente = Paciente::create($request->all());

    return response()->json($paciente, 201);
}

    /**
     * Display the specified resource.
     */
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

    /**
     * Update the specified resource in storage.
     */
   public function update(Request $request, string $id)
{
    $paciente = Paciente::find($id);

    if (!$paciente) {
        return response()->json([
            'mensaje' => 'Paciente no encontrado'
        ], 404);
    }

    $request->validate([
        'nombre' => 'required|string|max:255',
        'apellido' => 'required|string|max:255',
        'dni' => 'required|string|max:20|unique:pacientes,dni,' . $id,
        'fecha_nacimiento' => 'nullable|date',
        'telefono' => 'nullable|string|max:30',
        'email' => 'nullable|email|max:255',
        'obra_social' => 'nullable|string|max:255',
        'observaciones' => 'nullable|string',
    ]);

    $paciente->update($request->all());

    return response()->json($paciente);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
{
    $paciente = Paciente::find($id);

    if (!$paciente) {
        return response()->json([
            'mensaje' => 'Paciente no encontrado'
        ], 404);
    }

    $paciente->delete();

    return response()->json([
        'mensaje' => 'Paciente eliminado correctamente'
    ]);
}
}
