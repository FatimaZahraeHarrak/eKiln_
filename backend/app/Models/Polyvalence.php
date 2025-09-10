<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Polyvalence extends Model
{
    protected $primaryKey = 'id_polyvalence';
    protected $fillable = ['id_famille', 'id_user'];

    // Relation avec Famille
    public function famille()
    {
        return $this->belongsTo(Famille::class, 'id_famille', 'id_famille');
    }

    // Relation avec User
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }
}
