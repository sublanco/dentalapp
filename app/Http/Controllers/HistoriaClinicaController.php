<?php

namespace App\Http\Controllers;

use App\Models\HistoriaClinica;
use App\Models\Paciente;
use Illuminate\Http\Request;

class HistoriaClinicaController extends Controller
{
    /**
     * Mostrar todas las historias clínicas.
     */
    public function index()
    {
        $historias = HistoriaClinica::with('paciente')->get();

        return response()->json($historias);
    }

    /**
     * Crear una historia clínica.
     */
    public function store(Request $request)
    {
        $datos = $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',

            'medico_cabecera' => 'nullable|string',
            'telefono_medico' => 'nullable|string',
            'servicio_urgencia' => 'nullable|boolean',
            'servicio_urgencia_cual' => 'nullable|string',

            'hospitalizacion' => 'nullable|boolean',
            'hospitalizacion_motivo' => 'nullable|string',
            'tratamiento_medico' => 'nullable|boolean',
            'tratamiento_medico_cual' => 'nullable|string',
            'alergias_medicamentos' => 'nullable|boolean',
            'alergias_cuales' => 'nullable|string',
            'sangrado_excesivo' => 'nullable|boolean',

            'afecciones' => 'nullable|array',

            'toma_medicamentos' => 'nullable|boolean',
            'medicamentos_cuales' => 'nullable|string',

            'cansancio_al_caminar' => 'nullable|boolean',
            'fuma' => 'nullable|boolean',
            'cantidad_tabaco' => 'nullable|string',
            'bebe_alcohol' => 'nullable|boolean',
            'cantidad_alcohol' => 'nullable|string',

            'embarazo' => 'nullable|boolean',
            'embarazo_tiempo' => 'nullable|string',
            'radiacion' => 'nullable|boolean',
            'otros_datos' => 'nullable|string',

            'informe_medico' => 'nullable|boolean',
            'observaciones' => 'nullable|string',
        ]);

        $historia = HistoriaClinica::create($datos);

        return response()->json($historia, 201);
    }

    /**
     * Mostrar una historia clínica.
     */
   public function show($id)
{
    $historia = HistoriaClinica::with('paciente')
        ->where('paciente_id', $id)
        ->firstOrFail();

    return response()->json($historia);
}

    /**
     * Actualizar una historia clínica.
     */
    public function update(Request $request, $id)
{
    $historiaClinica = HistoriaClinica::findOrFail($id);

    $datos = $request->validate([
        'paciente_id' => 'sometimes|exists:pacientes,id',

        'medico_cabecera' => 'nullable|string',
        'telefono_medico' => 'nullable|string',
        'servicio_urgencia' => 'nullable|boolean',
        'servicio_urgencia_cual' => 'nullable|string',

        'hospitalizacion' => 'nullable|boolean',
        'hospitalizacion_motivo' => 'nullable|string',
        'tratamiento_medico' => 'nullable|boolean',
        'tratamiento_medico_cual' => 'nullable|string',
        'alergias_medicamentos' => 'nullable|boolean',
        'alergias_cuales' => 'nullable|string',
        'sangrado_excesivo' => 'nullable|boolean',

        'afecciones' => 'nullable|array',

        'toma_medicamentos' => 'nullable|boolean',
        'medicamentos_cuales' => 'nullable|string',

        'cansancio_al_caminar' => 'nullable|boolean',
        'fuma' => 'nullable|boolean',
        'cantidad_tabaco' => 'nullable|string',
        'bebe_alcohol' => 'nullable|boolean',
        'cantidad_alcohol' => 'nullable|string',

        'embarazo' => 'nullable|boolean',
        'embarazo_tiempo' => 'nullable|string',
        'radiacion' => 'nullable|boolean',
        'otros_datos' => 'nullable|string',

        'informe_medico' => 'nullable|boolean',
        'observaciones' => 'nullable|string',
    ]);

    $historiaClinica->update($datos);

    return response()->json($historiaClinica);
}

    /**
     * Eliminar una historia clínica.
     */
    public function destroy($id)
{
    $historiaClinica = HistoriaClinica::findOrFail($id);

    $historiaClinica->delete();

    return response()->json([
        'mensaje' => 'Historia clínica eliminada correctamente'
    ]);
}
}