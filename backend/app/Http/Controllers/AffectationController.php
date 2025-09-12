<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AffectationTrieur;
use App\Models\DetailAffectation;
use App\Models\Famille;
use App\Models\Chargement;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AffectationController extends Controller
{
 public function store(Request $request)
{
    $request->validate([
        'id_famille' => 'required|exists:familles,id_famille',
        'id_four' => 'required|exists:fours,id_four',
        'id_wagons' => 'required|array',
        'id_wagons.*' => 'exists:wagons,id_wagon',
        'trieurs' => 'required|array',
        'trieurs.*.id' => 'exists:users,id_user',
        'trieurs.*.quantite' => 'required|numeric|min:0.1',
        'trieurs.*.valeur_trieur' => 'required|numeric|min:1', 
    ]);

    try {
        foreach ($request->trieurs as $trieur) {
            if (!$this->checkTrieurProductivity($trieur['id'], $trieur['quantite'], $request->id_famille, $trieur['valeur_trieur'])) {
                return response()->json([
                    'message' => 'Le trieur ' . $trieur['id'] . ' a déjà atteint 100% de productivité pour cet intervalle',
                    'error' => 'Productivité maximale atteinte'
                ], 400);
            }
        }

        
        $affectation = AffectationTrieur::create([
            'date_affectation' => now(),
            'id_famille' => $request->id_famille,
            'id_user_chef' => Auth::id(),
            'id_four' => $request->id_four
        ]);

        
        $affectation->wagons()->sync($request->id_wagons);

        
        foreach ($request->trieurs as $trieur) {
            DetailAffectation::create([
                'id_affectation' => $affectation->id_affectation,
                'id_user' => $trieur['id'],
                'id_famille' => $request->id_famille,
                'quantite_tri' => $trieur['quantite'],
                'valeur_trieur' => $trieur['valeur_trieur'], 
            ]);
        }

        return response()->json($affectation->load(['details.trieur', 'wagons']), 201);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de la création',
            'error' => $e->getMessage()
        ], 500);
    }
}

private function calculateTotalNeeded($id_famille)
{
    $now = now();
    $currentHour = $now->hour;

    if ($currentHour >= 5 && $currentHour < 14) {
        $start = $now->copy()->setTime(5, 0, 0);
        $end = $now->copy()->setTime(14, 0, 0);
    } elseif ($currentHour >= 14 && $currentHour < 22) {
        $start = $now->copy()->setTime(14, 0, 0);
        $end = $now->copy()->setTime(22, 0, 0);
    } else {
        $start = $now->copy()->setTime(22, 0, 0);
        $end = $now->copy()->addDay()->setTime(5, 0, 0);
    }
    
    $totalPieces = Chargement::whereBetween('datetime_sortieEstime', [$start, $end])
        ->whereIn('statut', ['en attente', 'en cuisson', 'prêt à sortir', 'sorti'])
        ->with(['details' => function($query) use ($id_famille) {
            $query->where('id_famille', $id_famille);
        }])
        ->get()
        ->sum(function($chargement) {
            return $chargement->details->sum('quantite');
        });

    return $totalPieces;
}
    public function index()
{
    try {
        $affectations = AffectationTrieur::with(['famille', 'details.trieur'])
            ->orderBy('date_affectation', 'desc')
            ->get();

        return response()->json($affectations);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de la récupération des affectations',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function getAffectationsByInterval()
    {
        $now = Carbon::now();
        $currentHour = $now->hour;

        
        if ($currentHour >= 5 && $currentHour < 14) {
            $start = $now->copy()->setTime(5, 0, 0);
            $end = $now->copy()->setTime(14, 0, 0);
        } elseif ($currentHour >= 14 && $currentHour < 22) {
            $start = $now->copy()->setTime(14, 0, 0);
            $end = $now->copy()->setTime(22, 0, 0);
        } else {
            $start = $now->copy()->setTime(22, 0, 0);
            $end = $now->copy()->addDay()->setTime(5, 0, 0);
        }

        
        $affectations = AffectationTrieur::with(['famille', 'details.trieur'])
            ->whereBetween('date_affectation', [$start, $end])
            ->get()
            ->groupBy('id_famille');

        return response()->json([
            'affectations' => $affectations,
            'interval' => [
                'start' => $start->format('H:i'),
                'end' => $end->format('H:i')
            ]
        ]);
    }

    public function getAffectationsByFamille($id_famille)
    {
        $affectations = AffectationTrieur::with(['details.trieur'])
            ->where('id_famille', $id_famille)
            ->orderBy('date_affectation', 'desc')
            ->get();

        return response()->json($affectations);
    }
    

public function getAffectationsByCurrentInterval()
{
    $now = Carbon::now();
    $currentHour = $now->hour;

    
    if ($currentHour >= 5 && $currentHour < 14) {
        $start = $now->copy()->setTime(5, 0, 0);
        $end = $now->copy()->setTime(14, 0, 0);
    } elseif ($currentHour >= 14 && $currentHour < 22) {
        $start = $now->copy()->setTime(14, 0, 0);
        $end = $now->copy()->setTime(22, 0, 0);
    } else {
        $start = $now->copy()->setTime(22, 0, 0);
        $end = $now->copy()->addDay()->setTime(5, 0, 0);
    }

    
    $affectations = AffectationTrieur::with(['famille', 'details.trieur'])
        ->whereBetween('date_affectation', [$start, $end])
        ->orderBy('date_affectation', 'desc')
        ->get();

    return response()->json([
        'affectations' => $affectations,
        'interval' => [
            'start' => $start->format('H:i'),
            'end' => $end->format('H:i')
        ]
    ]);
}
public function getAffectationWithDetails($id)
{
    try {
        $affectation = AffectationTrieur::with([
            'famille',
            'details.trieur',
            'details.famille',
            'wagons'
        ])->findOrFail($id);

        return response()->json($affectation);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Affectation non trouvée',
            'error' => $e->getMessage()
        ], 404);
    }
}
public function getAffectationsByWagonGroup()
{
    try {
        $affectations = AffectationTrieur::with([
            'famille',
            'details.trieur',
            'wagons:id_wagon,num_wagon'
        ])
        ->orderBy('date_affectation', 'desc')
        ->get()
        ->groupBy(function($item) {
            return $item->wagons->pluck('num_wagon')->sort()->join(', ');
        });

        return response()->json($affectations);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de la récupération',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function getAffectationsByWagons(Request $request)
{
    try {
        $wagonIds = explode(',', $request->input('wagon_ids'));

        $affectations = AffectationTrieur::with(['famille', 'details.trieur', 'wagons'])
            ->whereHas('wagons', function($q) use ($wagonIds) {
                $q->whereIn('id_wagon', $wagonIds);
            })
            ->orderBy('date_affectation', 'desc')
            ->get();

        return response()->json($affectations);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de la récupération',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function show($id)
{
    try {
        $affectation = AffectationTrieur::with([
            'famille',
            'details.trieur',
            'details.famille',
            'wagons'
        ])->findOrFail($id);

        return response()->json($affectation);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Affectation non trouvée',
            'error' => $e->getMessage()
        ], 404);
    }
}
public function getAffectationsWithDetails()
{
    try {
        $affectations = AffectationTrieur::with([
            'famille',
            'details.trieur',
            'chef:id_user,nom,prenom',
            'wagons:id_wagon,num_wagon'

        ])
        ->orderBy('date_affectation', 'desc')
        ->get();

        return response()->json($affectations);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de la récupération',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function getAffectationsGroupedByInterval()
{
    try {
        $affectations = AffectationTrieur::with([
            'famille',
            'details.trieur',
            'chef:id_user,nom,prenom',
            'wagons:id_wagon,num_wagon'
        ])
        ->orderBy('date_affectation', 'desc')
        ->get()
        ->groupBy(function($item) {
            $date = Carbon::parse($item->date_affectation);
            $hour = $date->hour;

            if ($hour >= 5 && $hour < 14) {
                return $date->format('d/m/Y') . ' - Matin (5h-14h)';
            } elseif ($hour >= 14 && $hour < 22) {
                return $date->format('d/m/Y') . ' - Après-midi (14h-22h)';
            } else {
                return $date->format('d/m/Y') . ' - Nuit (22h-5h)';
            }
        });

        return response()->json($affectations);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de la récupération',
            'error' => $e->getMessage()
        ], 500);
    }
}
private function checkTrieurProductivity($trieurId, $quantite, $idFamille, $valeurTrieur)
{
    $now = now();
    $currentHour = $now->hour;

    
    if ($currentHour >= 5 && $currentHour < 14) {
        $start = $now->copy()->setTime(5, 0, 0);
        $end = $now->copy()->setTime(14, 0, 0);
    } elseif ($currentHour >= 14 && $currentHour < 22) {
        $start = $now->copy()->setTime(14, 0, 0);
        $end = $now->copy()->setTime(22, 0, 0);
    } else {
        $start = $now->copy()->setTime(22, 0, 0);
        $end = $now->copy()->addDay()->setTime(5, 0, 0);
    }

    
    $existingAffectations = DetailAffectation::where('id_user', $trieurId)
        ->whereHas('affectation', function($q) use ($start, $end) {
            $q->whereBetween('date_affectation', [$start, $end]);
        })
        ->get();

    
    $totalProductivity = 0;
    foreach ($existingAffectations as $affectation) {
        
        $totalProductivity += ($affectation->quantite_tri * 100) / $affectation->valeur_trieur;
    }

    
    $newProductivity = ($quantite * 100) / $valeurTrieur;

    
    return ($totalProductivity + $newProductivity) <= 100;
}

    public function historyy(Request $request)
    {
        $query = DetailAffectation::with([
                'affectation.chef',
                'affectation.four',
                'trieur'
            ])
            ->join('affectation_trieur', 'detail_affectation.id_affectation', '=', 'affectation_trieur.id_affectation')
            ->select('detail_affectation.*', 'affectation_trieur.id_four');

        
        if ($request->period === 'today') {
            $query->whereBetween('affectation_trieur.date_affectation', [
                Carbon::today()->startOfDay(),
                Carbon::today()->endOfDay(),  
            ]);
        } elseif ($request->period === 'weekly') {
            $query->whereBetween('affectation_trieur.date_affectation', [
                Carbon::now()->startOfWeek(),
                Carbon::now()->endOfWeek()
            ]);
        } elseif ($request->period === 'personalized' && $request->start_date && $request->end_date) {
            $query->whereBetween('affectation_trieur.date_affectation', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59'
            ]);
        }

        return $query->get()
            ->map(function($detail) {
                return [
                    'id' => $detail->id_detail_affectation,
                    'date_affectation' => $detail->affectation->date_affectation,
                    'trieur_nom' => $detail->trieur->prenom . ' ' . $detail->trieur->nom,
                    'total_piece' => $detail->quantite_tri,
                    'num_four' => $detail->affectation->four->num_four ?? null,

                    'chef' => [
                        'nom' => $detail->affectation->chef->prenom . ' ' . $detail->affectation->chef->nom,
                        'matricule' => $detail->affectation->chef->matricule

                    ],
                    'trieur_matricule' => $detail->trieur->matricule
                ];
            });
    }

    public function productivity(Request $request)
{
    $request->validate([
        'start_date' => 'required|date',
        'end_date' => 'required|date|after_or_equal:start_date',
    ]);

    try {
        $start = Carbon::parse($request->start_date)->startOfDay();
        $end = Carbon::parse($request->end_date)->endOfDay();

        $productivities = DetailAffectation::with(['trieur', 'famille'])
            ->whereHas('affectation', function($q) use ($start, $end) {
                $q->whereBetween('date_affectation', [$start, $end]);
            })
            ->get()
            ->groupBy('id_user')
            ->map(function($details, $userId) {
                $trieur = $details->first()->trieur;
                $totalProductivity = $details->sum(function($detail) {
                    return ($detail->quantite_tri * 100) / $detail->valeur_trieur;
                });

                return [
                    'id_user' => $userId,
                    'trieur_nom' => $trieur->prenom . ' ' . $trieur->nom,
                    'trieur_matricule' => $trieur->matricule,
                    'total_productivity' => round($totalProductivity, 2),
                    'details' => $details->map(function($detail) {
                        return [
                            'date_affectation' => $detail->affectation->date_affectation,
                            'famille' => $detail->famille->nom_famille,
                            'quantite_tri' => $detail->quantite_tri,
                            'valeur_trieur' => $detail->valeur_trieur,
                            'productivity' => round(($detail->quantite_tri * 100) / $detail->valeur_trieur, 2),
                        ];
                    })->toArray()
                ];
            })
            ->values();

        return response()->json($productivities);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de la récupération',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
