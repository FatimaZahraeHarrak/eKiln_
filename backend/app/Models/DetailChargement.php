<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailChargement extends Model
{
    public function chargement() {
        return $this->belongsTo(Chargement::class, 'id_chargement');
    }

    protected $fillable = ['id_chargement', 'id_famille', 'quantite'];

    public function famille() { return $this->belongsTo(Famille::class, 'id_famille'); }
}
