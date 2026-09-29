<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consulta extends Model
{
    protected $fillable = [
        'paciente_id',
        'fecha_consulta',
        'motivo_consulta',
        'diagnostico',
        'tratamiento',
        'observaciones',
    ];

    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class);
    }
}