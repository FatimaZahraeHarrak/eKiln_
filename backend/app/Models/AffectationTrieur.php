<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AffectationTrieur extends Model
{
    protected $table = 'affectation_trieur';
    protected $primaryKey = 'id_affectation';
    protected $fillable = ['date_affectation', 'id_famille', 'id_user_chef','valeur_trieur','id_four'];

    public function chef(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user_chef', 'id_user');
    }

    public function famille(): BelongsTo
    {
        return $this->belongsTo(Famille::class, 'id_famille', 'id_famille');
    }

    public function details(): HasMany
    {
        return $this->hasMany(DetailAffectation::class, 'id_affectation', 'id_affectation');
    }
    public function wagons(): BelongsToMany
    {
        return $this->belongsToMany(
            Wagon::class,
            'affectation_wagon',
            'id_affectation',
            'id_wagon'
        )->withTimestamps();
    }
    public function four()
{
    return $this->belongsTo(Four::class, 'id_four');
}

}
