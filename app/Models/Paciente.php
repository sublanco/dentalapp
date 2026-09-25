
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Paciente extends Model
{
    protected $fillable = [
        'nombre',
        'apellido',
        'dni',
        'fecha_nacimiento',
        'telefono',
        'email',
        'obra_social',
        'observaciones',
    ];

    // Relación con la historia clínica
    public function historiaClinica(): HasOne
    {
        return $this->hasOne(HistoriaClinica::class);
    }
}