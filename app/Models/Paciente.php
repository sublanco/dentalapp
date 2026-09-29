<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
    public function consultas(): HasMany
{
    return $this->hasMany(Consulta::class);
}
public function odontogramaPiezas()
{
    return $this->hasMany(OdontogramaPieza::class);
}
}