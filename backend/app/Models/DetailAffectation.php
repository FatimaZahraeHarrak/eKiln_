<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailAffectation extends Model
{
    protected $table = 'detail_affectation';
    protected $primaryKey = 'id_detail_affectation';
    protected $fillable = ['id_affectation', 'id_user', 'id_famille', 'quantite_tri','valeur_trieur'];

    public function affectation(): BelongsTo
    {
        return $this->belongsTo(AffectationTrieur::class, 'id_affectation', 'id_affectation');
    }

    public function trieur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function famille(): BelongsTo
    {
        return $this->belongsTo(Famille::class, 'id_famille', 'id_famille');
    }
}
