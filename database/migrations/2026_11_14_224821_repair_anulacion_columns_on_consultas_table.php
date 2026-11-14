<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('consultas', 'anulada')) {
            Schema::table('consultas', function (Blueprint $table) {
                $table->boolean('anulada')->default(false);
            });
        }

        if (!Schema::hasColumn('consultas', 'fecha_anulacion')) {
            Schema::table('consultas', function (Blueprint $table) {
                $table->timestamp('fecha_anulacion')->nullable();
            });
        }

        if (!Schema::hasColumn('consultas', 'motivo_anulacion')) {
            Schema::table('consultas', function (Blueprint $table) {
                $table->text('motivo_anulacion')->nullable();
            });
        }
    }

    public function down(): void
    {
        // No eliminamos columnas para proteger
        // los registros de anulación existentes.
    }
};