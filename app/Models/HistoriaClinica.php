<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoriaClinica extends Model
{
    protected $table = 'historias_clinicas';
    
    protected $fillable = [
        'paciente_id',

        // Médico de cabecera
        'medico_cabecera',
        'telefono_medico',
        'servicio_urgencia',
        'servicio_urgencia_cual',

        // Antecedentes médicos
        'hospitalizacion',
        'hospitalizacion_motivo',
        'tratamiento_medico',
        'tratamiento_medico_cual',
        'alergias_medicamentos',
        'alergias_cuales',
        'sangrado_excesivo',

        // Enfermedades y afecciones
        'afecciones',

        // Medicamentos
        'toma_medicamentos',
        'medicamentos_cuales',

        // Hábitos y movilidad
        'cansancio_al_caminar',
        'fuma',
        'cantidad_tabaco',
        'bebe_alcohol',
        'cantidad_alcohol',

        // Datos específicos
        'embarazo',
        'embarazo_tiempo',
        'radiacion',
        'otros_datos',

        // Documentación y observaciones
        'informe_medico',
        'observaciones',
    ];

    protected function casts(): array
    {
        return [
            'servicio_urgencia' => 'boolean',
            'hospitalizacion' => 'boolean',
            'tratamiento_medico' => 'boolean',
            'alergias_medicamentos' => 'boolean',
            'sangrado_excesivo' => 'boolean',
            'afecciones' => 'array',
            'toma_medicamentos' => 'boolean',
            'cansancio_al_caminar' => 'boolean',
            'fuma' => 'boolean',
            'bebe_alcohol' => 'boolean',
            'embarazo' => 'boolean',
            'radiacion' => 'boolean',
            'informe_medico' => 'boolean',
        ];
    }

    // Relación con el paciente
    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class);
    }
}
