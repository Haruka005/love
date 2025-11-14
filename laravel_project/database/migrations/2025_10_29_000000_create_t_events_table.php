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
    Schema::create('t_events', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id');
        $table->string('name');
        $table->string('catchphrase')->nullable();
        $table->text('description')->nullable();
        $table->dateTime('start_date')->nullable();
        $table->dateTime('end_date')->nullable();
        $table->string('location')->nullable();
        $table->string('url')->nullable();
        $table->string('organizer')->nullable();
        $table->boolean('is_free_participation')->default(false);
        $table->boolean('is_open_enrollment')->default(true);
        $table->unsignedTinyInteger('approval_status_id')->nullable();
        $table->text('rejection_reason')->nullable();
        $table->string('image_path')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_events');
    }
};
