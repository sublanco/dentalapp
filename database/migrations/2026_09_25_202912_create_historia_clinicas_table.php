
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historias_clinicas', function (Blueprint $table) {
            $table->id();

            // Relación con el paciente
            $table->foreignId('paciente_id')
                ->unique()
                ->constrained('pacientes')
                ->cascadeOnDelete();

            // Médico de cabecera
            $table->string('medico_cabecera')->nullable();
            $table->string('telefono_medico')->nullable();
            $table->boolean('servicio_urgencia')->nullable();
            $table->string('servicio_urgencia_cual')->nullable();

            // Antecedentes médicos
            $table->boolean('hospitalizacion')->nullable();
            $table->text('hospitalizacion_motivo')->nullable();

            $table->boolean('tratamiento_medico')->nullable();
            $table->text('tratamiento_medico_cual')->nullable();

            $table->boolean('alergias_medicamentos')->nullable();
            $table->text('alergias_cuales')->nullable();

            $table->boolean('sangrado_excesivo')->nullable();

            // Enfermedades y afecciones
            $table->json('afecciones')->nullable();

            // Medicamentos
            $table->boolean('toma_medicamentos')->nullable();
            $table->text('medicamentos_cuales')->nullable();

            // Movilidad y hábitos
            $table->boolean('cansancio_al_caminar')->nullable();

            $table->boolean('fuma')->nullable();
            $table->string('cantidad_tabaco')->nullable();

            $table->boolean('bebe_alcohol')->nullable();
            $table->string('cantidad_alcohol')->nullable();

            // Preguntas específicas para pacientes mujeres
            $table->boolean('embarazo')->nullable();
            $table->string('embarazo_tiempo')->nullable();

            $table->boolean('radiacion')->nullable();
            $table->text('otros_datos')->nullable();

            // Documentación y observaciones
            $table->boolean('informe_medico')->nullable();
            $table->text('observaciones')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historias_clinicas');
    }
};
