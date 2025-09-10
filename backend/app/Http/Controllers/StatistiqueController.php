<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Famille;
use App\Models\Wagon;
use App\Models\Chargement;
use App\Models\AffectationTrieur;
use Illuminate\Http\Request;

class StatistiqueController extends Controller
{
    public function index()
    {
        $numUtilisateur = User::count();
        $numFamille = Famille::count();
        $numWagon = Wagon::count();
        $numChargement = Chargement::count();
        $numAffectation = AffectationTrieur::count(); // Assurez-vous d'avoir le modèle Affectation

        return response()->json([
            'num_utilisateur' => $numUtilisateur,
            'num_famille' => $numFamille,
            'num_wagon' => $numWagon,
            'num_chargement' => $numChargement,
            'num_affectation' => $numAffectation,
            'username' => auth()->user()->prenom // ou autre champ pour le nom d'utilisateur
        ]);
    }
}
