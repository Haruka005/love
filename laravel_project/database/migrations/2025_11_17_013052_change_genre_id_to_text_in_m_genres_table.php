<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         Schema::table('m_genres', function (Blueprint $table) {
            // 既存の genre_id カラムを削除
            $table->dropColumn('genre_id');
        });

        Schema::table('m_genres', function (Blueprint $table) {
            // text 型で再作成
            $table->text('genre_id')->nullable()->after('id');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    { Schema::table('m_genres', function (Blueprint $table) {
            $table->dropColumn('genre_id');
        });

        Schema::table('m_genres', function (Blueprint $table) {
            $table->unsignedBigInteger('genre_id')->nullable()->after('id');
        });

    }
};
